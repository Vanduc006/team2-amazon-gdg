import modal
from modal import Image
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

# Modal Stub
stub = modal.App("distilbert-sentiment-api")

# Define Modal image and add model directory
image = Image.debian_slim().pip_install(
    "torch", "transformers", "fastapi", "uvicorn", "modal","supabase"
)
image = image.add_local_dir("./distilbert-sentiment", "/model")

# Create FastAPI app
web_app = FastAPI()

origins = [
    "http://127.0.0.1:5173",        # React local dev
    "https://team2-amazon-gdg.vercel.app/",    # hoặc domain frontend bạn đang dùng
    "*"                             # (không nên dùng trong production)
]

web_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # danh sách origin cho phép
    allow_credentials=True,
    allow_methods=["*"],            # cho tất cả phương thức
    allow_headers=["*"],            # cho tất cả headers
)

# Global variables for model, tokenizer and labels
model = None
tokenizer = None
id2label = None
supabase : Client = create_client('https://wblqskhiwsfjvxqhnpqg.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndibHFza2hpd3NmanZ4cWhucHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyOTU4MzcsImV4cCI6MjA2Mjg3MTgzN30.IULd7MH74NnLVmGpXPPQwmmEk4t5KGkCIPoEXoRzXvQ')

@stub.function(image=image)
def load_model():
    global model, tokenizer, id2label
    if model is None:
        model_path = "/model"
        model = AutoModelForSequenceClassification.from_pretrained(model_path)
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        model.eval()
        with open(f"{model_path}/label2id.json", "r") as f:
            label2id = json.load(f)
        id2label = {int(v): k for k, v in label2id.items()}
    return model, tokenizer, id2label

class InputText(BaseModel):
    text: str
    reviewID: str

@web_app.post("/predict")
async def predict(input: InputText):
    global model, tokenizer, id2label
    if model is None:
        model, tokenizer, id2label = load_model.remote()
    
    inputs = tokenizer(input.text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        predicted_id = torch.argmax(probs, dim=1).item()
        predicted_label = id2label[predicted_id]
    return {
        "label": predicted_label,
        "probabilities": {
            id2label[i]: round(p, 4) for i, p in enumerate(probs.squeeze().tolist())
        }
    }

@web_app.post("/realtime")
async def predict(input: InputText):
    start = (
        supabase.table("review")
        .update({"status" : "Processing"})
        .eq("reviewID",input.reviewID)
        .execute()
    )
    global model, tokenizer, id2label
    if model is None:
        model, tokenizer, id2label = load_model.remote()
    
    inputs = tokenizer(input.text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        predicted_id = torch.argmax(probs, dim=1).item()
        predicted_label = id2label[predicted_id]
    end = (
        supabase.table("review")
        .update({
            "status" : "Done",
            "predict" : predicted_label,
        })
        .eq("reviewID",input.reviewID)
        .execute()
    )
    return {
        "label": predicted_label,
        "probabilities": {
            id2label[i]: round(p, 4) for i, p in enumerate(probs.squeeze().tolist())
        }
    }

@stub.function(image=image)
@modal.asgi_app()
def app():
    return web_app 
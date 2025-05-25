import requests
import json

def create_summary(content,key) :
    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
            "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
        },
        data=json.dumps({
            "model": "qwen/qwen3-30b-a3b:free",
            "messages": [
            {
            "role": "user",
            "content": f"Please provide a short and concise summary of the following e-commerce customer review. Do not include explanations or extra comments. If the content is a URL, return [URL].\n\nReview: {content}"
            }


            ],
            
        })
    )

    return response.json()
from flask import Flask, request, jsonify
from csv2json import csv2json, csv2json_string  # import từ file khác
from supabase import create_client
from flask_cors import CORS
# import pandas as pd
import tempfile
import io
import os
from recommend import get_product_recommendations

app = Flask(__name__)
CORS(app, origins=[
    "http://127.0.0.1:5173",
    "https://team2-amazon-gdg.vercel.app"
    ])
bucket = 'json'
supabase = create_client('https://wblqskhiwsfjvxqhnpqg.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndibHFza2hpd3NmanZ4cWhucHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyOTU4MzcsImV4cCI6MjA2Mjg3MTgzN30.IULd7MH74NnLVmGpXPPQwmmEk4t5KGkCIPoEXoRzXvQ')
@app.route('/')
def home():
    return 'Team 2 GDG webservice !'

@app.route('/convert', methods=['POST'])
def convert():
    csv = request.files.get('file')
    if not csv:
        return 'No file uploaded', 400

    try:
        json_result = csv2json_string(csv)
    except Exception as e:
        return {'error': str(e)}, 400

    file_name = f"converted_{csv.filename}"
    
    # Tạo file tạm để ghi JSON
    with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp:
        tmp.write(json_result.encode('utf-8'))
        tmp_path = tmp.name  # Lấy đường dẫn file tạm

    try:
        # Upload file từ đường dẫn
        responsee = supabase.storage.from_('csv').upload(
            path=csv.filename,
            file=csv.read(),
            file_options={
                "content-type": "text/csv"
            },
        )

        response = supabase.storage.from_(bucket).upload(
            path=file_name,
            file=tmp_path,
            file_options={
                "content-type": "application/json"
            },
        )

        insert = (
            supabase.table('object')
            .insert({
                "key" : file_name,
                "type" : "json",
                "parent" : csv.filename
            })
            .execute()
        )

        # Lấy public URL
        public_url = supabase.storage.from_(bucket).get_public_url(file_name)

        return jsonify({
            "message": "ok",
            "url": public_url
        }), 200

    except Exception as e:
        return {'error': str(e)}, 500

    finally:
        os.remove(tmp_path)  # Xóa file tạm sau khi upload


@app.route('/recommend', methods=['POST'])
def create_remmcommend():
    query = request.args.get('method')
    product_id = request.args.get('product_id')
    top_n = request.args.get('top')
    url = request.args.get('url')
    if query == 'cosine' :
        result = get_product_recommendations(product_id=product_id,csv_url=url,top_n=int(top_n))
        return result
        # return 'ok',200
    return 400


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

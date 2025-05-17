from flask import Flask, request
from csv2json import csv2json, csv2json_string  # import từ file khác
# import pandas as pd
import io
import os

app = Flask(__name__)

@app.route('/convert', methods=['POST'])
def convert():
    csv = request.files.get('file')
    if not csv:
        return 'No file uploaded', 400

    json_result = csv2json_string(csv)
    return json_result, 200, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    app.run(debug=True)

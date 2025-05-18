import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import re
import requests
from io import StringIO

def clean_price(price_str):
    """
    Clean price string by removing currency symbols and converting to float
    """
    if pd.isna(price_str):
        return 0.0
    # Remove currency symbols and any non-numeric characters except decimal point
    cleaned = re.sub(r'[^\d.]', '', str(price_str))
    try:
        return float(cleaned)
    except ValueError:
        return 0.0

def get_product_recommendations(product_id=None, product_name=None, top_n=5, csv_url=None):
    """
    Get product recommendations based on product_id or product_name using cosine similarity
    
    Args:
        product_id (str): ID of the product to get recommendations for
        product_name (str): Name of the product to get recommendations for
        top_n (int): Number of recommendations to return
        csv_url (str): URL of the CSV file
        
    Returns:
        list: List of recommended products in JSON format
    """
    try:
        if not csv_url:
            raise ValueError("CSV URL must be provided")

        # Read the CSV file from URL
        response = requests.get(csv_url)
        response.raise_for_status()  # Raise an exception for bad status codes
        csv_content = StringIO(response.text)
        df = pd.read_csv(csv_content)
        
        # Combine relevant text columns for similarity calculation
        text_columns = ['product_name', 'about_product', 'category', 'review_title', 'review_content']
        df['combined_text'] = df[text_columns].fillna('').agg(' '.join, axis=1)
        
        # Create TF-IDF matrix
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(df['combined_text'])
        
        # Calculate cosine similarity
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        
        # Get index of the product
        if product_id:
            idx = df[df['product_id'] == product_id].index[0]
        elif product_name:
            idx = df[df['product_name'] == product_name].index[0]
        else:
            raise ValueError("Either product_id or product_name must be provided")
        
        # Get similarity scores
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Get top N recommendations (excluding the input product)
        sim_scores = sim_scores[1:top_n+1]
        product_indices = [i[0] for i in sim_scores]
        
        # Create recommendations list
        recommendations = []
        for idx in product_indices:
            product = df.iloc[idx]
            recommendation = {
                'product_id': product['product_id'],
                'product_name': product['product_name'],
                'category': product['category'],
                'discounted_price': clean_price(product['discounted_price']),
                'actual_price': clean_price(product['actual_price']),
                'discount_percentage': clean_price(product['discount_percentage']),
                'rating': clean_price(product['rating']),
                'rating_count': int(clean_price(product['rating_count'])),
                'about_product': product['about_product'],
                'img_link': product['img_link'],
                'product_link': product['product_link'],
                'similarity_score': float(sim_scores[product_indices.index(idx)][1])
            }
            recommendations.append(recommendation)
        
        return json.dumps(recommendations, indent=2)
        
    except Exception as e:
        return json.dumps({'error': str(e)})

# Example usage:
# recommendations = get_product_recommendations(
#     product_id='123',
#     csv_url='https://example.com/products.csv'
# )
# print(recommendations)

# recommendations = get_product_recommendations(product_id='B07JW9H4J1')

# print(recommendations)
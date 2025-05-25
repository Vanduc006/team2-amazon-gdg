# Amazon Electronics Customer Feedback Analysis

A comprehensive system for analyzing Amazon electronics customer feedback data, featuring EDA, predictive modeling, clustering, sentiment analysis, and recommendation systems.

## 🔍 Features

- **Data Preprocessing**: Clean raw CSV data, handle missing values, and tokenize text.
- **Exploratory Data Analysis**: Insights on pricing, discounts, ratings, and product popularity.
- **Customer Satisfaction Prediction**: Ensemble ML models (Random Forest + XGBoost) for multi-class classification.
- **Product Clustering**: K-Means and DBSCAN to group products by price, discount, and sentiment.
- **Sentiment Analysis**: Traditional NLP (TF-IDF + SVM) and Deep Learning (BERT/DistilBERT) models.
- **Recommendation System**: Cosine similarity, content-based filtering, and cluster-based suggestions.
- **Interactive Dashboard**: React-based UI with real-time analytics and seller tools.

## 🛠️ Technologies

- **Backend**: Python, Flask, scikit-learn, PyTorch, Transformers (BERT/DistilBERT)
- **Frontend**: React, TypeScript, TailwindCSS, Chart.js
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (Frontend), Render (Backend)

## 📂 Dataset
- **Input**: `amazon.csv` (raw data with columns: `product_link`, `review_content`, `rating`, etc.)
- **Output**: `amazon-cleaned.csv` (processed data for analysis)

## 🚀 Getting Started

### Installation
```bash
git clone https://github.com/Vanduc006/team2-amazon-gdg.git

# Install dependencies
pip install -r requirements.txt  # Backend
cd frontend && npm install      # Frontend

# Amazon Electronics Customer Feedback Analysis

A comprehensive system for analyzing Amazon electronics customer feedback data, featuring EDA, predictive modeling, clustering, sentiment analysis, and recommendation systems.
We suggest you to check our website: [GDG_Team2_Website](https://team2-amazon-gdg.vercel.app/)
A full tutorial to the website can be found at: [GDG_Team2_Tutorial](https://drive.google.com/file/d/1SfrQ133PhjvsT3mR5t586bCiGah5yr3p/view?fbclid=IwY2xjawKf3xhleHRuA2FlbQIxMAABHtGUr3AhzpNcLQOwtkOyIyMxH_iByH8oZTluupq_ZetnXSTtn7Ega92p4b_6_aem_3h2IDz2PpWOLXmjyhSkfag)

Detailed documentation: [GDG_Team2_Doc](https://hackmd.io/@h7yHNbu-RVqPJ6yR0D2Kxw/S1EI88JGee)

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

## 📂 Code structure
The implementation can be found in each coressponding folder for tasks.
1. Data cleaning and Preprocessing
2. Exploratory Data Analysis (EDA)
3. Customer Satisfaction Prediction
4. Product Category Clustering
5. Review Sentiment Analysis
6. Recommendation System
7. API Deployment (can be found at `vanduc006` branch) 


## 🚀 Getting Started

### Installation
```bash
git clone https://github.com/Vanduc006/team2-amazon-gdg.git

# Install dependencies
pip install -r requirements.txt  # Backend
cd frontend && npm install      # Frontend

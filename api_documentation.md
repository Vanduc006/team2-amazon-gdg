# API Documentation

## Base URL
```
http://{{url}}
```
Default: `http://127.0.0.1:5000`

## Authentication
No authentication required for these endpoints.

## Endpoints

### 1. Convert CSV to JSON
Converts CSV file to JSON format and stores it in Supabase.

**Endpoint:** `/convert`  
**Method:** `POST`  
**Content-Type:** `multipart/form-data`

#### Request Body
| Parameter | Type | Description |
|-----------|------|-------------|
| file | File | CSV file to convert |

#### Example Request
```bash
curl -X POST http://127.0.0.1:5000/convert \
  -F "file=@/path/to/amazon.csv"
```

#### Response
```json
{
  "message": "ok",
  "url": "https://wblqskhiwsfjvxqhnpqg.supabase.co/storage/v1/object/public/json/converted_file.json"
}
```

### 2. Product Recommendations
Get product recommendations using different algorithms.

**Endpoint:** `/recommend`  
**Method:** `POST`

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| method | string | Recommendation method (`cosine`, `content`, or `cluster`) |
| product_id | string | ID of the product to get recommendations for |
| top | integer | Number of recommendations to return (required for cosine and content methods) |
| url | string | URL of the CSV file (required for cosine and content methods) |
| page | integer | Page number for cluster method (optional) |

#### Example Requests

1. **Cosine Similarity**
```bash
curl -X POST "http://127.0.0.1:5000/recommend?method=cosine&product_id=B07JW9H4J1&top=5&url=https://wblqskhiwsfjvxqhnpqg.supabase.co/storage/v1/object/public/csv/amazon.csv"
```

2. **Content-Based Filtering**
```bash
curl -X POST "http://127.0.0.1:5000/recommend?method=content&product_id=B07JW9H4J1&top=5&url=https://wblqskhiwsfjvxqhnpqg.supabase.co/storage/v1/object/public/csv/amazon.csv"
```

3. **K-means Clustering**
```bash
curl -X POST "http://127.0.0.1:5000/recommend?method=cluster&product_id=B08CF3B7N1&page=1"
```

#### Response
Returns a JSON array of recommended products with their details.

### 3. Price Sentiment Analysis
Generate plots for price and sentiment analysis.

**Endpoint:** `/price_sentiment`  
**Method:** `POST`  
**Content-Type:** `application/json`

#### Request Body
```json
[
  {
    "price": "₹176.63",
    "rating": "4.5"
  },
  {
    "price": "$200.00",
    "rating": "3.2"
  }
]
```

#### Response
Returns a PNG image of the plot.

### 4. Sentiment Analysis
Analyze sentiment of text using DistilBERT model.

**Endpoint:** `https://vanduc006--distilbert-sentiment-api-app.modal.run/predict`  
**Method:** `POST`  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "text": "good product.",
  "reviewID": "88878"
}
```

#### Response
Returns sentiment analysis results.

### 5. Text Summarization
Generate summary of text using AI.

**Endpoint:** `/summary`  
**Method:** `POST`  
**Content-Type:** `application/json`

#### Request Body
| Parameter | Type | Description |
|-----------|------|-------------|
| text | string | Text to summarize |
| key | string | API key for authentication |

#### Example Request
```json
{
  "text": "Great product! Exactly as described. Fast shipping and well-packaged. Would definitely buy again!",
  "key": "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"
}
```

#### Response
Returns summarized text.

## Error Handling
All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request
- 500: Internal Server Error

Error responses include a JSON object with an error message:
```json
{
  "error": "Error message description"
}
```

## Rate Limiting
No rate limiting is implemented, but it's recommended to:
- Cache responses when possible
- Implement proper error handling
- Use appropriate timeouts for requests

## CORS
The API supports CORS for the following origins:
- `http://127.0.0.1:5173`
- `https://team2-amazon-gdg.vercel.app` 
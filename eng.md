
## 1. Overview
The dashboard is designed to serve data analysts and sellers, helping them visualize and analyze Amazon product data effectively. The interface is built with an intuitive approach, featuring tables, lists, and interactive tools arranged logically.

## 2. Dashboard Structure
The dashboard is divided into 3 main tabs:
- Home
- Product
- User Emulator

## 3. Feature Details

## Optimization
- To avoid Supabase rate limits and optimize performance, the ProductData provider is wrapped around all components. When data queries are needed, components call the provider to get the list
- All buttons with event handlers that send API requests use useState to disable them, preventing spam

### 3.1. Home Tab

#### a) Data Upload and Processing
**Frontend:**
- Uses React hooks (`useState`, `useRef`) to manage file and input states
- File upload interface with "Upload new object" button and selected file name display
- Event handling through `handleFileChange` and `handleUpload`

**Backend:**
- API endpoint: `https://team2-amazon-gdg.onrender.com/convert`
- CSV file processing and conversion to JSON format
- JSON data storage in Supabase

#### b) Data List Display
**Frontend:**
- Uses `JsonFileList` service to fetch file list from Supabase table object .eq('json')
- Displays list with information:
  - Index number
  - File name
  - Creation time (UTC format)
- Interaction: Click on file to navigate to Product tab with corresponding data

**Backend:**
- Data storage on Supabase
- Data URL: `https://wblqskhiwsfjvxqhnpqg.supabase.co/storage/v1/object/public/`

### 3.2. Product Tab
- Tablist for navigation to different functions:
  - Product Performance
  - Customer Sentiment
  - Price & Discount
  - Insights

#### a) Data Analysis and Visualization
**Frontend:**
- Main interface:
  - Product search bar by name or ID
  - Category filter with hierarchical structure
  - Product table with detailed information
  - "Load More" button for additional products

- Filtering and sorting features:
  - Filter by category (Category/Subcategory)
  - Sort by:
    - Rating (ascending/descending)
    - Number of reviews (ascending/descending)
    - Price (ascending/descending)

- Visual charts:
  - Bar Chart: Product rating distribution
  - Pie Chart: Discount level distribution
  - Price-Rating correlation chart
  - Draw Plot: Chunking images returned from API according to corresponding data type

**Backend:**
- Product data processing:
  - Basic information:
    - Product ID
    - Product name
    - Category
    - Original and discounted prices
    - Discount percentage
  - Review information:
    - Rating (1-5 stars)
    - Number of reviews
    - Review content
  - User information:
    - User ID
    - Username
    - Review title and content

- Category hierarchy processing:
  - Automatic category structure analysis
  - Support for multiple category levels
  - Product count by category

#### b) Review Sentiment Analysis
- Sentiment analysis model integration:
  - Using DistilBERT model
  - Real-time analysis
  - Visual result display

- Interactive features:
  - View review details
  - Sentiment analysis per review
  - Overall sentiment statistics

#### c) Interaction and Navigation
- Navigation to User Emulator for reviews
- Interaction with charts and data tables
- Responsive design for various screen sizes

### 3.3. User Emulator Tab
- **Frontend**
  - For sellers wanting to build their own platform, a page is created where they can operate like on Amazon, view previous buyer reviews, post product reviews, and receive product recommendations
  - Recommendation methods:
    - Cosine similarity
    - Content-based filtering
    - Kmeans Cluster
- **Backend**
  - Route `/recommend` accepts parameters `product_id`, `method`, etc. 
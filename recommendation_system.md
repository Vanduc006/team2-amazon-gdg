# Recommendation System Report

## 1. Overview
The recommendation system is implemented as a key feature in the User Emulator tab, providing sellers with intelligent product suggestions based on various algorithms. The system is designed to help sellers understand customer preferences and improve their product offerings.

## 2. Implementation Details

### 2.1. Frontend Implementation
- **User Interface:**
  - Dropdown menu for selecting recommendation methods
  - Input field for specifying number of recommendations (Top N)
  - Grid display of recommended products
  - Loading state indicator during API calls
  - Pagination support for cluster-based recommendations

- **Features:**
  - Real-time recommendation updates
  - Visual display of product information
  - Direct links to Amazon product pages
  - Responsive grid layout for product cards

### 2.2. Backend Implementation

#### a) API Endpoints
```python
@app.route('/recommend', methods=['POST'])
def create_remmcommend():
    query = request.args.get('method')
    product_id = request.args.get('product_id')
    top_n = request.args.get('top')
    url = request.args.get('url')
```

#### b) Recommendation Algorithms

1. **Cosine Similarity**
   - Implementation: `get_product_recommendations()`
   - Features:
     - Text-based similarity using TF-IDF
     - Combines multiple product attributes:
       - Product name
       - Product description
       - Category
       - Review titles
       - Review content
     - Returns similarity scores for ranking

2. **Content-Based Filtering**
   - Implementation: `get_user_based_recommendations()`
   - Features:
     - User behavior analysis
     - Rating pattern matching
     - Normalized similarity scoring
     - Considers user rating history

3. **K-means Clustering**
   - Implementation: `get_product_cluster()`
   - Features:
     - Pre-computed clusters stored in JSON
     - Efficient product grouping
     - Pagination support
     - Cluster-based similarity

### 2.3. Data Processing
- Price cleaning and normalization
- Text preprocessing for similarity calculation
- Rating normalization
- JSON response formatting

## 3. Technical Details

### 3.1. Dependencies
- pandas: Data manipulation
- numpy: Numerical operations
- scikit-learn: TF-IDF and similarity calculations
- Flask: API endpoints
- Supabase: Data storage

### 3.2. Performance Optimizations
- Cached cluster data
- Efficient data structures for user-product matrices
- Pagination for large result sets
- Error handling and validation

## 4. Usage Examples

### 4.1. Cosine Similarity
```python
recommendations = get_product_recommendations(
    product_id='B07JW9H4J1',
    csv_url='https://example.com/products.csv',
    top_n=5
)
```

### 4.2. Content-Based Filtering
```python
recommendations = get_user_based_recommendations(
    product_id='B07JW9H4J1',
    csv_url='https://example.com/products.csv',
    top_n=5
)
```

### 4.3. K-means Clustering
```python
recommendations = get_product_cluster(
    product_id='B07JW9H4J1',
    page=1,
    page_size=10
)
```

## 5. Future Improvements
1. Implement collaborative filtering
2. Add real-time cluster updates
3. Enhance similarity calculations
4. Add more recommendation metrics
5. Implement A/B testing support

---

# Báo cáo Hệ thống Đề xuất

## 1. Tổng quan
Hệ thống đề xuất được triển khai như một tính năng chính trong tab User Emulator, cung cấp cho người bán các gợi ý sản phẩm thông minh dựa trên nhiều thuật toán khác nhau. Hệ thống được thiết kế để giúp người bán hiểu được sở thích của khách hàng và cải thiện danh mục sản phẩm của họ.

## 2. Chi tiết triển khai

### 2.1. Triển khai Frontend
- **Giao diện người dùng:**
  - Menu dropdown để chọn phương pháp đề xuất
  - Trường nhập số lượng đề xuất (Top N)
  - Hiển thị dạng lưới các sản phẩm được đề xuất
  - Chỉ báo trạng thái tải trong quá trình gọi API
  - Hỗ trợ phân trang cho đề xuất dựa trên cluster

- **Tính năng:**
  - Cập nhật đề xuất realtime
  - Hiển thị trực quan thông tin sản phẩm
  - Liên kết trực tiếp đến trang sản phẩm Amazon
  - Bố cục lưới responsive cho thẻ sản phẩm

### 2.2. Triển khai Backend

#### a) API Endpoints
```python
@app.route('/recommend', methods=['POST'])
def create_remmcommend():
    query = request.args.get('method')
    product_id = request.args.get('product_id')
    top_n = request.args.get('top')
    url = request.args.get('url')
```

#### b) Thuật toán đề xuất

1. **Cosine Similarity**
   - Triển khai: `get_product_recommendations()`
   - Tính năng:
     - Tương đồng dựa trên văn bản sử dụng TF-IDF
     - Kết hợp nhiều thuộc tính sản phẩm:
       - Tên sản phẩm
       - Mô tả sản phẩm
       - Danh mục
       - Tiêu đề đánh giá
       - Nội dung đánh giá
     - Trả về điểm tương đồng để xếp hạng

2. **Content-Based Filtering**
   - Triển khai: `get_user_based_recommendations()`
   - Tính năng:
     - Phân tích hành vi người dùng
     - So khớp mẫu đánh giá
     - Tính điểm tương đồng chuẩn hóa
     - Xem xét lịch sử đánh giá của người dùng

3. **K-means Clustering**
   - Triển khai: `get_product_cluster()`
   - Tính năng:
     - Cluster được tính toán trước và lưu trong JSON
     - Nhóm sản phẩm hiệu quả
     - Hỗ trợ phân trang
     - Tương đồng dựa trên cluster

### 2.3. Xử lý dữ liệu
- Làm sạch và chuẩn hóa giá
- Tiền xử lý văn bản cho tính toán tương đồng
- Chuẩn hóa đánh giá
- Định dạng phản hồi JSON

## 3. Chi tiết kỹ thuật

### 3.1. Dependencies
- pandas: Xử lý dữ liệu
- numpy: Các phép toán số học
- scikit-learn: Tính toán TF-IDF và tương đồng
- Flask: API endpoints
- Supabase: Lưu trữ dữ liệu

### 3.2. Tối ưu hiệu suất
- Dữ liệu cluster được cache
- Cấu trúc dữ liệu hiệu quả cho ma trận người dùng-sản phẩm
- Phân trang cho tập kết quả lớn
- Xử lý lỗi và kiểm tra tính hợp lệ

## 4. Ví dụ sử dụng

### 4.1. Cosine Similarity
```python
recommendations = get_product_recommendations(
    product_id='B07JW9H4J1',
    csv_url='https://example.com/products.csv',
    top_n=5
)
```

### 4.2. Content-Based Filtering
```python
recommendations = get_user_based_recommendations(
    product_id='B07JW9H4J1',
    csv_url='https://example.com/products.csv',
    top_n=5
)
```

### 4.3. K-means Clustering
```python
recommendations = get_product_cluster(
    product_id='B07JW9H4J1',
    page=1,
    page_size=10
)
```

## 5. Cải tiến trong tương lai
1. Triển khai collaborative filtering
2. Thêm cập nhật cluster realtime
3. Cải thiện tính toán tương đồng
4. Thêm các chỉ số đề xuất
5. Hỗ trợ A/B testing 
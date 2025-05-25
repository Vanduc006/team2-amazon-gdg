## 1. Tổng quan
Dashboard được thiết kế nhằm phục vụ cho các chuyên gia phân tích dữ liệu và nhà bán hàng, giúp họ trực quan hóa và phân tích dữ liệu sản phẩm Amazon một cách hiệu quả. Giao diện được xây dựng theo hướng trực quan với các bảng biểu, danh sách và các công cụ tương tác được bố trí hợp lý.

## 2. Cấu trúc Dashboard
Dashboard được chia thành 3 tab chính:
- Home
- Product
- User Emulator

## 3. Chi tiết các tính năng

## Tối ưu
- Để tránh ratelimit supbase và tối ưu tốc độ, provider ProductData được bọc trong tất cả component. Khi cần truy vấn dữ liệu các component sẽ gọi về  provider để lấy list
- Tất cả các nút bấm có gắn sự kiện handle, gửi requests đến API đều có sự dụng useState để disable tránh việc bị spam


### 3.1. Tab Home

#### a) Upload và xử lý dữ liệu
**Frontend:**
- Sử dụng React hooks (`useState`, `useRef`) để quản lý trạng thái file và input
- Giao diện upload file với nút "Upload new object" và hiển thị tên file đã chọn
- Xử lý sự kiện upload thông qua `handleFileChange` và `handleUpload`

**Backend:**
- API endpoint: `https://team2-amazon-gdg.onrender.com/convert`
- Xử lý file CSV và chuyển đổi sang định dạng JSON
- Lưu trữ dữ liệu JSON vào Supabase

#### b) Hiển thị danh sách dữ liệu
**Frontend:**
- Sử dụng `JsonFileList` service để lấy danh sách file từ table object .eq('json') Supabase
- Hiển thị danh sách với thông tin:
  - Số thứ tự
  - Tên file
  - Thời gian tạo (định dạng UTC)
- Tương tác: Click vào file để chuyển sang tab Product với dữ liệu tương ứng

**Backend:**
- Lưu trữ dữ liệu trên Supabase
- URL dữ liệu: `https://wblqskhiwsfjvxqhnpqg.supabase.co/storage/v1/object/public/`

### 3.2. Tab Product
- Tablist để điều hướng đến các chức năng
  - Product Performance
  - Customer Sentiment
  - Price & Discount
  - Insights
#### a) Phân tích và trực quan hóa dữ liệu
**Frontend:**
- Giao diện chính:
  - Thanh tìm kiếm sản phẩm theo tên hoặc ID
  - Bộ lọc danh mục theo cấu trúc phân cấp
  - Bảng hiển thị sản phẩm với thông tin chi tiết
  - Nút "Load More" để tải thêm sản phẩm

- Tính năng lọc và sắp xếp:
  - Lọc theo danh mục (Category/Subcategory)
  - Sắp xếp theo:
    - Rating (tăng/giảm)
    - Số lượng đánh giá (tăng/giảm)
    - Giá (tăng/giảm)

- Biểu đồ trực quan:
  - Bar Chart: Phân bố rating của sản phẩm
  - Pie Chart: Phân bố mức giảm giá
  - Biểu đồ tương quan giữa giá và rating
  - Draw Plot : Chunking hình ảnh được trả từ API theo kiểu dữ liệu tương ứng

**Backend:**
- Xử lý dữ liệu sản phẩm:
  - Thông tin cơ bản:
    - ID sản phẩm
    - Tên sản phẩm
    - Danh mục
    - Giá gốc và giá giảm
    - Tỷ lệ giảm giá
  - Thông tin đánh giá:
    - Rating (1-5 sao)
    - Số lượng đánh giá
    - Nội dung đánh giá
  - Thông tin người dùng:
    - ID người dùng
    - Tên người dùng
    - Tiêu đề và nội dung đánh giá

- Xử lý phân cấp danh mục:
  - Tự động phân tích cấu trúc danh mục
  - Hỗ trợ nhiều cấp danh mục
  - Đếm số lượng sản phẩm theo danh mục

#### b) Phân tích cảm xúc đánh giá
- Tích hợp mô hình phân tích cảm xúc:
  - Sử dụng DistilBERT model
  - Phân tích realtime
  - Hiển thị kết quả trực quan

- Tính năng tương tác:
  - Xem chi tiết đánh giá
  - Phân tích cảm xúc theo từng đánh giá
  - Thống kê tổng quan về cảm xúc


#### c) Tương tác và điều hướng
<!-- - Liên kết trực tiếp đến Amazon -->
- Chuyển hướng đến User Emulator để đánh giá
- Tương tác với biểu đồ và bảng dữ liệu
- Responsive design cho nhiều kích thước màn hình 

### 3.3. Tab User Emulator
- **Frontend**
  - Với các nhà bán hàng muốn xây dựng nền tảng riêng, tôi xây dưng 1 trang để họ có thể  khách hàng thao tác như trên amazon,  họ có thể xem các review của các người mua trước đó, đăng review sản phẩm và nhận danh sách gợi ý sản phẩm
  - Các phương thức gợi ý
    - Consine similarity
    - Content-based filtering
    - Kmeans Cluster
- **Backend**
  - Route `/recommend` nhận về  param `product_id`, `method`,...



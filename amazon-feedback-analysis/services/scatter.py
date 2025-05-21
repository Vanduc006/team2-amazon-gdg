import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import io

def generate_scatter_plot(data):
    """
    Nhận vào list JSON object, trả về hình ảnh scatter plot dạng BytesIO
    """
    df = pd.DataFrame(data)
    
    # Loại bỏ ký tự % và chuyển sang số
    df['discount_percentage'] = df['discount_percentage'].str.replace('%', '', regex=False)
    df['discount_percentage'] = pd.to_numeric(df['discount_percentage'], errors='coerce')
    df['rating'] = pd.to_numeric(df['rating'], errors='coerce')
    df = df.dropna(subset=['discount_percentage', 'rating'])

    # Vẽ biểu đồ
    plt.figure(figsize=(8, 6))
    sns.regplot(x='discount_percentage', y='rating', data=df, line_kws={"color": "red"})
    plt.title("Discount % vs Rating")
    plt.xlabel("Discount (%)")
    plt.ylabel("Rating")

    # Trả về buffer ảnh
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()
    return buf

def plot_price_sentiment(data, plot_type='box'):
    """
    Nhận vào list JSON object, trả về hình ảnh boxplot hoặc violin plot Price vs Sentiment (BytesIO)
    Sentiment được tính từ rating:
        <3: negative
        3-4: neutral
        >=4: positive
    plot_type: 'box' hoặc 'violin'
    """
    df = pd.DataFrame(data)
    # Làm sạch dữ liệu price: loại bỏ ký tự không phải số hoặc dấu chấm
    if 'price' in df.columns:
        df['price'] = df['price'].astype(str).str.replace(r'[^\d.]', '', regex=True)
        df['price'] = pd.to_numeric(df['price'], errors='coerce')
    else:
        df['price'] = None
    df['rating'] = pd.to_numeric(df['rating'], errors='coerce')
    # Tạo cột sentiment
    def get_sentiment(r):
        if pd.isna(r):
            return None
        if r < 3:
            return 'negative'
        elif r < 4:
            return 'neutral'
        else:
            return 'positive'
    df['sentiment'] = df['rating'].apply(get_sentiment)
    df = df.dropna(subset=['price', 'sentiment'])

    plt.figure(figsize=(8, 6))
    if plot_type == 'violin':
        sns.violinplot(x='sentiment', y='price', data=df)
    else:
        sns.boxplot(x='sentiment', y='price', data=df)
    plt.title('Price vs Sentiment')
    plt.xlabel('Sentiment')
    plt.ylabel('Price')

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()
    return buf


    
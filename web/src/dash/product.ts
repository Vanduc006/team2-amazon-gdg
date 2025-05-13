import ProductDataJson from './output.json' assert {type : 'json'}

export interface ProductData {
    product_id: string
    product_name: string
    category?: string
    discounted_price?: string
    actual_price?: string
    discount_percentage?: string
    rating?: number | string
    rating_count?: number | string
    about_product?: string
    user_id?: string
    user_name?: string
    review_id?: string
    review_title?: string
    review_content?: string
    img_link?: string
    product_link?: string
}

export const productData: ProductData[] = ProductDataJson as ProductData[]


import React, { createContext, useContext, useState, useEffect } from 'react'


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

// async function fetchProductData(): Promise<ProductData[]> {
//   const res = await fetch('https://wblqskhiwsfjvxqhnpqg.supabase.co/storage/v1/object/public/json/output.json')
//   if (!res.ok) throw new Error('Failed to fetch data')
//   return await res.json()
// }

interface ProductDataContextType {
  productData: ProductData[]
  testData: ProductData[]
  loading: boolean
  error?: string  
  dataSourceUrl: string
  setDataSourceUrl: (url: string) => void
}

const ProductDataContext = createContext<ProductDataContextType | undefined>(undefined)

export const ProductDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [productData, setProductData] = useState<ProductData[]>([])
  const [dataSourceUrl, setDataSourceUrl] = useState<string>('https://default-link.com/output.json')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(dataSourceUrl)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setProductData(data)
        setError('')
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dataSourceUrl])

  // Tạo testData từ productData
  const testData = productData

  return (
    <ProductDataContext.Provider value={{ productData, testData, loading, error,dataSourceUrl, setDataSourceUrl }}>
      {children}
    </ProductDataContext.Provider>
  )
}

export function useProductData() {
  const context = useContext(ProductDataContext)
  if (!context) throw new Error('useProductData must be used inside ProductDataProvider')
  return context
}
import { useMemo } from 'react'
import { productData } from './product'
import { Link, useSearchParams } from 'react-router-dom'
import { Star, StarHalf } from 'lucide-react'

const FeedBack = () => {
  const [searchParams] = useSearchParams()
  const productID = searchParams.get('product_id')
  const productName = searchParams.get('product_name')
  const testData = productData.slice(0, 10)

  const product = useMemo(() => {
    if (!productID) return null
    return testData.find((product) =>
      product.product_id.toLowerCase().includes(productID.toLowerCase())
    )
  }, [productID])

  type ReviewData = {
    product_id: string
    product_name: string
    category: string
    discounted_price: string
    actual_price: string
    discount_percentage: string
    rating: number | string
    rating_count: number | string
    about_product: string
    user_id: string
    user_name: string
    review_id: string
    review_title: string
    review_content: string
    img_link: string
    product_link: string
  }

  function Review({ data }: { data: ReviewData }) {
    const userIDs = data.user_id.split(',')
    const userNames = data.user_name.split(',')
    const reviewTitles = data.review_title.split(',')
    const reviewContents = data.review_content.split(',')

    const reviews = userIDs.map((id, index) => ({
      id,
      name: userNames[index],
      title: reviewTitles[index],
      content: reviewContents[index],
    }))

    return (
      <div className="space-y-4 mt-4">
        {reviews.map((review, index) => (
          <div key={index} className="p-3 border rounded bg-white shadow-sm w-full">
            <div className='font-bold text-sm p-2 bg-blue-200 w-fit ml-auto rounded-md'>Badge : ???</div>
            <div className="font-semibold text-blue-600">{review.name}</div>
            <div className="text-gray-800 font-medium">{review.title}</div>
            <div className="text-sm text-gray-600">{review.content}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto ">
      <div className='flex gap-4'>
        <div className='p-2 text-sm font-bold rounded-md bg-yellow-200 w-fit mb-6'>
          <Link to={"/product"}>Product Screen</Link>
        </div>

        {product && 
        <a className='p-2 text-sm font-bold rounded-md bg-yellow-200 w-fit mb-6' href={product?.product_link}>
          View on AMAZON
        </a>}
      </div>

      <h1 className="text-3xl font-bold mb-6">Customer Review</h1>

      {product && 
      <div className="text-sm mb-4 items-center justify-cotent-center ">
        Review for product ID:
        <div className="ml-2 font-mono p-2 rounded bg-gray-200 mt-2 inline-block">
          {productID}
        </div>
        <div className="mt-1 flex items-center justify-content-center mt-2">
          <div className='mr-2 font-bold'>
            {product.rating}
          </div>
          
          {[...Array(5)].map((_, i) => {
            const rating = Number.parseFloat(product.rating?.toString() || "0")
            if (i < Math.floor(rating)) {
              return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            } else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
              return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            } else {
              return <Star key={i} className="h-4 w-4 text-gray-300" />
            }
          })}
          <div className='ml-2 text-gray-500'>({product.rating_count})</div>
        </div>
        <div className="font-bold text-lg mt-2">{productName}</div>
      </div>
      }

      {product ? (
        <Review data={product as ReviewData} />
      ) : (
        <p className="text-red-500 font-semibold">
          Please go to Product page then click 'View' for each Product to see Customer Feedback
        </p>
      )}
    </div>
  )
}

export default FeedBack

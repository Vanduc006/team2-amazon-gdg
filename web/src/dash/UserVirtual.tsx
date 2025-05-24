import { useEffect, useMemo, useState } from 'react'
// import { productData } from './product'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Star, StarHalf } from 'lucide-react'
import { Tabs, TabsContent } from '@radix-ui/react-tabs'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { NewFeedback } from '@/service/FeedbackList'
// import { BeatLoader } from 'r'
import { BeatLoader } from "react-spinners";
import { StarRating } from './StarRating'
import { useProductData } from './ProductContext'
import Recommend from '@/service/Recommend'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Card, CardContent } from '@/components/ui/card'
import Review from './Review'

const UserVirtual = () => {
  const { parent } = useProductData()
  // console.log(parent)
  const [searchParams] = useSearchParams()
  const productID = searchParams.get('product_id')
  const productName = searchParams.get('product_name')

  const { testData, loading, error } = useProductData()
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

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



  const initReview = {
    username : "",
    title : "",
    content : "",
    top : "5",
  }
  const [content,setContent] = useState(initReview)
  const [disable,setDisable] = useState<boolean>(false)
  const handleChange = (e:any) => {
    const {name, value} = e.target
    setContent({...content, [name] : value})
    // console.log(content)
  }



  const handleSubmit = async () => {
    const randomFiveDigit = Math.floor(10000 + Math.random() * 90000);
    if (content.username === "" || content.title === "" || content.content === "") {
      console.log('please full fill');
      alert("Please full fill all input box in form");
      return;
    }
    console.log(randomFiveDigit)
    setDisable(true); 

    try {
      const data = await NewFeedback(content.username, content.title, content.content, product?.product_id, userRating, randomFiveDigit);
      console.log(data);
      alert("Send feedback success")

      try {
        const body = {
          "text" : content.content,
          "reviewID" : String(randomFiveDigit),
        }
        const respone = await fetch('https://vanduc006--distilbert-sentiment-api-app.modal.run/realtime', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body : JSON.stringify(body)
        })
        console.log(respone.json())
        
      } catch (error) {
        
      }

    } catch (error) {
      console.error("Error sending feedback:", error);
      alert("Failed to send feedback");
    }


    setDisable(false);
    setContent({
      username : '',
      title : '',
      content : '',
      top : '5',
    })
    setUserRating(0)
  };


  //rating
  // const [hasRated, setHasRated] = useState<boolean>(false)
  const [userRating, setUserRating] = useState<number>(0)

  const handleRating = (rating : number ) => {
    setUserRating(rating)
  }


  //recommend
  // const { parent } = useProductData()
  const [recommend, setRecommend] = useState<any[]>([])
  const [method,setMethod] = useState<string>('cosine')
  const [tab,setTab] = useState<string>('review')
  const [page,setPage] = useState<number>(1)
  
  // const [top_n,setTop_n] = useState<string>('')
  const navigate = useNavigate()
  const handleRecommend = async () => {
    if (productID && content.top !== '') {
      setDisable(true)
      try {
        const data = await Recommend(method ,productID ,content.top , parent, page)
        setRecommend(data)
      } catch (error) {
        return error
      }
      setDisable(false)

    }
    // alert()
    // console.log(data)
    // setRecommend(data)
  }

  useEffect(() => {
    console.log(content.top)
    console.log(method)
  },[content.top,method])


  // const location = useLocation()

  // useEffect(() => {
  //   setTab('review')
  // },[location.pathname])

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

      <h1 className="text-3xl font-bold mb-6">Review & Recommend</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="review" >Review</TabsTrigger>
          <TabsTrigger value="recommend">Recommend</TabsTrigger>
        </TabsList>

        <TabsContent value='recommend'>
          <div className='flex items-center justify-content-center gap-2 mt-2 mb-5 w-full'>
            
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-200 border-0 shadow-md">
                <SelectValue placeholder="Recommend by" />
              </SelectTrigger>
              <SelectContent className='bg-white border-0'>
                <SelectItem value='cosine'>Cosine similarity</SelectItem>
                <SelectItem value='content'>Content-based filtering</SelectItem>
                <SelectItem value='cluster'>Kmeans Cluster</SelectItem>
              </SelectContent>
            </Select>

            <input type="text" placeholder='Top n...' className='bg-gray-200 border-0 p-1.5 shadow-md rounded-md w-fit'
            name='top'
            value={content.top}
            onChange={handleChange}      
            />
          </div>

          <button
            disabled={disable}
            className='mb-5 bg-gray-200 border-0 py-1.5 px-5 shadow-md rounded-md w-fit cursor-pointer font-semibold'
            onClick={() => {
              handleRecommend()
            }}
          >
              Get list
          </button>

          {disable && 
            <div className='flex items-center justify-content-center mt-2'>
              Getting recommend list
              <BeatLoader size={10}/>
            </div>
          }

          {method == 'cluster' &&                     
            <div className='my-2'>
              You are at page {page} of Product Cluster
            </div>
          }
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {recommend.length > 0 ? (
              recommend.map((recProduct,index) => (
                <div>
                  {method == 'cluster' ? 
                  <div>
                    <div 
                    className="w-fit mx-auto rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-gray-200 border-0 p-2 shadow-md"
                    key={index}>
                      <img src="/placeholder.png" className='rounded-md' />
                      <h3 className="font-medium text-sm line-clamp-2 mb-1 mt-2 w-fit max-w-1/3 md:max-w-lg overflow-hidden">
                        {recProduct}
                      </h3>
                      <div className='text-sm text-gray-500'>Maybe you like this product</div>
                    </div>
                  </div>
                  :
                  <div>
                    <div
                      key={index}
                      className="w-fit mx-auto rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-gray-200 border-0 p-2 shadow-md"
                      // onClick={() => router.push(`/product/${recProduct.product_id}`)}
                      onClick={() => {
                        setRecommend([])
                        setTab('review')
                        navigate('/useremulator?product_id='+ recProduct.product_id + '&product_name='+ recProduct.product_name)
                      }}
                    >
                      <div className='text-sm font-bold px-2 rounded-md ml-auto w-fit bg-green-300 mb-1'>{recProduct.discount_percentage}%</div>
                      <img src="/placeholder.png" className='rounded-md' />
                      {/* <div className='font-medium text-sm line-camp-2'>{recProduct.product_id}</div> */}
                      <h3 className="font-medium text-sm line-clamp-2 mb-1 mt-2 w-fit max-w-1/3 md:max-w-lg overflow-hidden">
                        {recProduct.product_name}
                      </h3>
                      <div className="flex items-center mb-2">
                          <StarRating initialRating={Number(recProduct.rating)} readOnly size="sm" />
                      </div>

                      <div className='flex items-center justify-content-center gap-2'>
                        <div className='font-bold text-sm'>₹{recProduct.discounted_price}</div>
                        <div className='text-sm text-gray-500 line-through'>₹{recProduct.actual_price}</div>
                      </div>


                  
                    </div>
                  </div>
                  }
                </div>
                // <Card
                //   key={recProduct.product_id}
                //   className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                //   // onClick={() => router.push(`/product/${recProduct.product_id}`)}
                // >
                //   <div className="aspect-square relative bg-white p-4 flex items-center justify-center">
                //     <img
                //       src={recProduct.img_link || "/placeholder.svg?height=200&width=200"}
                //       alt={recProduct.product_name}
                //       className="max-h-[150px] max-w-full object-contain"
                //       onError={(e) => {
                //         e.currentTarget.src = "/placeholder.svg?height=150&width=150"
                //       }}
                //     />
                //     <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 border-green-200">
                //       {recProduct.discount_percentage}
                //     </Badge>
                //   </div>
                //   <CardContent className="p-4">
                //     <h3 className="font-medium text-sm line-clamp-2 mb-1">{recProduct.product_name}</h3>
                //     <div className="flex items-center mb-2">
                //       <StarRating initialRating={Number(recProduct.rating)} readOnly size="sm" />
                //     </div>
                //     <div className="flex items-center gap-2">
                //       <span className="font-bold">{recProduct.discounted_price}</span>
                //       <span className="text-xs text-gray-500 line-through">{recProduct.actual_price}</span>
                //     </div>
                //   </CardContent>
                // </Card>

              ))
            ) : (
              <div className="gap-2 col-span-full text-center py-8 text-red-500 font-bold flex items-center justify-content-center">
                Content not available
              </div>
            )}
            
          </div>
          {method == 'cluster' &&
            <div className='flex w-full mt-5'>
              {page !== 1 && 
                <div className='px-5 py-1 bg-gray-200 shadow-md rounded-md w-fit cursor-pointer'
                onClick={() => {
                  setPage(p => p-1)
                  handleRecommend()
                }}
                >Previous</div>
              }
              <div className='px-5 py-1 bg-gray-200 shadow-md rounded-md w-fit ml-auto cursor-pointer'
                onClick={() => {
                  setPage(p => p+1)
                  console.log(page)

                  handleRecommend()
                }}
              >Next</div>
            </div>
          }
        </TabsContent>
        <TabsContent value='review'>
          {product && 
            <div className="text-sm mb-4 items-center justify-cotent-center ">
              Review for product ID:
              <div className="ml-2 font-mono p-2 rounded bg-gray-200 mt-2 inline-block">
                {productID}
              </div>

              <Dialog>
                <DialogTrigger className='w-fit ml-5 cursor-pointer font-mono p-2 rounded-md bg-gray-200 inline-block'>
                  Give us feedback
                </DialogTrigger>
                
                <DialogContent className='bg-white'>
                  <DialogHeader>
                    <DialogTitle>Please full fill this form</DialogTitle>
                    <DialogDescription>
                      <div className='text-sm font-mono mt-2 border-b w-fit'>Your name :</div>
                      <input 
                        name="username"  placeholder="Your name" type="text" 
                        className='p-2 bg-gray-200 text-black mt-1 w-full rounded-md'
                        value={content.username}
                        onChange={handleChange}
                      />
                      <div className='text-sm font-mono mt-2 border-b w-fit'>Do you statify whith prduct ?</div>
                      <input 
                      name="title" value={content.title}
                      onChange={handleChange}
                      placeholder="Tell us" type="text" className='p-2 bg-gray-200 text-black mt-1 w-full rounded-md'/>
                      <div className='text-sm font-mono mt-2 border-b w-fit'>Tell us detail for better growth !</div>
                      <input 
                      name="content" value={content.content}
                      onChange={handleChange}
                      placeholder="Tell us more..." type="text" className='p-2 bg-gray-200 text-black mt-1 w-full rounded-md'/>

                      <div className='mt-2 flex items-center justify-content-center gap-2'>
                        <div className='font-mono font-bold text-sm'>Give it a star !</div>
                        <StarRating initialRating={userRating} onChange={handleRating} size="sm"/>
                      </div>
                    </DialogDescription>
                  </DialogHeader>

                      <button 
                      disabled={disable}
                      onClick={handleSubmit}
                      className='ml-auto mr-2 w-fit p-2 bg-gray-200 rounded-md text-sm font-mono font-bold cursor-pointer hover:scale-[1.09] flex items-center justify-content-center'>
                        Send feedback 
                        {disable && <BeatLoader size={10} />}
                      </button>

                  <DialogFooter className="sm:justify-start">
                    
                    <DialogClose asChild>
                      <button 
                      disabled={disable}
                      className='w-fit p-2 bg-gray-200 rounded-md text-sm font-mono font-bold cursor-pointer hover:scale-[1.09] hover:bg-gray-500'>Quit</button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
                
              </Dialog>

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
        </TabsContent>
      </Tabs>
      
    </div>
  )
}

export default UserVirtual

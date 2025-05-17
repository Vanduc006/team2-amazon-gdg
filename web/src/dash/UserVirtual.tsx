import { useMemo, useState } from 'react'
// import { productData } from './product'
import { Link, useSearchParams } from 'react-router-dom'
import { Star, StarHalf } from 'lucide-react'
import { Tabs, TabsContent } from '@radix-ui/react-tabs'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { NewFeedback } from '@/service/FeedbackList'
// import { BeatLoader } from 'r'
import { BeatLoader } from "react-spinners";
import { StarRating } from './StarRating'
import { useProductData } from './ProductContext'

const UserVirtual = () => {
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

  function Review({ data }: { data: ReviewData }) {
    const userIDs = data.user_id.split(",");
    const userNames = data.user_name.split(",");
    const reviewTitles = data.review_title.split(",");
    const reviewContents = data.review_content.split(",");
    // const reviewIDs = data.review_id.split(",");

    let ans = 0;
    let maxDiff = 0;

    // const userIdLen = userIDs.length;
    // const reviewIdLen = reviewIDs.length;
    const reviewTitleLen = reviewTitles.length;
    // const reviewContentLen = reviewContents.length;
    const userNameLen = userNames.length;
    let mismatchIndex = 0;
    mismatchIndex = 0
    if (reviewTitleLen !== userNameLen) {
      const diff = Math.abs(reviewTitleLen - userNameLen);
      if (diff > maxDiff) {
        maxDiff = diff;
        mismatchIndex = 0; // vì chỉ có 1 data, luôn là 0
      }
      ans++;
    }

    // console.log("Số lượng lỗi length mismatch:", ans);
    console.log(mismatchIndex)

    if (ans > 0) {
      console.log("Chiều dài review_title:", reviewTitles.length);
      let count = 1;
      for (const title of reviewTitles) {
        const trimmed = title.trim();
        if (trimmed.length > 0 && /^[A-Z]/.test(trimmed)) {
          console.log(`${trimmed} - ${count}`);
          count++;
        }
      }

      console.log("=======================");
      console.log("Chiều dài user_id:", userIDs.length);
      for (const uid of userIDs) {
        console.log(uid);
      }
    }

    const reviews = userIDs.map((id, index) => ({
      id,
      name: userNames[index],
      title: reviewTitles[index],
      content: reviewContents[index],
    }));

    return (
      <div className="space-y-4 mt-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="p-2 rounded-md bg-gray-200 shadow-md w-full"
          >
            {/* <div className="font-bold text-sm p-2 bg-blue-200 w-fit ml-auto rounded-md">
              Badge : ???
            </div> */}
            <div className="font-semibold text-blue-600">{review.name}</div>
            <div className="text-gray-800 font-medium">{review.title}</div>
            <div className="text-sm text-gray-600">{review.content}</div>
          </div>
        ))}
      </div>
    );
  }

  const initReview = {
    username : "",
    title : "",
    content : "",
  }
  const [content,setContent] = useState(initReview)
  const [disable,setDisable] = useState<boolean>(false)
  const handleChange = (e:any) => {
    const {name, value} = e.target
    setContent({...content, [name] : value})
    // console.log(content)
  }



  const handleSubmit = async () => {
    if (content.username === "" || content.title === "" || content.content === "") {
      console.log('please full fill');
      alert("Please full fill all input box in form");
      return;
    }

    setDisable(true); 

    try {
      const data = await NewFeedback(content.username, content.title, content.content, product?.product_id, userRating);
      console.log(data);
      alert("Send feedback success")

    } catch (error) {
      console.error("Error sending feedback:", error);
      alert("Failed to send feedback");
    }

    setDisable(false);
    setContent({
      username : '',
      title : '',
      content : '',
    })
    setUserRating(0)
  };


  //rating
  // const [hasRated, setHasRated] = useState<boolean>(false)
  const [userRating, setUserRating] = useState<number>(0)

  const handleRating = (rating : number ) => {
    setUserRating(rating)
  }

  //check data

    // const lengths = [
    //   userIDs.length,
    //   userNames.length,
    //   reviewTitles.length,
    //   reviewContents.length
    // ];

    // const isConsistent = lengths.every((len) => len === lengths[0]);

    // if (!isConsistent) {
    //   console.error('❌ Dữ liệu không đồng bộ:');
    //   console.log(product?.product_id)
    //   console.log(`user_id: ${userIDs.length}`);
    //   console.log(`user_name: ${userNames.length}`);
    //   console.log(`review_title: ${reviewTitles.length}`);
    //   console.log(`review_content: ${reviewContents.length}`);
    // }

  // const checkInconsistentProducts = (products: any[]) => {
  //   let n = 0
  //   const result: {
  //     index: number;
  //     product_id: string;
  //     fieldLengths: Record<string, number>;
  //   }[] = [];

  //   products.forEach((product, index) => {
  //     const fieldLengths = {
  //       user_id: product.user_id?.split(',').length ?? 0,
  //       user_name: product.user_name?.split(',').length ?? 0,
  //       review_id: product.review_id?.split(',').length ?? 0,
  //       review_title: product.review_title?.split(',').length ?? 0,
  //       review_content: product.review_content?.split(',').length ?? 0,
  //     };

  //     const uniqueLengths = new Set(Object.values(fieldLengths));

  //     if (uniqueLengths.size !== 1) {
  //       result.push({
  //         index,
  //         product_id: product.product_id,
  //         fieldLengths,
  //       });
  //     }
  //   });

  //   console.log('🛑 Các sản phẩm có dữ liệu không đồng đều:');
  //   result.forEach(({ index, product_id, fieldLengths }) => {
  //     n = n + 1
  //     console.log(`- Index ${index} | Product ID: ${product_id}`);
  //     console.log('  Field lengths:', fieldLengths);
  //   });

  //   if (result.length === 0) {
  //     console.log('✅ Tất cả sản phẩm đều có số lượng trường thống nhất.');
  //   }
  //   console.log(n)
  //   return result;
  // };

  // const checkUserIdAndNameMismatch = (products: any[]) => {
  //   const mismatches: {
  //     index: number;
  //     product_id: string;
  //     user_id_length: number;
  //     user_name_length: number;
  //   }[] = [];

  //   products.forEach((product, index) => {
  //     const userIds = product.user_id?.split(',') ?? [];
  //     const userNames = product.user_name?.split(',') ?? [];

  //     if (userIds.length !== userNames.length) {
  //       mismatches.push({
  //         index,
  //         product_id: product.product_id,
  //         user_id_length: userIds.length,
  //         user_name_length: userNames.length,
  //       });
  //     }
  //   });

  //   if (mismatches.length === 0) {
  //     console.log("✅ Tất cả `user_id` và `user_name` đều khớp nhau.");
  //   } else {
  //     console.log("🛑 Những sản phẩm có số lượng `user_id` và `user_name` KHÔNG KHỚP:");
  //     mismatches.forEach((m) => {
  //       console.log(
  //         `- Index ${m.index} | Product ID: ${m.product_id} | user_id: ${m.user_id_length} | user_name: ${m.user_name_length}`
  //       );
  //     });
  //   }

  //   return mismatches;
  // };


  // useEffect(() => {
  //   // Giả sử bạn có mảng `products` đã load xong
  //   checkUserIdAndNameMismatch(productData)
  //   // checkInconsistentProducts(productData);
  // }, [productData]);



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

      <Tabs defaultValue='review'>
        <TabsList className="mb-4">
          <TabsTrigger value="review" >Review</TabsTrigger>
          <TabsTrigger value="recommend">Recommend</TabsTrigger>
        </TabsList>

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

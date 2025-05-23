import { User } from "lucide-react"
import { useState } from "react"
import { BounceLoader } from "react-spinners"

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

const ReviewSentiment = ({ data }: { data: ReviewData }) => {
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
      // for (const uid of userIDs) {
      //   console.log(uid);
      // }
    }

    const reviews = userIDs.map((id, index) => ({
      id,
      name: userNames[index],
      title: reviewTitles[index],
      content: reviewContents[index],
    }));

    const [sentimentResults, setSentimentResults] = useState<{ [index: number]: string }>({})
    const [disableSentiment,setDisableSentiment] = useState<boolean>(false)
    
    const handSentiment = async(content: string, index: number):Promise<any> => {
      setDisableSentiment(true)
        setSentimentResults(prev => ({
          ...prev,
          [index]: "process", // ví dụ response trả về { label: "Positive" }
        }))
      try {
        const body = {
          text : content,
          reviewID: 'NULL',
        }
        const respone = await fetch('https://vanduc006--distilbert-sentiment-api-app.modal.run/predict',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body : JSON.stringify(body)
        })

        const data = await respone.json()

        setSentimentResults(prev => ({
          ...prev,
          [index]: data.label, // ví dụ response trả về { label: "Positive" }
        }))
      } catch (error) {
        console.log("Failed to sentiment")
      }
      setDisableSentiment(false)
    }
    
    return (
      <div className="space-y-4 mt-3 overflow-hidden">
        {reviews.map((review, index) => (
          <div
            key={index}
            
          > 
          
          <div className="p-2 rounded-md bg-white border-1 border-gray-500 w-full flex items-center justify-content-center gap-2">
            <div className="items-center justify-content-center">
              <User />
            </div>
            {/* <div className="font-bold text-sm p-2 bg-blue-200 w-fit ml-auto rounded-md">
              Badge : ???
            </div> */}
            <div>
              <div className="font-semibold text-blue-600">{review.name}</div>
              <div className="text-gray-800 font-medium">{review.title}</div>
              <div className="text-sm text-gray-600">{review.content}</div>
            </div>
          </div>

          <div className="flex items-center justify-content-center gap-2">
            <button
              disabled={disableSentiment} 
              className="cursor-pointer text-sm font-semibold px-5 py-1 bg-gray-200 w-fit mt-1 rounded-md flex items-center justify-content-center"
              onClick={() => {
                handSentiment(review.content, index)
              }}
              >
                Sentiment this review
            </button>
            {sentimentResults[index] == "process" && (
              <div className="gap-2 mt-1 text-sm font-medium text-yellow-600 flex items-center justify-content-center">
                Processing <BounceLoader size={15} />
              </div>
            )}

            {sentimentResults[index] == "positive" && (
              <div className="mt-1 text-sm font-medium text-green-600">
                {sentimentResults[index]}
              </div>
            )}

            {sentimentResults[index] == "neutral" && (
              <div className="mt-1 text-sm font-medium text-gray-600">
                {sentimentResults[index]}
              </div>
            )}

            {sentimentResults[index] == "negative" && (
              <div className="mt-1 text-sm font-medium text-red-600">
                {sentimentResults[index]}
              </div>
            )}


          </div>
            
          </div>
        ))}
      </div>
    );
  }
export default ReviewSentiment
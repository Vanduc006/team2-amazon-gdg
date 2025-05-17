// import React from 'react'
import JsonFileList from "@/service/ObjectList"
import { useEffect, useState } from "react"
import DateFormat from "./DateFormat"
import { useProductData } from "./ProductContext"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
const Home = () => {
  const navigate = useNavigate()
  const { setDataSourceUrl } = useProductData()
  const [object,setOject] = useState<any[]>([])
  const getObject = async() => {
    JsonFileList().then((data) => {
      console.log(data)
      setOject(data)
    })
  }

  useEffect(() => {
    getObject()
  },[])

  return (
    <div className='container mx-auto py-10'>
        <div className="text-3xl font-bold mb">Homescreen</div>
        <div className="text-md text-gray-500">Choose object to continue</div>

        <div className="mt-2 p-2 cursor-pointer bg-gray-200 w-fit rounded-md font-bold flex items-center justify-content-center">
          Upload new object 
          <Plus className="w-4 h-4 ml-2"/>
        </div>
        <div className="mt-5 border-t">
          {object.map((file,index) => {
            return (
              <div key={index} className="p-2 gap-2 bg-gray-200 rounded-md mt-2 flex items-center justify-content-center hover:scale-[1.02] cursor-pointer"
              onClick={() => {
                setDataSourceUrl("https://wblqskhiwsfjvxqhnpqg.supabase.co/storage/v1/object/public/"+file.type+'//'+file.key)
                navigate('/product')
              }}
              >
                <div className="px-2 bg-white rounded-md">{index+1}</div>
                <div className="font-bold">{file.key}</div>
                <div className="ml-auto">
                  <DateFormat utcTime={file.created_at}/>

                </div>
                
              </div>
            )
          })}
        </div>
    </div>
  )
}

export default Home
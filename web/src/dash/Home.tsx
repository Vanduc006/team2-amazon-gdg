// import React from 'react'
import JsonFileList from "@/service/ObjectList"
import { useEffect, useRef, useState } from "react"
import DateFormat from "./DateFormat"
import { useProductData } from "./ProductContext"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
const Home = () => {
  const navigate = useNavigate()
  const { setDataSourceUrl, setParent} = useProductData()
  const [object,setOject] = useState<any[]>([])
  const [file,setFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const getObject = async() => {
    JsonFileList().then((data) => {
      console.log(data)
      setOject(data)
    })
  }

  const handleFileChange = async(event : React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if ( files ) {
      Array.from(files).map(file => {
        setFile(file)
        console.log(file.name)
      })
    }
  }

  const handleUpload = async() => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = '.csv'
      fileInputRef.current.click()
    }
  }

  const callService = async() => {
    const formData = new FormData
    if (file) {
      formData.append('file',file)
    }
    else {
      return (
        <div>no</div>
      )
    }

    const respone = await fetch('https://team2-amazon-gdg.onrender.com/convert',{
      method: "POST",
      body: formData,
    })

    console.log(respone)

    if(respone.status == 200) {
      setFile(undefined)
    }
  }

  useEffect(() => {
    getObject()
  },[])

  return (
    <div className='container mx-auto py-10'>
        <div className="text-3xl font-bold mb">Homescreen</div>
        <div className="text-md text-gray-500">Choose object to continue</div>

        <div className="mt-2 p-2 cursor-pointer bg-gray-200 w-fit rounded-md font-bold flex items-center justify-content-center"
        onClick={() => {
          handleUpload()
        }}
        >
          <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              // multiple
              onChange={handleFileChange}
          />
          Upload new object 
          <Plus className="w-4 h-4 ml-2"/>
        </div>

        {file ?
          <div className="bg-gray-200 font-mono mt-2 p-2 rounded-md flex">
            {file?.name}
            <div className="ml-auto bg-white px-2 rounded-md cursor-pointer"
            onClick={() => {
              callService()
            }}
            >Process</div>
          </div> : <div></div>
        }

        <div className="mt-5 border-t">
          {object.map((file,index) => {
            return (
              <div key={index} className="p-2 gap-2 bg-gray-200 rounded-md mt-2 flex items-center justify-content-center hover:scale-[1.02] cursor-pointer"
              onClick={() => {
                setParent(file.parent)
                // console.log(parent)
                // console.log(file.parent)
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
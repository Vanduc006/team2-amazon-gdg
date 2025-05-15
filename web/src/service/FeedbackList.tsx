// import React from 'react'
import supabase from "./ConnectSupabase"

const FeedbackList = async():Promise<any[]> => {
  const { data, error } = await supabase
  .from('review')
  .select('*')
  if ( error ) {
    console.log(error.message)
    return []
  }
  return data || []
}
export default FeedbackList

export const NewFeedback = async(username: string, title: string, content: string, productID: any):Promise<any> => {
  const { data, error } = await supabase
  .from('review')
  .insert({ username: username, title: title,content: content, productID: productID })
  if ( error ) {
    console.log(error.message)
    return data || []
  }
  return []
}
// import React from 'react'
import { useEffect, useState } from "react"
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

export const NewFeedback = async(
  username: string, 
  title: string, 
  content: string, 
  productID: any,
  stars : number,

):Promise<any> => {
  const { data, error } = await supabase
  .from('review')
  .insert({ username: username, title: title,content: content, productID: productID, stars: stars })
  if ( error ) {
    console.log(error.message)
    return data || []
  }
  return []
}

export interface Review {
  stars : string,
  productID: string,
  created_at: string;
  id: number;
  username: string;
  title: string;
  content: string;
  status: string;
  predict: string;
}

export const UseRealtimeReview = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Fetch ban đầu
  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
      .from('review')
      .select('*')
      .order('id', { ascending : false})
      if (data) {
        setReviews(data as Review[]);
      }
    };

    fetchReviews();
  }, []);

  // Lắng nghe realtime
  useEffect(() => {
    const channel = supabase
      .channel('realtime:review')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'review',
        },
        (payload) => {
          console.log(payload)
          const { eventType, new: newData, old: oldData } = payload;

          setReviews((prev) => {
            switch (eventType) {
              case 'INSERT':
                return [newData as Review, ...prev];

              case 'UPDATE':
                return prev.map((r) =>
                  r.id === (newData as Review).id ? (newData as Review) : r
                );

              case 'DELETE':
                return prev.filter((r) => r.id !== (oldData as Review).id);

              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return reviews;
};

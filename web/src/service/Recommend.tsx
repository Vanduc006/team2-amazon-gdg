const Recommend = async (
  method: string,
  productID: string,
  top: string,
  parent: string,
  page :number,
): Promise<any> => {
  const params = new URLSearchParams()
  const url = "https://wblqskhiwsfjvxqhnpqg.supabase.co/storage/v1/object/public/csv//" + parent

  params.append('method', method)
  params.append('product_id', productID)
  params.append('top', top)
  params.append('url', url)
  params.append('page',String(page))

  const response = await fetch(
    "https://team2-amazon-gdg.onrender.com/recommend?" + params.toString(),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  const data = await response.json()
  return data
}

export default Recommend
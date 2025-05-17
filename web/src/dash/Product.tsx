// import React from 'react'
// import { productData } from './product'
import { useProductData } from './ProductContext'
import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Bell, ChevronRight, Search, Star, StarHalf } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { UseRealtimeReview } from '@/service/FeedbackList'
import DateFormat from './DateFormat'
import { StarRating } from './StarRating'
// import { toast } from "sonner"

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"

const Product = () => {
  // toast("???")
  const { testData, loading, error } = useProductData()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryPath,setCategoryPath] = useState<string[]>([])
  // const [selectedCategory, setSelectedCategory] = useState("all")
  const [filter,setFilter] = useState<string>("category")
  const [selectedRating, setSelectRating] = useState<string>("asc");
  const [count,setCount] = useState<any>(10) 
  const [level,setLevel] = useState<number>(0)


  const handleLoadMore = () => {
    setCount(count + 10)
  }


  // get child level category
  const categoryHierarchy = useMemo(() => {
    const hierarchy : Record<string, any> = {}
    testData.forEach((product) => {
      if (product.category) {
        const categories = product.category.split("|")
        let currentLevel = hierarchy
        for (let i = 0; i < categories.length; i++) {
          const category = categories[i]
          if (!currentLevel[category]) {
            currentLevel[category] = {
              _children : {},
              _fullPath: categories.slice(0, i+1).join("|"),
              _count: 0,
            }
          }

          currentLevel[category]._count++

          if (i < categories.length -1 ) {
            currentLevel = currentLevel[category]._children
          }
        }
      }
    })

    return hierarchy
  },[])

  //product by level
  const availableCategoriesByLevel = useMemo(() => {
    const result: Array<{ name: string; fullPath: string; count: number }[]> = []
    const topLevel = Object.entries(categoryHierarchy).map(([name, data]: [string, any]) => ({
      name,
      fullPath: data._fullPath,
      count: data._count,
    }))
    result.push(topLevel)
    let currentLevel = categoryHierarchy
    for (let i = 0; i < categoryPath.length; i++) {
      const category = categoryPath[i]
      if (currentLevel[category]) {
        currentLevel = currentLevel[category]._children
        if (Object.keys(currentLevel).length > 0) {
          const nextLevel = Object.entries(currentLevel).map(([name, data]: [string, any]) => ({
            name,
            fullPath: data._fullPath,
            count: data._count,
          }))
          result.push(nextLevel)
        }
      } else {
        break
      }
    }

    return result
  }, [categoryHierarchy, categoryPath])

  // Get current category full path for filtering
  const currentCategoryFullPath = useMemo(() => {
    if (categoryPath.length === 0) return ""

    let current = categoryHierarchy
    let path = ""

    for (let i = 0; i < categoryPath.length; i++) {
      const category = categoryPath[i]
      if (current[category]) {
        path = current[category]._fullPath
        if (i < categoryPath.length - 1) {
          current = current[category]._children
        }
      } else {
        return path
      }
    }

    return path
  }, [categoryHierarchy, categoryPath])


  // Filter products based on search and category
  const filteredProducts = useMemo(() => {

    const categoryFiltered = testData.filter((product) => {
      const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || product.product_id.toLowerCase().includes(searchTerm.toLowerCase());
      // const matchesCategory =
      //   selectedCategory === "all" ||
      //   (product.category && product.category.startsWith(selectedCategory));

      if (categoryPath.length === 0) {
        return matchesSearch
      }

      const matchesCategory = product.category && product.category.startsWith(currentCategoryFullPath)
      return matchesSearch && matchesCategory;
    });

    if (filter === "rating") {
      return [...categoryFiltered].sort((a, b) => {
        const ratingA = Number(a.rating) || 0;
        const ratingB = Number(b.rating) || 0;
        return selectedRating === "asc" ? ratingA - ratingB : ratingB - ratingA;
      });
    }
  
    if (filter === "rating_count") {
      return [...categoryFiltered].sort((a, b) => {
        const countA = Number((a.rating_count as string)?.toString().replace(/,/g, "")) || 0;
        const countB = Number((b.rating_count as string)?.toString().replace(/,/g, "")) || 0;
        return selectedRating === "asc" ? countA - countB : countB - countA;
      });
    }
  
    if (filter === "price") {
      return [...categoryFiltered].sort((a, b) => {
        const priceA = Number(a.discounted_price?.replace(/[₹,]/g, "")) || 0;
        const priceB = Number(b.discounted_price?.replace(/[₹,]/g, "")) || 0;
        return selectedRating === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return categoryFiltered;
  }, [searchTerm, filter, selectedRating, testData,categoryPath,currentCategoryFullPath]);
  



  //review
  const ratingDistribution = useMemo(() => {
    const distribution: Record<string, number> = {}
    filteredProducts.forEach((product) => {
      const rating = product.rating ? Math.floor(Number.parseFloat(product.rating.toString())) : 0
      distribution[rating] = (distribution[rating] || 0) + 1
    })
    return Object.entries(distribution).map(([rating, count]) => ({
      rating: `${rating} ★`,
      count,
    }))
  }, [filteredProducts])



  const discountData = useMemo(() => {
    const ranges = [
      { name: "0-20%", range: [0, 20], count: 0 },
      { name: "21-40%", range: [21, 40], count: 0 },
      { name: "41-60%", range: [41, 60], count: 0 },
      { name: "61-80%", range: [61, 80], count: 0 },
      { name: "81-100%", range: [81, 100], count: 0 },
    ]

    filteredProducts.forEach((product) => {
      const discount = product.discount_percentage ? Number.parseInt(product.discount_percentage.replace("%", "")) : 0

      for (const range of ranges) {
        if (discount >= range.range[0] && discount <= range.range[1]) {
          range.count++
          break
        }
      }
    })

    return ranges
  }, [filteredProducts])

  const categoryDistribution = useMemo(() => {
    const distribution: Record<string, number> = {}
    filteredProducts.forEach((product) => {
      if (product.category) {
        const mainCategory = product.category.split("|")[0]
        distribution[mainCategory] = (distribution[mainCategory] || 0) + 1
      }
    })
    return Object.entries(distribution).map(([category, count]) => ({
      name: category,
      value: count,
    }))
  }, [filteredProducts])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

   // Handle category selection at a specific level
  const handleCategorySelect = (level: number, category: string) => {
    // If selecting at current level, just add to path
    if (level === categoryPath.length) {
      setCategoryPath([...categoryPath, category])
    }
    // If selecting at a previous level, truncate path and add new selection
    else if (level < categoryPath.length) {
      setCategoryPath([...categoryPath.slice(0, level), category])
    }
  }

  // Reset category filters
  const resetCategoryFilter = () => {
    setCategoryPath([])
  }

  // Debug function to check if a level has subcategories
  const hasSubcategories = (level: number): boolean => {
    if (level >= categoryPath.length) return false

    let current = categoryHierarchy
    for (let i = 0; i <= level; i++) {
      if (i === level) {
        return Object.keys(current[categoryPath[i]]?._children || {}).length > 0
      }
      current = current[categoryPath[i]]?._children || {}
    }
    return false
  }
  
  const customCustomerReview = UseRealtimeReview()
  // console.log(customCustomerReview)


  //open review for each product
  return (
    <div className="container mx-auto py-10">
      <h1 className="font-bold mb-6 flex items-center justify-content-center">
        <div className='text-3xl'>Product Screen</div>
        <Sheet>
          <SheetTrigger className='cursor-pointer ml-auto bg-gray-200 rounded-md p-2 hover:scale-[1.09] hover:bg-gray-500 font-mono flex items-center justify-content-center'>
              <Bell className='w-4 h-4 mr-2'/>
              {/* <BellDot className='w-4 h-4 fill-red-500 mr-2'/> */}
              Notification
          </SheetTrigger>
          <SheetContent className='bg-white border-0 p-2 w-[400px] sm:w-[540px] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>Newest product review from customer</SheetTitle>
              <SheetDescription>
                <div className="space-y-4 mt-4">
                  {customCustomerReview.map((review, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-md bg-gray-200 shadow-md w-full"
                    >
                      {/* <div className="font-bold text-sm p-2 bg-blue-200 w-fit ml-auto rounded-md">
                        Badge : ???
                      </div> */}
                      
                      <div className="font-semibold text-blue-600 flex">
                        {review.username}
                        <div className='ml-auto text-gray-500'>{review.productID}</div>
                      </div>
                      <div className="text-gray-800 font-medium">{review.title}</div>
                      <div className="text-sm text-gray-600">{review.content}</div>

                      <div>
                        <div className='flex p-2 bg-yellow-200 rounded-md mt-2'>
                          <div className='font-mono font-bold text-sm'>Status process : </div>
                          {review.status == null ? 
                            <div>Waiting respone</div> : <div></div>
                          }
                        </div>
                        <div className='flex p-2 bg-yellow-200 rounded-md mt-2'>
                          <div className='font-mono font-bold text-sm'>Model predict : </div>
                          {review.predict}
                        </div>
                        <div className='font-mono text-gray-500 mt-2 flex items-center justify-content-center'>
                          <DateFormat utcTime={review.created_at}/>
                          <StarRating initialRating={Number(review.stars)} readOnly size="sm" className='ml-auto'/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

      </h1>

      {/* Search and Filter */}



      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 bg-gray-200">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by Name and ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select 
        // value={selectedCategory} 
        // onValueChange={setSelectedCategory}
        value={filter} 
        onValueChange={setFilter}
        >
          <SelectTrigger className="w-full md:w-[200px] bg-gray-200">
            <SelectValue placeholder="Filter type" />
          </SelectTrigger>
          <SelectContent className='bg-gray-200'>
            <SelectItem value='category'> 
              By category
            </SelectItem>

            <SelectItem value='rating'> 
              By rating
            </SelectItem>

            <SelectItem value='rating_count'> 
              By rating count
            </SelectItem>

            <SelectItem value='price'> 
              By price
            </SelectItem>            
            {/* {categories.map((category) => (
              <SelectItem key={category} value={category} className='hover:bg-gray-300 hover:scale-[1.02]'>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))} */}
          </SelectContent>
        </Select>

        <div>
          

          {(filter == "rating" || filter == "rating_count" || filter == "price") && 
            <Select value={selectedRating} onValueChange={setSelectRating}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-200">
                <SelectValue placeholder="Low to High" />
              </SelectTrigger>
              <SelectContent className='bg-gray-200'>
                {/* {categories.map((category) => (
                  <SelectItem key={category} value={category} className='hover:bg-gray-300 hover:scale-[1.02]'>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))} */}
                <SelectItem value='asc'>Low to High</SelectItem>
                <SelectItem value='desc'>High to Low</SelectItem>
              </SelectContent>
            </Select>
          }
        </div>
      </div>

      <div>
        {filter == "category" && 
          <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={resetCategoryFilter}
                className={categoryPath.length === 0 ? "bg-primary/10" : ""}
              >
                Reset
              </Button>

              {/* Dropdown for each level in the hierarchy */}
              {availableCategoriesByLevel.map((categories, level) => (
                <div key={level} className="flex items-center">
                  {level > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={level < categoryPath.length ? "bg-primary/10" : ""}
                      >
                        {level < categoryPath.length
                          ? categoryPath[level]
                          : level === 0
                            ? "Select Category"
                            : "Choose next"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto bg-gray-200">
                      <DropdownMenuLabel>
                        {level === 0 ? "Main Categories" : `${categoryPath[level - 1]} Subcategories`}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <DropdownMenuItem
                              key={category.name}
                              onClick={() => {
                                setLevel(level)
                                handleCategorySelect(level, category.name)
                              }}
                              className={categoryPath[level] === category.name ? "bg-primary/10" : ""}
                            >
                              {category.name}
                              <span className="ml-auto text-xs text-muted-foreground">({category.count})</span>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>No subcategories available</DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {/* Add an extra dropdown if the current level has subcategories but isn't shown yet */}
              {categoryPath.length > 0 &&
                hasSubcategories(categoryPath.length - 1) &&
                availableCategoriesByLevel.length === categoryPath.length && (
                  <div className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // This is a placeholder - clicking this should open the dropdown
                        // but we need to ensure the data is loaded first
                      }}
                    >
                      {`Select Level ${categoryPath.length + 1}`}
                    </Button>
                  </div>
                )}
          </div>
              // <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              //   <SelectTrigger className="w-full md:w-[200px] bg-gray-200">
              //     <SelectValue placeholder="Category" />
              //   </SelectTrigger>
              //   <SelectContent className='bg-gray-200'>
              //     {categories.map((category) => (
              //       <SelectItem key={category} value={category} className='hover:bg-gray-300 hover:scale-[1.02]'>
              //         {category === "all" ? "All Categories" : category}
              //       </SelectItem>
              //     ))}
              //   </SelectContent>
              // </Select>     
        }
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8 mt-8">
        <Card className='bg-yellow-200 shadow-xl'>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent className=''>
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
          </CardContent>
        </Card>

        <Card className='bg-lime-200 shadow-xl'>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center justify-content-center gap-2">
              {filteredProducts.length > 0
                ? (
                    filteredProducts.reduce(
                      (sum, product) => sum + Number.parseFloat(product.rating?.toString() || "0"),
                      0,
                    ) / filteredProducts.length
                  ).toFixed(1)
                : "N/A"
                }{" "}
                <StarRating 
                size='md'
                readOnly
                initialRating={
                  filteredProducts.reduce(
                      (sum, product) => sum + Number.parseFloat(product.rating?.toString() || "0"),
                      0,
                    ) / filteredProducts.length}
                />
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-2 lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg> */}
            </div>
          </CardContent>
        </Card>

        <Card className='bg-emerald-200 shadow-xl'>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Discount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredProducts.length > 0
                ? (
                    filteredProducts.reduce(
                      (sum, product) => sum + Number.parseInt(product.discount_percentage?.replace("%", "") || "0"),
                      0,
                    ) / filteredProducts.length
                  ).toFixed(0)
                : "N/A"}
              %
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Showing {count} of {filteredProducts.length} products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>

                <TableHead>STT</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className={cn(filter == "category" && "bg-blue-200")}>
                  Category

                </TableHead>
                <TableHead className={cn(filter == "price" && "bg-blue-200")}>
                  <div className='gap-2 flex items-center justify-content-center'>
                  { filter == "price" &&
                    <div>
                      {selectedRating == "asc" ? 
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4 lucide lucide-arrow-up-narrow-wide-icon lucide-arrow-up-narrow-wide"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/></svg>
                        </div> :

                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4 lucide lucide-arrow-down-wide-narrow-icon lucide-arrow-down-wide-narrow"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/></svg>
                        </div>
                      }
                    </div>
                  }
                  Price
                  </div>

                </TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className={cn(filter == "rating" && "bg-blue-200")}>
                  <div className='gap-2 flex items-center justify-content-center'>
                  { filter == "rating" &&
                    <div>
                      {selectedRating == "asc" ? 
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4 lucide lucide-arrow-up-narrow-wide-icon lucide-arrow-up-narrow-wide"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/></svg>
                        </div> :

                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4 lucide lucide-arrow-down-wide-narrow-icon lucide-arrow-down-wide-narrow"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/></svg>
                        </div>
                      }
                    </div>
                  }
                  Rating
                  </div>

                </TableHead>
                <TableHead className={cn(filter == "rating_count" && "bg-blue-200")}>
                  <div className='gap-2 flex items-center justify-content-center'>
                  { filter == "rating_count" &&
                    <div>
                      {selectedRating == "asc" ? 
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4 lucide lucide-arrow-up-narrow-wide-icon lucide-arrow-up-narrow-wide"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/></svg>
                        </div> :

                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4 lucide lucide-arrow-down-wide-narrow-icon lucide-arrow-down-wide-narrow"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/></svg>
                        </div>
                      }
                    </div>
                  }
                  Rating count
                  </div>

                </TableHead>
                <TableHead>
                  See product as Customer
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredProducts.slice(0, count).map((product,index) => (
                <TableRow key={product.product_id} >
                  <TableCell className='font-medium'>{index+1}</TableCell>

                  <TableCell className='font-medium'>
                    {product.product_id}
                  </TableCell>

                  <TableCell className="font-medium flex items-center justify-content-center gap-4">
                    <img
                      src={product.img_link && "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"}
                      className="w-10 h-10 object-contain flex-shrink-0"
                    />
                    <div className="max-w-40 overflow-x-auto">
                      <div className="flex items-center gap-2 w-fit p-3">

                        <span className="line-clamp-2">{product.product_name}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className={cn(filter == "category" && "bg-blue-50 rounded-md","p-1")}>
                      {product.category?.split("|")[level]}
                    </div>
                    
                    {/* {categoryPath} */}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{product.discounted_price}</span>
                      <span className="text-sm text-muted-foreground line-through text-gray-500">{product.actual_price}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="bg-green-50 text-green-700 border-green-200 text-center rounded-md">
                      {product.discount_percentage}
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* <div className="flex items-center">
                      <span className="mr-1 flex items-center justify-content-center">
                        {product.rating} 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-2 w-4 h-4 lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
                        </span>
                    </div> */}
                    <div className="flex items-center mr-2">
                      <div className='mr-2'>{product.rating}</div>
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
                  </div>
                  </TableCell>
                  <TableCell>
                    <span className="ml-1">{product.rating_count}</span>

                  </TableCell>
                  <TableCell>
                    <Link to={'/uservirtual?product_id='+ product.product_id + '&product_name='+product.product_name}>
                      <div className='bg-gray-200 px-2 rounded-md text-center font-bold py-1 hover:scale-[1.09]'>View</div>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div 
            className='bg-gray-200 mt-2 p-2 w-fit ml-auto rounded-md cursor-pointer'
            onClick={() => handleLoadMore()}
          >
            Get more products
          </div>
          {/* {filteredProducts.length > 10 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Showing 10 of {filteredProducts.length} products
            </div>
          )} */}
        </CardContent>
      </Card>

      
      {/* Charts */}
      <Tabs defaultValue="ratings" className="mb-8 mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="ratings" >Ratings</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Number of products by rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Number of Products" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discounts">
          <Card>
            <CardHeader>
              <CardTitle>Discount Distribution</CardTitle>
              <CardDescription>Number of products by discount range</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={discountData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="Number of Products" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Products by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (

                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} onClick={() => console.log(entry)}/>
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} products`, "Count"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Table */}
      
    </div>
  )
}
export default Product
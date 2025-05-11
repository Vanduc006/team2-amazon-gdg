// import React from 'react'
import { productData } from './product'
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
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const Product = () => {
  const testData = productData.slice(0,1000)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [count,setCount] = useState<any>(10)
  // Extract unique categories
  const handleLoadMore = () => {
    setCount(count + 10)
  }
  const categories = useMemo(() => {
    const categorySet = new Set<string>()
    testData.forEach((product) => {
      if (product.category) {
        const mainCategory = product.category.split("|")[0]
        categorySet.add(mainCategory)
      }
    })
    return ["all", ...Array.from(categorySet)]
  }, [])

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return testData.filter((product) => {
      const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || (product.category && product.category.startsWith(selectedCategory))
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  // Prepare data for charts
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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Product Summary</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center justify-content-center">
              {filteredProducts.length > 0
                ? (
                    filteredProducts.reduce(
                      (sum, product) => sum + Number.parseFloat(product.rating?.toString() || "0"),
                      0,
                    ) / filteredProducts.length
                  ).toFixed(1)
                : "N/A"}{" "}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-2 lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
            </div>
          </CardContent>
        </Card>
        <Card>
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
            Showing {filteredProducts.length} of {testData.length} products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>

                <TableHead>STT</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredProducts.slice(0, count).map((product,index) => (
                <TableRow key={product.product_id} >
                  <TableCell className='font-medium'>{index}</TableCell>

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
                  <TableCell>{product.category?.split("|")[0]}</TableCell>
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
                    <div className="flex items-center">
                      <span className="mr-1">{product.rating}</span>★
                      <span className="text-xs text-muted-foreground ml-1">({product.rating_count})</span>
                    </div>
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
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
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
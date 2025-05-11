// import React from "react"
// import './App.css'
import {Routes, Route } from 'react-router-dom';
import DashLayout from './dash/DashLayout';
import Home from './dash/Home';
import FeedBack from './dash/FeedBack';
import Product from './dash/Product';
// import { Home } from 'lucide-react';
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<DashLayout/>}>
          <Route index element={<Home/>} />
          <Route path='/feedback' element={<FeedBack/>} />
          <Route path='/product' element={<Product/>} />
        </Route>
        
      </Routes>
    </>
  )
}

export default App

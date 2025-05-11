import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashLayout from './dash/DashLayout';
import Home from './dash/Home';
import FeedBack from './dash/FeedBack';
import Product from './dash/Product';
// import { Loader2 } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          {/* <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-300" /> */}
          <span className="text-gray-700 dark:text-gray-200 flex items-center justify-content-center gap-2">
            <img src='/favicon.svg' className='w-[50px] h-[50px] rounded-md'/>
            
            GDG TEAM 2
          </span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/' element={<DashLayout />}>
        <Route index element={<Home />} />
        <Route path='/feedback' element={<FeedBack />} />
        <Route path='/product' element={<Product />} />
      </Route>
    </Routes>
  );
}

export default App;

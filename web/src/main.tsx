// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProductDataProvider } from './dash/ProductContext.tsx'
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <BrowserRouter>
    <ProductDataProvider>
      <App/>
    </ProductDataProvider>
  </BrowserRouter>
)

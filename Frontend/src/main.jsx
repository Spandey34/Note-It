import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { AuthProvider } from './context/AuthProvider.jsx'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import { LoadingProvider } from './context/LoadingProvider.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter >
  <LoadingProvider>
    <ThemeProvider >
    <AuthProvider>
     <App />
    </AuthProvider>
   </ThemeProvider>
  </LoadingProvider>
  </BrowserRouter>
  
)

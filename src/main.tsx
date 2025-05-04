
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { Toaster } from './components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
      <SonnerToaster />
    </BrowserRouter>
  </React.StrictMode>,
)

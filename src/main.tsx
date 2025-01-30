import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.tsx'
import AddPage from './pages/Add.tsx'
import FrontPage from './pages/FrontPage.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Login />
    <AddPage />
    <FrontPage />
  </StrictMode>,
)

import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import Layout from './layout/Layout'
import { ThemeProvider } from './shared/contexts/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  </BrowserRouter>,
)

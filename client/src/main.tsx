import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './typography.css'
import App from './App'

try {
  document.documentElement.dataset.reduceMotion = localStorage.getItem('cityvet-reduce-motion') ?? 'false'
} catch {
  // Keep the default appearance when browser storage is unavailable.
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

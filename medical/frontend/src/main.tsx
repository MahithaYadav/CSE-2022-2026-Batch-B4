import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import './i18n/index'
// This line is the "magic" that prevents the white screen.
// It initializes all your translations (English, Telugu, Hindi, etc.)
import './i18n/index' 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
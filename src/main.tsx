import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeProvider'
import { ToastProvider } from './context/ToastProvider'
import { AppProvider } from './context/AppProvider'
import { AuthModalProvider } from './context/AuthModalProvider'
import { ConfirmProvider } from './context/ConfirmProvider'
import './index.css'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter basename={basename}>
          <AppProvider>
            <AuthModalProvider>
              <ConfirmProvider>
                <App />
              </ConfirmProvider>
            </AuthModalProvider>
          </AppProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)

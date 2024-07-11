import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './services/auth/msalInstance'
import { AppProvider } from './context/AppContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MsalProvider instance={msalInstance}>
        <AppProvider>
          <App />
        </AppProvider>
      </MsalProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

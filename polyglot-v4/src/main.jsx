import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { AppProvider } from './context/AppContext';
import App from './App';
import './index.css';

// MSAL configuration
const pca = new PublicClientApplication({
  // Your MSAL configuration here
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <MsalProvider instance={pca}>
        <AppProvider>
          <App />
        </AppProvider>
      </MsalProvider>
    </Router>
  </React.StrictMode>
);

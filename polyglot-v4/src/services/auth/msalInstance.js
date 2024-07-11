import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './config';

export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize the MSAL instance
msalInstance.initialize().catch(error => {
  console.error('Error initializing MSAL:', error);
});

import { useState, useCallback, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest } from '../services/auth/config';

export const useAuth = () => {
  const { instance, accounts } = useMsal();
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]);
    } else {
      setCurrentAccount(null);
    }
  }, [accounts]);

  const signInMicrosoft = useCallback(() => {
    instance.loginRedirect(loginRequest);
  }, [instance]);

  const signOut = useCallback(async () => {
    await instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
  }, [instance]);

  const getToken = useCallback(async () => {
    if (currentAccount) {
      const silentRequest = {
        ...loginRequest,
        account: currentAccount
      };
      try {
        const response = await instance.acquireTokenSilent(silentRequest);
        return response.accessToken;
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          instance.acquireTokenRedirect(silentRequest);
        }
        console.error('Error acquiring token:', error);
        throw error;
      }
    }
    return null;
  }, [currentAccount, instance]);

  return {
    signInMicrosoft,
    signOut,
    getToken,
    currentAccount,
    isAuthenticated: !!currentAccount
  };
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { signInMicrosoft, signOut, getToken, currentAccount, isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated && currentAccount) {
        try {
          const token = await getToken();
          setUser({
            name: currentAccount.name,
            email: currentAccount.username,
            provider: 'microsoft'
          });
        } catch (error) {
          console.error('Error fetching user info:', error);
          setError('Failed to fetch user information');
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [isAuthenticated, currentAccount, getToken]);

  const clearError = () => setError(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      clearError, 
      signInMicrosoft, 
      signOut: handleSignOut,
      isAuthenticated 
    }}>
      {children}
    </AppContext.Provider>
  );
};

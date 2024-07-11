import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Flex, View, Button, Text, ProgressCircle } from '@adobe/react-spectrum';
import { useAppContext } from '../context/AppContext';

const Layout = () => {
  const { isLoading, error, clearError, user, signInMicrosoft, signInGoogle, signOut } = useAppContext();

  const handleSignIn = async (provider) => {
    try {
      if (provider === 'microsoft') {
        await signInMicrosoft();
      } else if (provider === 'google') {
        await signInGoogle();
      }
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  return (
    <Flex direction="column" height="100vh">
      <Flex direction="row" gap="size-100" padding="size-100" backgroundColor="gray-200">
        <Link to="/"><Button variant="primary">Home</Button></Link>
        {user ? (
          <>
            <Link to="/dashboard"><Button variant="primary">Dashboard</Button></Link>
            <Link to="/profile"><Button variant="primary">Profile</Button></Link>
            <Link to="/settings"><Button variant="primary">Settings</Button></Link>
            <Button variant="negative" onPress={signOut}>Sign Out</Button>
          </>
        ) : (
          <>
            <Button variant="primary" onPress={() => handleSignIn('microsoft')}>Sign In with Microsoft</Button>
            <Button variant="primary" onPress={() => handleSignIn('google')}>Sign In with Google</Button>
          </>
        )}
      </Flex>
      {isLoading && (
        <View padding="size-100" backgroundColor="blue-400">
          <ProgressCircle aria-label="Loading" isIndeterminate />
        </View>
      )}
      {error && (
        <View padding="size-100" backgroundColor="negative">
          <Text>{error}</Text>
          <Button variant="primary" onPress={clearError}>Dismiss</Button>
        </View>
      )}
      <View padding="size-100" flex>
        <Outlet />
      </View>
    </Flex>
  );
};

export default Layout;

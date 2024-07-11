import React from 'react';
import { Heading, Button, View } from '@adobe/react-spectrum';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { signIn, isAuthenticated, currentAccount } = useAuth();

  const handleSignIn = async () => {
    await signIn();
  };

  return (
    <View padding="size-200">
      <Heading level={1}>Welcome to Polyglot v4</Heading>
      {!isAuthenticated ? (
        <Button variant="cta" onPress={handleSignIn}>Sign in with Microsoft</Button>
      ) : (
        <Heading level={2}>Welcome, {currentAccount?.name || 'User'}</Heading>
      )}
    </View>
  );
};

export default Home;

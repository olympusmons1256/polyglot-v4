import React from 'react';
import { Heading, Text, Button } from '@adobe/react-spectrum';
import { useAppContext } from '../context/AppContext';

const Home = () => {
  const { signInMicrosoft, signInGoogle } = useAppContext();

  const handleSignIn = (provider) => {
    if (provider === 'microsoft') {
      signInMicrosoft();
    } else if (provider === 'google') {
      signInGoogle();
    }
  };

  return (
    <div>
      <Heading level={1}>Welcome to Polyglot</Heading>
      <Text>Please sign in to get started:</Text>
      <Button variant="cta" onPress={() => handleSignIn('microsoft')}>Sign in with Microsoft</Button>
      <Button variant="primary" onPress={() => handleSignIn('google')}>Sign in with Google</Button>
    </div>
  );
};

export default Home;

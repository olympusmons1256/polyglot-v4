import React, { useState, useEffect } from 'react';
import { Heading, Content, Button, ProgressCircle, Text, Flex, View } from '@adobe/react-spectrum';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentProvider, signOut, getToken } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        let response;
        if (currentProvider === 'microsoft') {
          response = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
              'Authorization': Bearer ,
            },
          });
        } else if (currentProvider === 'google') {
          response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              'Authorization': Bearer ,
            },
          });
        }
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentProvider) {
      fetchUserInfo();
    }
  }, [currentProvider, getToken]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return <ProgressCircle aria-label="Loading user info" isIndeterminate />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <Heading level={1}>User Profile</Heading>
      <Content>
        {currentProvider && userInfo ? (
          <Flex direction="column" gap="size-100">
            <Text>You are signed in with {currentProvider}.</Text>
            <Text>Name: {userInfo.displayName || userInfo.name}</Text>
            <Text>Email: {userInfo.mail || userInfo.email}</Text>
            <Button variant="negative" onPress={handleSignOut}>Sign Out</Button>
          </Flex>
        ) : (
          <Text>Please sign in to view your profile.</Text>
        )}
      </Content>
    </View>
  );
};

export default Profile;

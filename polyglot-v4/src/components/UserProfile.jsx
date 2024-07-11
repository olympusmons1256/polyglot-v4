import React from 'react';
import { Heading, View, Text, Flex } from '@adobe/react-spectrum';
import { useAppContext } from '../context/AppContext';

const UserProfile = () => {
  const { user } = useAppContext();

  if (!user) {
    return <Text>Please sign in to view your profile.</Text>;
  }

  return (
    <View padding="size-200">
      <Heading level={1}>User Profile</Heading>
      <Flex direction="column" gap="size-100">
        <Text>Name: {user.name}</Text>
        <Text>Email: {user.email}</Text>
        {/* Add more user details as needed */}
      </Flex>
    </View>
  );
};

export default UserProfile;

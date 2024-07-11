import React from 'react';
import { View, Heading, Text, Content } from '@adobe/react-spectrum';

const UserInfoCard = ({ user }) => {
  return (
    <View
      backgroundColor="gray-100"
      borderWidth="thin"
      borderColor="gray-400"
      borderRadius="medium"
      padding="size-200"
      width="size-3000"
    >
      <Heading level={3}>User Information</Heading>
      <Content>
        <Text>Name: {user?.name}</Text>
        <Text>Email: {user?.email}</Text>
        <Text>Provider: {user?.provider}</Text>
      </Content>
    </View>
  );
};

export default UserInfoCard;

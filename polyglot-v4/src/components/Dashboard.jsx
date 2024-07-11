import React from 'react';
import { Heading, Text, View } from '@adobe/react-spectrum';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { user } = useAppContext();

  return (
    <View>
      <Heading level={1}>Dashboard</Heading>
      <Text>Welcome, {user?.name || 'User'}!</Text>
      {/* Add more dashboard content here */}
    </View>
  );
};

export default Dashboard;

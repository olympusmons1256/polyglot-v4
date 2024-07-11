import React from 'react';
import { Flex, View, Heading, Text, Divider } from '@adobe/react-spectrum';
import { useAppContext } from '../context/AppContext';
import UserInfoCard from '../components/dashboard/UserInfoCard';
import StatisticsWidget from '../components/dashboard/StatisticsWidget';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const Dashboard = () => {
  const { user } = useAppContext();

  return (
    <View padding="size-200">
      <Heading level={1}>Dashboard</Heading>
      <Divider size="M" />
      <Flex direction="row" gap="size-200" wrap>
        <UserInfoCard user={user} />
        <StatisticsWidget />
        <ActivityFeed />
      </Flex>
    </View>
  );
};

export default Dashboard;

import React from 'react';
import { View, Heading, Content, Text, Flex } from '@adobe/react-spectrum';

const ActivityItem = ({ action, time }) => (
  <Flex direction="row" justifyContent="space-between">
    <Text>{action}</Text>
    <Text>{time}</Text>
  </Flex>
);

const ActivityFeed = () => {
  // This would typically come from an API
  const activities = [
    { action: 'Completed Project A', time: '2 hours ago' },
    { action: 'Started Task X', time: '4 hours ago' },
    { action: 'Commented on Task Y', time: '1 day ago' },
    { action: 'Created Project B', time: '2 days ago' },
  ];

  return (
    <View
      backgroundColor="gray-100"
      borderWidth="thin"
      borderColor="gray-400"
      borderRadius="medium"
      padding="size-200"
      width="size-3000"
    >
      <Heading level={3}>Recent Activity</Heading>
      <Content>
        {activities.map((activity, index) => (
          <ActivityItem key={index} action={activity.action} time={activity.time} />
        ))}
      </Content>
    </View>
  );
};

export default ActivityFeed;

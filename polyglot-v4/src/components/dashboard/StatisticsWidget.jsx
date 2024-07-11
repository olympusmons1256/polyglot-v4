import React from 'react';
import { View, Heading, Flex, Text } from '@adobe/react-spectrum';

const StatisticItem = ({ label, value }) => (
  <View>
    <Heading level={4}>{value}</Heading>
    <Text>{label}</Text>
  </View>
);

const StatisticsWidget = () => {
  // These would typically come from an API or state management
  const stats = [
    { label: 'Projects', value: 12 },
    { label: 'Tasks', value: 48 },
    { label: 'Completed', value: 36 },
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
      <Heading level={3}>Statistics</Heading>
      <Flex direction="row" gap="size-200" justifyContent="space-around">
        {stats.map((stat, index) => (
          <StatisticItem key={index} label={stat.label} value={stat.value} />
        ))}
      </Flex>
    </View>
  );
};

export default StatisticsWidget;

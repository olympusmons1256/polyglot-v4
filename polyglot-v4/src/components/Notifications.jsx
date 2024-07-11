import React from 'react';
import { View, Text, Flex } from '@adobe/react-spectrum';
import { useAppContext } from '../context/AppContext';

const Notifications = () => {
  const { notifications, removeNotification } = useAppContext();

  return (
    <View position="fixed" bottom="size-100" right="size-100">
      <Flex direction="column" gap="size-100">
        {notifications.map(notif => (
          <View 
            key={notif.id} 
            backgroundColor="notice" 
            padding="size-100" 
            borderRadius="medium"
            onClick={() => removeNotification(notif.id)}
          >
            <Text>{notif.message}</Text>
          </View>
        ))}
      </Flex>
    </View>
  );
};

export default Notifications;

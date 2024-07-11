import React from 'react';
import { Heading, View, Switch, Flex, Button } from '@adobe/react-spectrum';
import { useAppContext } from '../context/AppContext';

const Settings = () => {
  const { theme, toggleTheme, addNotification } = useAppContext();

  const handleSave = () => {
    addNotification('Settings saved successfully');
  };

  return (
    <View>
      <Heading level={1}>Settings</Heading>
      <Flex direction="column" gap="size-200">
        <Switch isSelected={theme === 'dark'} onChange={toggleTheme}>Dark Mode</Switch>
        <Button variant="cta" onPress={handleSave}>Save Settings</Button>
      </Flex>
    </View>
  );
};

export default Settings;

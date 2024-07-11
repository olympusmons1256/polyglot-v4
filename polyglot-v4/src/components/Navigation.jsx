import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, View, Button } from '@adobe/react-spectrum';
import Home from '@spectrum-icons/workflow/Home';
import Dashboard from '@spectrum-icons/workflow/Dashboard';
import User from '@spectrum-icons/workflow/User';
import Settings from '@spectrum-icons/workflow/Settings';

const Navigation = () => {
  return (
    <View backgroundColor="gray-75" height="100%" padding="size-100">
      <Flex direction="column" gap="size-100">
        <Link to="/"><Button variant="primary" icon={<Home />}>Home</Button></Link>
        <Link to="/dashboard"><Button variant="primary" icon={<Dashboard />}>Dashboard</Button></Link>
        <Link to="/profile"><Button variant="primary" icon={<User />}>Profile</Button></Link>
        <Link to="/settings"><Button variant="primary" icon={<Settings />}>Settings</Button></Link>
      </Flex>
    </View>
  );
};

export default Navigation;

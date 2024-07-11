import React, { useEffect } from 'react';
import { View, Heading, ProgressCircle } from '@adobe/react-spectrum';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await signOut();
      // Redirect to home page after logout
      navigate('/');
    };

    performLogout();
  }, [signOut, navigate]);

  return (
    <View>
      <Heading level={1}>Logging out...</Heading>
      <ProgressCircle aria-label="Logging out" isIndeterminate />
    </View>
  );
};

export default Logout;

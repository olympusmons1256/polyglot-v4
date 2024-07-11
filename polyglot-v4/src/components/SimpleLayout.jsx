import React from 'react';
import { Outlet } from 'react-router-dom';

const SimpleLayout = () => {
  return (
    <div>
      <h1>Simple Layout</h1>
      <Outlet />
    </div>
  );
};

export default SimpleLayout;

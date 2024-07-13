import React from 'react';
import SideMenu from './SideMenu';
import CanvasArea from './CanvasArea';
import InputModule from './InputModule';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <SideMenu />
      <div className="main-area">
        <CanvasArea />
        <InputModule />
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import Sidebar from './Sidebar'; // Assuming Sidebar is already built
import { Outlet } from 'react-router-dom'; // Renders the child routes dynamically

const UserAccountLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Sidebar for navigation */}
      <Sidebar />
      
      {/* Main content area */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default UserAccountLayout;
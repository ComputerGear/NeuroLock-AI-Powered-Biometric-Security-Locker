import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';

const UserLayout = () => {
  return (
    <div className="admin-layout"> {/* We can reuse the admin-layout CSS */}
      <UserSidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
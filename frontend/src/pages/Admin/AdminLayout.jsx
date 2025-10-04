import React from 'react';
import { Outlet } from 'react-router-dom';
// The import path is now simpler because the files are in the same directory
import AdminSidebar from './AdminSidebar'; 

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
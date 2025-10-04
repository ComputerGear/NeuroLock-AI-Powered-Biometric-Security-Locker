import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LuLayoutDashboard, LuUsers, LuHistory, LuLogOut } from 'react-icons/lu';
import useAppStore from '../../state/appStore';

const AdminSidebar = () => {
  const logout = useAppStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to the homepage after logout
  };

  // This function is passed to NavLink to conditionally apply a class
  const navLinkClass = ({ isActive }) => 
    `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`;

  return (
    <aside className="sidebar">
      <h1 className="sidebar-brand">LockSafe Admin</h1>
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className={navLinkClass}>
          <LuLayoutDashboard />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/requests" className={navLinkClass}>
          <LuUsers />
          <span>Pending Requests</span>
        </NavLink>
        <NavLink to="/admin/users" className={navLinkClass}>
          <LuHistory />
          <span>Manage Users</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-link">
          <LuLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
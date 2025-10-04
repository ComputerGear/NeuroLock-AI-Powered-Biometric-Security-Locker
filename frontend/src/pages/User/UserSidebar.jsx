import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LuLayoutDashboard, LuShieldCheck, LuUsers, LuPackagePlus, LuLogOut } from 'react-icons/lu';
import useAppStore from '../../state/appStore';

const UserSidebar = () => {
  const logout = useAppStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => 
    `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`;

  return (
    <aside className="sidebar">
      <h1 className="sidebar-brand">User Menu</h1>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={navLinkClass}>
          <LuLayoutDashboard />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/set-pin" className={navLinkClass}>
          <LuShieldCheck />
          <span>Set / Change PIN</span>
        </NavLink>
        <NavLink to="/nominees" className={navLinkClass}>
          <LuUsers />
          <span>Manage Nominees</span>
        </NavLink>
        <NavLink to="/subscriptions" className={navLinkClass}>
          <LuPackagePlus />
          <span>More Subscriptions</span>
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

export default UserSidebar;
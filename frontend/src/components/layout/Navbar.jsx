// frontend/src/components/layout/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* --- MODIFIED SECTION --- */}
        {/* Logo / Brand Name */}
        <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/images/logo.png" alt="LockSafe Logo" style={{ height: '40px', marginRight: '10px' }} />
          <span>NeuroLock</span>
        </Link>
        {/* --- END MODIFICATION --- */}

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/login">User Login</Link>
          <Link to="/admin/login">Admin Login</Link>
          <Link
            to="/locker-access"
            className="navbar-button"
          >
            Access Your Locker
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
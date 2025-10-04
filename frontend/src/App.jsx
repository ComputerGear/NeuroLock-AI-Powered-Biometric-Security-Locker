import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- CORE LAYOUT & AUTH ---
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserLayout from './pages/User/UserLayout';
import AdminLayout from './pages/Admin/AdminLayout';

// --- PUBLIC PAGES ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationFlow from './pages/RegistrationFlow';
import LockerAccessFlow from './pages/LockerAccessFlow';

// --- USER PAGES (goes inside UserLayout) ---
import UserDashboard from './pages/User/UserDashboard';
import SetPinPage from './pages/User/SetPinPage';
import NomineesPage from './pages/User/NomineesPage';
import SubscriptionPage from './pages/User/SubscriptionPage';

// --- ADMIN PAGES (goes inside AdminLayout) ---
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import PendingRequestsPage from './pages/Admin/PendingRequestsPage';
import ManageUsersPage from './pages/Admin/ManageUsersPage';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationFlow />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/locker-access" element={<LockerAccessFlow />} />

            {/* --- User Protected Routes (with Sidebar Layout) --- */}
            <Route path="/" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="set-pin" element={<SetPinPage />} />
              <Route path="nominees" element={<NomineesPage />} />
              <Route path="subscriptions" element={<SubscriptionPage />} />
            </Route>

            {/* --- Admin Protected Routes (with Sidebar Layout) --- */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="requests" element={<PendingRequestsPage />} />
              <Route path="users" element={<ManageUsersPage />} />
            </Route>
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
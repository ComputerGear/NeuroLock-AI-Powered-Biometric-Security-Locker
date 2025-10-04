import React, { useState, useEffect } from 'react';
import { LuUsers, LuClock, LuLock } from 'react-icons/lu';
import adminService from '../../api/adminService';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{icon}</div>
      <div>
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{value}</p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ pending_count: 0, active_users_count: 0, total_users_count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard stats.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="page-header">System Overview</h1>
      {isLoading ? (
        <p>Loading stats...</p>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="stats-grid">
          <StatCard title="Pending Applications" value={stats.pending_count} icon={<LuClock size={24} />} />
          <StatCard title="Active Lockers / Users" value={stats.active_users_count} icon={<LuLock size={24} />} />
          <StatCard title="Total Users" value={stats.total_users_count} icon={<LuUsers size={24} />} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
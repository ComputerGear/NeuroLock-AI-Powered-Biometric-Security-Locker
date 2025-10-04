import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../state/appStore';
import Button from '../../components/common/Button';
import { LuKeyRound, LuUsers, LuPackagePlus, LuScanFace } from 'react-icons/lu';

const DashboardCard = ({ title, description, icon, onClick }) => (
  <div className="dashboard-card">
    <div className="dashboard-card-icon">{icon}</div>
    <h2 className="dashboard-card-title">{title}</h2>
    <p className="dashboard-card-description">{description}</p>
    <Button onClick={onClick}>Go</Button>
  </div>
);

const UserDashboard = () => {
  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="page-header">Welcome, {user?.email || 'User'}!</h1>
      <div className="stats-grid"> {/* Reusing the stats-grid CSS for a nice card layout */}
        <DashboardCard
          title="Access Your Locker"
          description="Authenticate with your face to begin the secure access process."
          icon={<LuScanFace size={24} />}
          onClick={() => navigate('/locker-access')}
        />
        <DashboardCard
          title="Set / Change PIN"
          description="Update your secret 6-digit PIN for locker access."
          icon={<LuKeyRound size={24} />}
          onClick={() => navigate('/set-pin')}
        />
        <DashboardCard
          title="Manage Nominees"
          description="Add or update nominee details for your account."
          icon={<LuUsers size={24} />}
          onClick={() => navigate('/nominees')}
        />
        <DashboardCard
          title="More Subscriptions"
          description="Explore other locker plans to suit your needs."
          icon={<LuPackagePlus size={24} />}
          onClick={() => navigate('/subscriptions')}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
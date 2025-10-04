import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import adminService from '../../api/adminService';

const PendingRequestsPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [approvingId, setApprovingId] = useState(null);

  const fetchPendingUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await adminService.getPendingRequests();
      setPendingUsers(data);
    } catch (err) {
      setError('Could not load pending applications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    setApprovingId(userId);
    setError('');
    try {
      await adminService.approveRequest(userId);
      setSuccessMessage(`User ${userId} approved successfully! Payment link sent.`);
      fetchPendingUsers(); // Refresh the list
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError('Failed to approve the application.');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div>
      <h1 className="page-header">Pending User Applications</h1>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <div className="table-container">
        {isLoading ? (
          <p>Loading...</p>
        ) : pendingUsers.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button onClick={() => handleApprove(user.id)} disabled={approvingId === user.id}>
                      {approvingId === user.id ? 'Approving...' : 'Approve'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center' }}>No pending applications found.</p>
        )}
      </div>
    </div>
  );
};

export default PendingRequestsPage;
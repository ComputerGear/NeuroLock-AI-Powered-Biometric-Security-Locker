import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';

const ManageUsersPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await adminService.getAccessLogs();
        setLogs(data);
      } catch (err) {
        setError('Could not load access logs.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <h1 className="page-header">User Access Logs</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="table-container">
        {isLoading ? (
          <p>Loading...</p>
        ) : logs.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>Access Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.user.full_name}</td>
                  <td>{log.user.email}</td>
                  <td>{new Date(log.access_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
           <p style={{ textAlign: 'center' }}>No user access logs found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;
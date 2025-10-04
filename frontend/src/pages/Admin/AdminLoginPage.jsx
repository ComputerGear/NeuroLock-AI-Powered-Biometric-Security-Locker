import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import adminService from '../../api/adminService';
import useAppStore from '../../state/appStore';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const loginAction = useAppStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await adminService.login({ username, password });
      loginAction({ username }, data.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.detail || 'Admin login failed.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <Input
            name="username"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="alert alert-error">{error}</p>}
        <Button type="submit" style={{ width: '100%' }}>
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
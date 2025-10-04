import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import authService from '../api/authService';
import useAppStore from '../state/appStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const loginAction = useAppStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authService.login({ email, password });
      
      loginAction({ email, ...data.user }, data.access_token);
      
      if (data.user && data.user.is_first_login) {
        navigate('/set-pin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.detail || 'Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">User Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
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
      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#2563eb', textDecoration: 'underline' }}>
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import lockerService from '../../api/lockerService';

const SetPinPage = () => {
  // In a real app, you'd fetch the user's profile to see if a PIN is already set.
  // We'll simulate this with a state.
  const [hasPin, setHasPin] = useState(true); // Change to 'false' to see the "Set PIN" view
  
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^\d{6}$/.test(newPin)) {
      setError('New PIN must be exactly 6 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setError('New PINs do not match.');
      return;
    }

    try {
      // NOTE: You would need a new 'changePin' function in lockerService
      // that calls a new backend endpoint /locker/change-pin
      await lockerService.setPin(newPin); // Using setPin for both for now
      setSuccess('PIN updated successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.detail || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{hasPin ? 'Change Your Locker PIN' : 'Set Your Locker PIN'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {hasPin && (
          <div className="form-group">
            <label>Current PIN</label>
            <Input type="password" name="currentPin" value={currentPin} onChange={(e) => setCurrentPin(e.target.value)} maxLength="6" required />
          </div>
        )}
        <div className="form-group">
          <label>New PIN</label>
          <Input type="password" name="newPin" value={newPin} onChange={(e) => setNewPin(e.target.value)} maxLength="6" required />
        </div>
        <div className="form-group">
          <label>Confirm New PIN</label>
          <Input type="password" name="confirmPin" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} maxLength="6" required />
        </div>
        
        {error && <p className="alert alert-error">{error}</p>}
        {success && <p className="alert alert-success">{success}</p>}
        
        <Button type="submit" className="w-full" disabled={!!success}>
          {success ? 'PIN Updated!' : 'Update PIN'}
        </Button>
      </form>
    </div>
  );
};

export default SetPinPage;
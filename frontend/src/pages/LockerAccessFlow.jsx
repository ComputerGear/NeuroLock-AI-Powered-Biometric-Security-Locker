import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LivenessCheck from '../components/LivenessCheck';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import lockerService from '../api/lockerService';

const LockerAccessFlow = () => {
  const [step, setStep] = useState('face_scan'); // 'face_scan', 'pin_entry', 'success', 'failed'
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFaceSuccess = () => {
    setStep('pin_entry');
  };

  const handleFaceFailure = (message) => {
    setError(message);
    setStep('failed');
  };
  
  const handleUnlockSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await lockerService.unlock({ pin, otp });
      setStep('success');
      setTimeout(() => navigate('/dashboard'), 5000);
    } catch(err) {
      setError(err.detail || 'Unlock failed. Please check your PIN and OTP.');
    }
  };

  return (
    <div className="form-container" style={{ textAlign: 'center' }}>
      {step === 'face_scan' && (
        <>
          <h2 className="form-title">Face Verification</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Please look directly into the camera to verify your identity.
          </p>
          <LivenessCheck onSuccess={handleFaceSuccess} onFailure={handleFaceFailure} />
        </>
      )}

      {step === 'pin_entry' && (
        <>
          <h2 className="form-title">Final Step</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            An OTP has been sent to your mobile. Please enter it along with your PIN.
          </p>
          <form onSubmit={handleUnlockSubmit}>
            <div className="form-group">
              <Input type="password" placeholder="6-Digit Locker PIN" value={pin} onChange={(e) => setPin(e.target.value)} maxLength="6" required />
            </div>
            <div className="form-group">
              <Input type="text" placeholder="6-Digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required />
            </div>
            {error && <p className="alert alert-error">{error}</p>}
            <Button type="submit" style={{ width: '100%' }}>Unlock Locker</Button>
          </form>
        </>
      )}

      {step === 'success' && (
        <LockerOpened />
      )}

      {step === 'failed' && (
        <>
          <h2 className="form-title" style={{ color: '#721c24' }}>Access Denied</h2>
          <p style={{ color: '#6b7280' }}>{error}</p>
          <Button onClick={() => navigate('/dashboard')} style={{ marginTop: '1.5rem' }}>
            Back to Dashboard
          </Button>
        </>
      )}
    </div>
  );
};

export default LockerAccessFlow;
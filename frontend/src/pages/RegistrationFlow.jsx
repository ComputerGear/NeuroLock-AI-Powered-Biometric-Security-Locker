// frontend/src/pages/RegistrationFlow.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';

// Assuming you have these components from before
import FaceCaptureStep from '../components/registration/FaceCaptureStep';
import ReviewStep from '../components/registration/ReviewStep';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

// A new component for this file to keep it clean
const DetailsAndOtpStep = ({ onNext, formData, setFormData }) => {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    setMessage('Sending OTP...');
    try {
      // This needs a new function in authService to call /api/auth/send-otp
      await authService.sendOtp(formData.phone_number);
      setOtpSent(true);
      setMessage('OTP sent to your mobile number.');
    } catch (err) {
      setMessage('Failed to send OTP. Please check the number.');
    }
  };

  const handleVerifyOtp = async () => {
    setMessage('Verifying OTP...');
    try {
      // This needs a new function in authService to call /api/auth/verify-otp
      const response = await authService.verifyOtp(formData.phone_number, otp);
      if (response.verified) {
        setIsOtpVerified(true);
        setMessage('Phone number verified successfully!');
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (err) {
      setMessage('Invalid or expired OTP. Please try again.');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(); // Pass control to the parent to go to the next step
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="form-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Step 1: Your Details & Verification</h3>
      {message && <p className={`alert ${isOtpVerified ? 'alert-success' : 'alert-error'}`}>{message}</p>}
      
      <div className="form-group">
        <label>Phone Number</label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Input name="phone_number" placeholder="Phone Number" onChange={handleChange} required disabled={otpSent} />
          <Button type="button" onClick={handleSendOtp} disabled={otpSent}>
            {otpSent ? 'OTP Sent' : 'Send OTP'}
          </Button>
        </div>
      </div>

      {otpSent && !isOtpVerified && (
        <div className="form-group">
          <label>Enter OTP</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input name="otp" placeholder="6-Digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required />
            <Button type="button" onClick={handleVerifyOtp}>Verify OTP</Button>
          </div>
        </div>
      )}
      
      <hr style={{ margin: '2rem 0' }} />

      <div className="form-grid">
        <Input name="full_name" placeholder="Full Name" onChange={handleChange} required />
        <Input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
        <Input name="bank_account_no" placeholder="Bank Account Number" onChange={handleChange} required />
        <Input name="ifsc_code" placeholder="IFSC Code" onChange={handleChange} required />
        <Input name="branch_name" placeholder="Branch Name" onChange={handleChange} required />
      </div>

      {/* You can add dropdowns for subscription plan here as per your full plan */}

      <Button type="submit" style={{ width: '100%', marginTop: '1.5rem' }} disabled={!isOtpVerified}>
        Next: Face Capture
      </Button>
    </form>
  );
};


const RegistrationFlow = () => {
  const [step, setStep] = useState(1); // 1: Details, 2: Face, 3: Review
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone_number: '', bank_account_no: '',
    ifsc_code: '', branch_name: '', subscription_plan: 'Gold',
    tenure_years: 3, image_base64: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDetailsSubmit = () => {
    setStep(2);
  };

  const handleFaceSuccess = (imageData) => {
    setFormData(prev => ({ ...prev, image_base64: imageData }));
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      await authService.register(formData);
      // You can navigate to a success page or show a modal
      alert('Registration successful! Your application is under review.');
      navigate('/login');
    } catch (err) {
      setError(err.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Your NeuroLock Account</h2>
      {error && <p className="alert alert-error">{error}</p>}
      
      {step === 1 && <DetailsAndOtpStep onNext={handleDetailsSubmit} formData={formData} setFormData={setFormData} />}
      {step === 2 && <FaceCaptureStep onNext={handleFaceSuccess} onBack={handleBack} />}
      {step === 3 && <ReviewStep formData={formData} onSubmit={handleFinalSubmit} onBack={handleBack} isLoading={isLoading} />}
    </div>
  );
};

export default RegistrationFlow;
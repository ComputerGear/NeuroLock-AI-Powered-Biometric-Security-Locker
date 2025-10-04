import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const UserDetailsForm = ({ onNext }) => {
  const [details, setDetails] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    bank_account_no: '',
    ifsc_code: '',
    branch_name: '',
    subscription_plan: 'Gold',
    tenure_years: 3,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(details); // Pass the collected data to the parent
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="form-step-title">Step 1: Your Details</h3>
      <div className="form-grid">
        <Input name="full_name" placeholder="Full Name" onChange={handleChange} required />
        <Input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
        <Input name="phone_number" placeholder="Phone Number" onChange={handleChange} required />
        <Input name="bank_account_no" placeholder="Bank Account Number" onChange={handleChange} required />
        <Input name="ifsc_code" placeholder="IFSC Code" onChange={handleChange} required />
        <Input name="branch_name" placeholder="Branch Name" onChange={handleChange} required />
      </div>
      <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
        Next: Face Capture
      </Button>
    </form>
  );
};

export default UserDetailsForm;
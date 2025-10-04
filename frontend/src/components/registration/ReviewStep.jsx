import React from 'react';
import Button from '../common/Button';

const ReviewStep = ({ formData, onSubmit, onBack, isLoading }) => {
  return (
    <div>
      <h3 className="form-step-title">Step 3: Review Application</h3>
      <div className="review-details">
        <p><strong>Full Name:</strong> {formData.full_name}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Phone:</strong> {formData.phone_number}</p>
        <p><strong>Bank Account:</strong> {formData.bank_account_no}</p>
        <p><strong>Plan:</strong> {formData.subscription_plan} ({formData.tenure_years} years)</p>
        <img src={formData.image_base64} alt="Your captured photo" style={{ margin: '1rem auto', borderRadius: '8px', maxWidth: '200px' }}/>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Button onClick={onBack} variant="secondary" disabled={isLoading} style={{ flexGrow: 1 }}>Back</Button>
        <Button onClick={onSubmit} disabled={isLoading} style={{ flexGrow: 1 }}>
          {isLoading ? 'Submitting...' : 'Confirm & Submit'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <section className="hero-section">
        <h1>The Future of Secure Banking is Here</h1>
        <p>Experience state-of-the-art security with our facial recognition locker system.</p>
        <Link to="/register">
          <Button>Register for a New Locker</Button>
        </Link>
      </section>

      <section className="features-section">
        <h2>Why Choose LockSafe?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Biometric Access</h3>
            <p>Your face is your key. Unparalleled security with liveness detection to prevent spoofing.</p>
          </div>
          <div className="feature-card">
            <h3>Multi-Factor Security</h3>
            <p>Combines facial recognition, a personal PIN, and a one-time password (OTP) for access.</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Monitoring</h3>
            <p>Real-time access logs and instant notifications for all locker activity.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
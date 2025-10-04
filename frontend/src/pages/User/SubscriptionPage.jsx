import React from 'react';
import Button from '../../components/common/Button';

const SubscriptionCard = ({ plan, price, features }) => (
  <div className="subscription-card">
    <h3 className="subscription-plan">{plan}</h3>
    <p className="subscription-price">{price}</p>
    <ul className="subscription-features">
      {features.map((feature, index) => <li key={index}>{feature}</li>)}
    </ul>
    <Button>Choose Plan</Button>
  </div>
);

const SubscriptionPage = () => {
  return (
    <div>
      <h1 className="page-header">Our Locker Plans</h1>
      <p style={{textAlign: 'center', marginBottom: '2rem'}}>Choose the plan that's right for you.</p>
      <div className="stats-grid">
        <SubscriptionCard 
          plan="Silver" 
          price="₹3,000 / year"
          features={["Standard Size", "Biometric Access", "24/7 Support"]}
        />
        <SubscriptionCard 
          plan="Gold" 
          price="₹5,000 / year"
          features={["Medium Size", "Biometric Access", "Insurance Coverage", "24/7 Support"]}
        />
        <SubscriptionCard 
          plan="Platinum" 
          price="₹8,000 / year"
          features={["Large Size", "Biometric Access", "Enhanced Insurance", "Priority Support"]}
        />
      </div>
    </div>
  );
};

export default SubscriptionPage;
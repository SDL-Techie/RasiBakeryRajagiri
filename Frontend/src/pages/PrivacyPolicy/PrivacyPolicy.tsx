import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="rasi-policy-page">
      <div className="rasi-policy-container">
        <h1>Privacy Policy</h1>
        <p className="rasi-last-updated">Last Updated: October 2023</p>
        
        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, place an order, or contact us. This may include your name, email address, phone number, and delivery address.</p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to process your orders, communicate with you about your account, and send you updates about our products and services (if you opt-in).</p>
        </section>

        <section>
          <h2>3. Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons.</p>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>We use cookies to help us remember and process the items in your shopping cart and understand and save your preferences for future visits.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

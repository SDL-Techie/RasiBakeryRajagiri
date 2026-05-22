import React from 'react';
import './Terms.css';

const Terms: React.FC = () => {
  return (
    <div className="rasi-terms-page">
      <div className="rasi-terms-container">
        <h1>Terms & Conditions</h1>
        <p className="rasi-last-updated">Last Updated: October 2023</p>
        
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the Rasi Bakery website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.</p>
        </section>

        <section>
          <h2>2. Ordering & Payment</h2>
          <p>All orders are subject to availability and confirmation of the order price. Payment must be made in full at the time of ordering through our secure payment gateway.</p>
        </section>

        <section>
          <h2>3. Delivery</h2>
          <p>We aim to deliver your products within the estimated timeframes. However, delivery times are not guaranteed. We are not responsible for delays beyond our control.</p>
        </section>

        <section>
          <h2>4. Returns & Refunds</h2>
          <p>Due to the perishable nature of our products, we do not accept returns. If you are unsatisfied with your order, please contact us within 2 hours of delivery.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;

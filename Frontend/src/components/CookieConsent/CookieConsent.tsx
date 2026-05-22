import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import './CookieConsent.css';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('rasi-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('rasi-cookie-consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="rasi-cookie-consent"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          <div className="rasi-cookie-content">
            <div className="rasi-cookie-icon-wrapper">
              <Cookie className="rasi-cookie-icon" size={32} />
              <div className="rasi-cookie-chip chip-1"></div>
              <div className="rasi-cookie-chip chip-2"></div>
              <div className="rasi-cookie-chip chip-3"></div>
            </div>
            <div className="rasi-cookie-text">
              <h3>Freshly Baked Cookies!</h3>
              <p>We use cookies to ensure you get the best experience on our website. It's like the secret ingredient in our recipes!</p>
            </div>
            <div className="rasi-cookie-actions">
              <button className="rasi-cookie-btn rasi-cookie-accept" onClick={handleAccept}>
                Accept All
              </button>
              <button className="rasi-cookie-btn rasi-cookie-decline" onClick={handleDecline}>
                Decline
              </button>
            </div>
            <button className="rasi-cookie-close" onClick={handleDecline} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;

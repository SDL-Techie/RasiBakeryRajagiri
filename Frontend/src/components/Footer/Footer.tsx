
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import Logo from '../Logo/Logo';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="rasi-footer">
      <div className="rasi-footer-container">
        
        {/* BRAND & SOCIAL SECTION */}
        <div className="rasi-footer-section brand-summary">
          <Link to="/" className="rasi-footer-logo">
            <Logo />
          </Link>
          <p className="rasi-footer-desc">
            Serving the freshest and most delicious bakery products since 1995. Quality and taste are our top priorities.
          </p>
          <div className="rasi-social-links">
            <a href="https://www.instagram.com/rajagiri_rasi_bakery?igsh=MXN2ZzRuejZka3Zpbg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://youtube.com/@rajagirirasibakery7408?si=lfUV7Ezmp0PUVD_j" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="rasi-footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* USEFUL LINKS */}
        <div className="rasi-footer-section">
          <h3>Useful Links</h3>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div className="rasi-footer-section">
          <h3>Contact Us</h3>
          <div className="rasi-contact-info">
            <div className="contact-item">
              <MapPin size={18} className="contact-icon" /> 
              <span>Madarasa Street, Rajagiri, Thanjavur, TN 614207</span>
            </div>
            <div className="contact-item">
              <Phone size={18} className="contact-icon" /> 
              <a href="tel:+919443476738">+91 94434 76738</a>
            </div>
            <div className="contact-item">
              <Mail size={18} className="contact-icon" /> 
              <a href="mailto:rajagirirasibakery@gmail.com">rajagirirasibakery@gmail.com</a>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER BOTTOM CREDITS */}
      <div className="rasi-footer-bottom">
        <div className="rasi-footer-copyright-layer">
          <p>&copy; 2026 Rasi Bakery. All Rights Reserved.</p>
        </div>
        <div className="rasi-footer-dev-layer">
          <p>
            Developed by <a href="https://www.sdlcreativegroups.com/" target="_blank" rel="noopener noreferrer">SDL CREATIVE GROUPS - TECHNOLOGY & BUSINESS SOLUTIONS</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
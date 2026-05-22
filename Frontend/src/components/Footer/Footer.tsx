import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail 
} from 'lucide-react';
import Logo from '../Logo/Logo';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="rasi-footer">
      <div className="rasi-footer-container">
        <div className="rasi-footer-section">
          <Link to="/" className="rasi-footer-logo">
            <Logo />
          </Link>
          <p className="rasi-footer-desc">
            Serving the freshest and most delicious bakery products since 1995. Quality and taste are our top priorities.
          </p>
          <div className="rasi-social-links">
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" aria-label="Youtube"><Youtube size={20} /></a>
          </div>
        </div>

        <div className="rasi-footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div className="rasi-footer-section">
          <h3>Categories</h3>
          <ul>
            <li><Link to="/products?category=cakes">Cakes</Link></li>
            <li><Link to="/products?category=breads">Breads</Link></li>
            <li><Link to="/products?category=pastries">Pastries</Link></li>
            <li><Link to="/products?category=snacks">Snacks</Link></li>
          </ul>
        </div>

        <div className="rasi-footer-section">
          <h3>Contact Us</h3>
          <div className="rasi-contact-info">
            <p><MapPin size={18} /> Madarasa Street, Rajagiri, Thanjavur, TN 614207</p>
            <p><Phone size={18} /> +91-9443476738</p>
            <p><Mail size={18} /> rajagirirasibakery@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="rasi-footer-bottom">
        <div className="rasi-footer-copyright-layer">
          <p>&copy; 2026 Rasi Bakery. All Rights Reserved.</p>
        </div>
        <div className="rasi-footer-dev-layer">
          <p>
            Developed by <a href="https://www.sdlcreativegroups.com/" target="_blank" rel="noopener noreferrer">SDL Creative Groups – Software Solutions</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

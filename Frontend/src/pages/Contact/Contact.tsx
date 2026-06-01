import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './Contact.css';
import SEO from '@/src/components/SEO';

const Contact: React.FC = () => {
  return (
    <>
   <SEO
  title="Contact Rajagiri Rasi Bakery"
  description="Get in touch with Rajagiri Rasi Bakery for orders, custom cakes, enquiries and bakery services in Rajagiri, Thanjavur."
  keywords="contact rajagiri bakery, bakery phone number, custom cake orders, bakery enquiry"
  url="https://www.rajagirirasibakery.com/contact"
/>
    <div className="rasi-contact-page">
      <div className="rasi-contact-hero">
        <motion.div 
          className="rasi-container"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Contact Us</h1>
          <p>We'd love to hear from you! Get in touch with us for any enquiries or special orders.</p>
        </motion.div>
      </div>

      <div className="rasi-container rasi-contact-content">
        <div className="rasi-contact-info-grid">
          <motion.div 
            className="rasi-contact-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rasi-card-icon"><MapPin size={24} /></div>
            <div className="rasi-card-details">
              <h3>Our Office Address</h3>
              <p>Madarasa Street, Rajagiri, Rajaghiri, Thanjavur, Tamil Nadu 614207</p>
            </div>
          </motion.div>

          <motion.div 
            className="rasi-contact-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rasi-card-icon"><Mail size={24} /></div>
            <div className="rasi-card-details">
              <h3>General Enquiries</h3>
              <p><a href="mailto:rajagirirasibakery@gmail.com">rajagirirasibakery@gmail.com</a></p>
            </div>
          </motion.div>

          <motion.div 
            className="rasi-contact-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="rasi-card-icon"><Phone size={24} /></div>
            <div className="rasi-card-details">
              <h3>Call Us</h3>
              <p><a href="tel:+919443476738">+91-9443476738</a></p>
              <p><a href="tel:+919443525177">+91-9443525177</a> | <a href="tel:04374250634">04374-250634</a></p>
              <p><a href="tel:04374250734">04374-250734</a></p>
            </div>
          </motion.div>

          <motion.div 
            className="rasi-contact-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="rasi-card-icon"><Clock size={24} /></div>
            <div className="rasi-card-details">
              <h3>Our Timings</h3>
              <p><strong>Mon - Sat :</strong> 08:00 AM - 09:30 PM</p>
              <p><strong>Sun :</strong> 09:30 AM - 09:00 PM</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="rasi-map-section">
        <iframe 
          title="Rasi Bakery Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.123456789012!2d79.23456789012345!3d10.91234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5543210fedcba9%3A0x1234567890abcdef!2sMadarasa%20St%2C%20Rajagiri%2C%20Tamil%20Nadu%20614207!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
    </>
  );
};

export default Contact;

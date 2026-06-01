import React from 'react';
import { motion } from 'framer-motion';
import aboutHeroBg from '../img/about.png';
import './About.css';
import SEO from '../../components/SEO';

const About: React.FC = () => {
  return (
    <>

    <SEO
  title="About Us | Rajagiri Rasi Bakery"
  description="Learn about Rajagiri Rasi Bakery and our tradition of baking fresh cakes, breads and sweets."
  keywords="About Rajagiri Bakery, Bakery History, Rajagiri Bakery"
/>


    <div className="rasi-about-page">
      
      {/* 2. Apply the imported image via inline style */}
      <section 
        className="rasi-about-hero" 
        style={{ backgroundImage: `url(${aboutHeroBg})` }}
      >
        {/* Dark overlay to keep text legible */}
        <div className="rasi-about-hero-overlay"></div>
        
        <div className="rasi-about-hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About Rasi Bakery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            A tradition of taste and quality since 1995
          </motion.p>
        </div>
      </section>

      <div className="rasi-about-container">
        <section className="rasi-zigzag-about">
          <div className="rasi-zigzag-row">
            <div className="rasi-zigzag-image">
              <img src="https://i.pinimg.com/736x/8a/b7/b2/8ab7b2b989ad22d755e9d19a1a6cf10f.jpg" alt="Our Kitchen" referrerPolicy="no-referrer" />
            </div>
            <div className="rasi-zigzag-content">
              <h2>Our Humble Beginnings</h2>
              <p>Rasi Bakery started as a small family-owned shop with a single oven and a passion for baking. Our founder believed that everyone deserves access to fresh, high-quality bakery products made with love.</p>
            </div>
          </div>

          <div className="rasi-zigzag-row reverse">
            <div className="rasi-zigzag-image">
              <img src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600" alt="Our Quality" referrerPolicy="no-referrer" />
            </div>
            <div className="rasi-zigzag-content">
              <h2>Commitment to Quality</h2>
              <p>We never compromise on the quality of our ingredients. From premium flour to the freshest fruits, every component is carefully selected to ensure the best taste and nutrition for our customers.</p>
            </div>
          </div>

          <div className="rasi-zigzag-row">
            <div className="rasi-zigzag-image">
              <img src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600" alt="Our Team" referrerPolicy="no-referrer" />
            </div>
            <div className="rasi-zigzag-content">
              <h2>Our Talented Team</h2>
              <p>Our bakers are artists who bring years of experience and creativity to the table. Whether it's a complex custom cake or a simple loaf of bread, they put their heart into everything they create.</p>
            </div>
          </div>
        </section>

        <section className="rasi-stats-section">
          <div className="rasi-stat-item">
            <h3>30+</h3>
            <p>Years of Experience</p>
          </div>
          <div className="rasi-stat-item">
            <h3>50k+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="rasi-stat-item">
            <h3>200+</h3>
            <p>Products</p>
          </div>
          <div className="rasi-stat-item">
            <h3>10+</h3>
            <p>Outlets</p>
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default About;
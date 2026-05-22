import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="rasi-about-page">
      <section className="rasi-about-hero">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          About Rasi Bakery
        </motion.h1>
        <p>A tradition of taste and quality since 1995</p>
      </section>

      <div className="rasi-about-container">
        <section className="rasi-zigzag-about">
          <div className="rasi-zigzag-row">
            <div className="rasi-zigzag-image">
              <img src="https://i.pinimg.com/736x/8a/b7/b2/8ab7b2b989ad22d755e9d19a1a6cf10f.jpg" alt="Our Kitchen" referrerPolicy="no-referrer" />
            </div>
            <div className="rasi-zigzag-content">
              <h2>Our Humble Beginnings</h2>
              <p>Rasi Bakery started as a small family-owned shop with a single oven and a passion for baking. Our founder, Mr. Rasi, believed that everyone deserves access to fresh, high-quality bakery products made with love.</p>
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
            <h3>28+</h3>
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
  );
};

export default About;

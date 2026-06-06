// import React from 'react';
// import { motion } from 'framer-motion';
// import aboutHeroBg from '../img/about.png';
// import './About.css';
// import SEO from '../../components/SEO';

// const About: React.FC = () => {
//   return (
//     <>

//     <SEO
//   title="About Us | Rajagiri Rasi Bakery"
//   description="Learn about Rajagiri Rasi Bakery and our tradition of baking fresh cakes, breads and sweets."
//   keywords="About Rajagiri Bakery, Bakery History, Rajagiri Bakery"
// />


//     <div className="rasi-about-page">
      
//       {/* 2. Apply the imported image via inline style */}
//       <section 
//         className="rasi-about-hero" 
//         style={{ backgroundImage: `url(${aboutHeroBg})` }}
//       >
//         {/* Dark overlay to keep text legible */}
//         <div className="rasi-about-hero-overlay"></div>
        
//         <div className="rasi-about-hero-content">
//           <motion.h1
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             About Rasi Bakery
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//           >
//             A tradition of taste and quality since 1995
//           </motion.p>
//         </div>
//       </section>

//       <div className="rasi-about-container">
//         <section className="rasi-zigzag-about">
//           <div className="rasi-zigzag-row">
//             <div className="rasi-zigzag-image">
//               <img src="https://i.pinimg.com/736x/8a/b7/b2/8ab7b2b989ad22d755e9d19a1a6cf10f.jpg" alt="Our Kitchen" referrerPolicy="no-referrer" />
//             </div>
//             <div className="rasi-zigzag-content">
//               <h2>Our Humble Beginnings</h2>
//               <p>Rasi Bakery started as a small family-owned shop with a single oven and a passion for baking. Our founder believed that everyone deserves access to fresh, high-quality bakery products made with love.</p>
//             </div>
//           </div>

//           <div className="rasi-zigzag-row reverse">
//             <div className="rasi-zigzag-image">
//               <img src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600" alt="Our Quality" referrerPolicy="no-referrer" />
//             </div>
//             <div className="rasi-zigzag-content">
//               <h2>Commitment to Quality</h2>
//               <p>We never compromise on the quality of our ingredients. From premium flour to the freshest fruits, every component is carefully selected to ensure the best taste and nutrition for our customers.</p>
//             </div>
//           </div>

//           <div className="rasi-zigzag-row">
//             <div className="rasi-zigzag-image">
//               <img src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600" alt="Our Team" referrerPolicy="no-referrer" />
//             </div>
//             <div className="rasi-zigzag-content">
//               <h2>Our Talented Team</h2>
//               <p>Our bakers are artists who bring years of experience and creativity to the table. Whether it's a complex custom cake or a simple loaf of bread, they put their heart into everything they create.</p>
//             </div>
//           </div>
//         </section>

//         <section className="rasi-stats-section">
//           <div className="rasi-stat-item">
//             <h3>30+</h3>
//             <p>Years of Experience</p>
//           </div>
//           <div className="rasi-stat-item">
//             <h3>50k+</h3>
//             <p>Happy Customers</p>
//           </div>
//           <div className="rasi-stat-item">
//             <h3>200+</h3>
//             <p>Products</p>
//           </div>
//           <div className="rasi-stat-item">
//             <h3>10+</h3>
//             <p>Outlets</p>
//           </div>
//         </section>
//       </div>
//     </div>
//     </>
//   );
// };

// export default About;


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import aboutHeroBg from '../img/about.png';
import './About.css';
import SEO from '../../components/SEO';

const About: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <>
      <SEO
        title="About Us | Rajagiri Rasi Bakery"
        description="Learn about Rajagiri Rasi Bakery and our tradition of baking fresh cakes, breads and sweets since 1995."
        keywords="About Rajagiri Bakery, Bakery History, Rajagiri Bakery, Fresh Baked Goods"
      />

      <div className="rasi-about-page">
        {/* Hero Section */}
        <section
          className="rasi-about-hero"
          style={{ backgroundImage: `url(${aboutHeroBg})` }}
          role="region"
          aria-label="About Rasi Bakery hero section"
        >
          <div className="rasi-about-hero-overlay"></div>

          <motion.div
            className="rasi-about-hero-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>About Rasi Bakery</h1>
            <p>A tradition of taste and quality since 1995</p>
          </motion.div>
        </section>

        {/* Main Content Container */}
        <div className="rasi-about-container">
          {/* Zigzag Content Section */}
          <motion.section
            className="rasi-zigzag-about"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Section 1: Humble Beginnings */}
            <motion.div className="rasi-zigzag-row">
              <motion.div
                className="rasi-zigzag-image"
                // variants={imageVariants}
              >
                <img
                  src="https://i.pinimg.com/736x/8a/b7/b2/8ab7b2b989ad22d755e9d19a1a6cf10f.jpg"
                  alt="Our Kitchen - Fresh baking in progress"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="rasi-zigzag-content">
                <h2>Our Humble Beginnings</h2>
                <p>
                  Rasi Bakery started as a small family-owned shop with a single
                  oven and a passion for baking. Our founder believed that
                  everyone deserves access to fresh, high-quality bakery
                  products made with love and care.
                </p>
              </div>
            </motion.div>

            {/* Section 2: Commitment to Quality */}
            <motion.div className="rasi-zigzag-row reverse" >
              <motion.div
                className="rasi-zigzag-image"
           
              >
                <img
                  src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600"
                  alt="Premium quality ingredients used in our bakery"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="rasi-zigzag-content">
                <h2>Commitment to Quality</h2>
                <p>
                  We never compromise on the quality of our ingredients. From
                  premium flour to the freshest fruits, every component is
                  carefully selected to ensure the best taste and nutrition for
                  our customers. Quality is our promise.
                </p>
              </div>
            </motion.div>

            {/* Section 3: Talented Team */}
            <motion.div className="rasi-zigzag-row" >
              <motion.div
                className="rasi-zigzag-image"
             
              >
                <img
                  src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600"
                  alt="Our skilled bakers creating delicious pastries"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="rasi-zigzag-content">
                <h2>Our Talented Team</h2>
                <p>
                  Our bakers are artists who bring years of experience and
                  creativity to the table. Whether it's a complex custom cake
                  or a simple loaf of bread, they put their heart into
                  everything they create with passion and precision.
                </p>
              </div>
            </motion.div>
          </motion.section>

          {/* Stats Section */}
          <motion.section
            className="rasi-stats-section"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            role="region"
            aria-label="Rasi Bakery achievements and statistics"
          >
            <motion.div className="rasi-stat-item">
              <h3 aria-label="30 plus years">30+</h3>
              <p>Years of Experience</p>
            </motion.div>

            <motion.div className="rasi-stat-item" >
              <h3 aria-label="50 thousand plus">50k+</h3>
              <p>Happy Customers</p>
            </motion.div>

            <motion.div className="rasi-stat-item" >
              <h3 aria-label="200 plus">200+</h3>
              <p>Products</p>
            </motion.div>

            <motion.div className="rasi-stat-item">
              <h3 aria-label="10 plus">10+</h3>
              <p>Outlets</p>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default About;
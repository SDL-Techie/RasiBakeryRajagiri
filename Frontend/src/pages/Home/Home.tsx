import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEO from '@/src/components/SEO';

// --- HeroSlider Component ---
const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1920',
      title: 'Delicious Custom Cakes',
      subtitle: 'Made with love for your special moments'
    },
    {
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1920',
      title: 'Freshly Baked Breads',
      subtitle: 'Straight from our oven to your table'
    },
    {
      image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&q=80&w=1920',
      title: 'Sweet Pastries & Snacks',
      subtitle: 'The perfect treat for any time of day'
    }
  ];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <>


    
    <div className="rasi-hero-slider">
  
      {slides.map((slide, index) => (
        <div key={index} className={`rasi-slide ${index === current ? 'active' : ''}`}>
          <img src={slide.image} alt={slide.title} referrerPolicy="no-referrer" />
          <div className="rasi-slide-content">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={index === current ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              {slide.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={index === current ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {slide.subtitle}
            </motion.p>
            {/* <motion.button
              className="rasi-btn-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={index === current ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={() => navigate('/categoryproduct/all')}
            >
              Order Now
            </motion.button> */}
          </div>
        </div>
      ))}
      <button className="rasi-slider-btn prev" onClick={() => setCurrent(current === 0 ? slides.length - 1 : current - 1)}>
        <ChevronLeft size={24} />
      </button>
      <button className="rasi-slider-btn next" onClick={() => setCurrent(current === slides.length - 1 ? 0 : current + 1)}>
        <ChevronRight size={24} />
      </button>
    </div>
  </>
);
};

// --- CategoryCards Component ---
const CategoryCards: React.FC<{ categories: any[] }> = ({ categories }) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; 
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  const scrollToSection = (categoryName: string) => {
  // Add the "section-" prefix to match your JSX IDs
  const sectionId = `section-${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
  const element = document.getElementById(sectionId);

  if (element) {
    // Get the header height if you have a sticky navbar (e.g., 80px)
    const headerOffset = 80; 
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  } else {
    console.warn(`Section with id #${sectionId} not found.`);
  }
};


  return (
    <section className="rasi-section rasi-categories-section">
      <div className="rasi-container">
        <div className="rasi-section-header">
          <h2>Shop by Category</h2>
          <p>Explore our wide range of bakery delights</p>
        </div>
        
        <div className="rasi-category-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button className="rasi-category-arrow left" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>

          <div className="rasi-categories-grid slider-container" ref={scrollRef}>
            {categories.map((cat, index) => (
              <motion.div 
                key={cat.id || index} 
                className="rasi-category-card"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                // onClick={() => navigate(`/categoryproduct/${cat.name?.toLowerCase()}`)}
                onClick={() => scrollToSection(cat.name)}
              >
                <div className="rasi-category-icon">
                  {cat.image ? <img src={cat.image} alt={cat.name} style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover'}} /> : '🥐'}
                </div>
                <h3>{cat.name}</h3>
                <span>Active</span>
              </motion.div>
            ))}
          </div>

          <button className="rasi-category-arrow right" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

// --- MarqueeSection Component ---
const MarqueeSection: React.FC = () => {
  const items1 = ["FRESHLY BAKED", "PREMIUM QUALITY", "100% EGGLESS", "TRADITIONAL RECIPES", "BEST IN THANJAVUR"];
  const items2 = ["CAKES", "BREADS", "BISCUITS", "PASTRIES", "SNACKS", "COMBOS"];
  const items3 = ["ORDER ONLINE", "FAST DELIVERY", "CUSTOM CAKES", "SPECIAL OCCASIONS", "VISIT RASI BAKERY"];

  return (
    <section className="rasi-marquee-section">
      <div className="rasi-marquee-layer rasi-marquee-primary">
        <motion.div className="rasi-marquee-content" animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          {[...items1, ...items1].map((item, i) => <span key={i}>{item} • </span>)}
        </motion.div>
      </div>
      <div className="rasi-marquee-layer rasi-marquee-highlight">
        <motion.div className="rasi-marquee-content" animate={{ x: [-1000, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
          {[...items2, ...items2].map((item, i) => <span key={i}>{item} • </span>)}
        </motion.div>
      </div>
      <div className="rasi-marquee-layer rasi-marquee-secondary">
        <motion.div className="rasi-marquee-content" animate={{ x: [0, -1000] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
          {[...items3, ...items3].map((item, i) => <span key={i}>{item} • </span>)}
        </motion.div>
      </div>
    </section>
  );
};

// --- CookieHighlightSection Component ---
const CookieHighlightSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="rasi-section rasi-cookie-highlight">
      <div className="rasi-container">
        <div className="rasi-cookie-highlight-container">
          <motion.div className="rasi-cookie-highlight-image" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="rasi-cookie-blob">
              <img src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600" alt="Signature Cookies" />
            </div>
            <div className="rasi-cookie-floating-chip chip-1">🍪</div>
            <div className="rasi-cookie-floating-chip chip-2">🍪</div>
          </motion.div>
          <motion.div className="rasi-cookie-highlight-content rasi-title-highlight" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="rasi-cookie-tag">Bestseller</span>
            <h2>Our Signature <span>Handmade Cookies</span></h2>
            <p className='homedesc'>Baked fresh every morning using premium butter and high-quality chocolate chips.</p>
            {/* <div className="rasi-cookie-features">
              <div className="rasi-cookie-feature"><span>🧈 Pure Butter</span></div>
              <div className="rasi-cookie-feature"><span>🍫 Dark Chocolate</span></div>
              <div className="rasi-cookie-feature"><span>🌿 No Preservatives</span></div>
            </div> */}
            <button className="rasi-cookie-shop-btn" onClick={() => navigate('/products')}>Shop Cookies Collection</button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Marquee: React.FC = () => {
  const items = ["Freshly Baked Daily", "100% Eggless Options", "Custom Cakes", "Traditional Recipes", "Quality Ingredients", "Best Bakery in Thanjavur"];
  return (
    <div className="rasi-banner-marquee">
      <div className="rasi-banner-marquee-content">
        {[...items, ...items].map((item, index) => (
          <div key={index} className="rasi-banner-marquee-item"><div className="rasi-banner-marquee-dot"></div>{item}</div>
        ))}
      </div>
    </div>
  );
};

// --- Main Home Component ---
const Home: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();
  // const userRole = localStorage.getItem('userRole');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'customer';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const catRes = await axios.get("http://localhost:4000/api/v1/category");
        if (catRes.data.success) {
          const activeCats = catRes.data.data
            .filter((c: any) => c.status === "Active")
            .map((c: any) => ({ ...c, id: c._id }));
          setCategories(catRes.data.data.map((c: any) => ({ ...c, id: c._id })));
        }

        // Fetch Products
  //       const prodRes = await axios.get("http://localhost:4000/api/v1/products");
  //       if (prodRes.data.success) {
  //         const mappedData = prodRes.data.data.map((p: any) => {
  //           // THE FIX: Extract 'name' from category object to avoid React Child Error
  //           const categoryNameStr = typeof p.category === 'object' ? p.category?.name : p.category;
            
  //           return {
  //             ...p,
  //             id: p._id,
  //             image: p.productimage,
  //             categoryName: categoryNameStr, // We'll use this for filtering
  //             category: categoryNameStr,     // We'll pass this as string to ProductCard
  //             // price: userRole === 'retailer' ? p.wholesaleprice : p.price
  //             displayPrice: userRole === 'retailer' ? p.wholesaleprice : p.price,
  //             isRetailer: userRole === 'retailer'
  //           };
  //         });
  //         setProducts(mappedData);
  //       }
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //     }
  //   };
  //   fetchData();
  // }, [userRole]);

  const prodRes = await axios.get("http://localhost:4000/api/v1/products");
        if (prodRes.data.success) {
          const mappedData = prodRes.data.data
            .filter((p: any) => p.status === "Active") // ✅ Only include Active products
            .map((p: any) => {
              const categoryNameStr = typeof p.category === 'object' ? p.category?.name : p.category;
              
              return {
                ...p,
                id: p._id,
                image: p.productimage,
                categoryName: categoryNameStr, 
                category: categoryNameStr,     
                displayPrice: userRole === 'retailer' ? p.wholesaleprice : p.price,
                isRetailer: userRole === 'retailer'
              };
            });
          setProducts(mappedData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [userRole]);

  const getProductsByCategory = (catName: string) => {
    // Filter using the string name we extracted during mapping
    return products.filter(p => p.categoryName?.toLowerCase() === catName?.toLowerCase());
  };

  return (
    <>
       <SEO
      title="Rajagiri Rasi Bakery | Fresh Cakes, Breads & Snacks in Thanjavur"
      description="Rajagiri Rasi Bakery offers fresh cakes, breads, pastries, cookies, sweets and bakery products in Rajagiri, Thanjavur. Order online for delicious homemade treats."
      keywords="Rajagiri Rasi Bakery, bakery in Thanjavur, cakes, pastries, breads, cookies, bakery products, birthday cakes, sweets, snacks"
      url="https://www.rajagirirasibakery.com/"
    />

    <div className="rasi-home-page">

      <HeroSlider />
      <Marquee />
      <CookieHighlightSection />
      
      <CategoryCards categories={categories} />
      
      {/* Featured Section */}
      <section id="section-featured" className="rasi-section rasi-featured-section">
        <div className="rasi-container">
          <div className="rasi-section-header rasi-title-highlight">
            <h2>Featured Products</h2>
            <button className="rasi-view-all" onClick={() => navigate('/products')}>View All</button>
          </div>
          <div className="rasi-products-grid">
            {products.slice(-4).reverse().map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Sections per category */}
      {categories.map((cat) => (
        <section key={cat.id} id={`section-${cat.name?.toLowerCase()}`} className="rasi-section rasi-category-products">
          <div className="rasi-container">
            <div className="rasi-section-header rasi-title-highlight">
              <h2>{cat.name}</h2>
              {/* <button 
                className="rasi-view-all" 
                onClick={() => navigate(`/categoryproduct/${cat.name?.toLowerCase()}`)}
              > */}

                <button 
                className="rasi-view-all" 
              //  onClick={()=>navigate("/categoryproduct")}
              onClick={() => navigate(`/categoryproduct/${cat.name?.toLowerCase()}`, { 
    state: { name: cat.name } 
  })}
              >
                Explore {cat.name}
              </button>
            </div>
            <div className="rasi-products-grid">
              {getProductsByCategory(cat.name).length > 0 ? (
                getProductsByCategory(cat.name).slice(-4).reverse().map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p>No products available in this category yet.</p>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* ZigZag and Contact Sections */}
      <section className="rasi-section rasi-zigzag-section">
        <div className="rasi-container">
          <div className="rasi-zigzag-row">
            <motion.div className="rasi-zigzag-image" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <img src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600" alt="Baking Process" />
              <div className="rasi-zigzag-image-decoration">🥖</div>
            </motion.div>
            <motion.div className="rasi-zigzag-content rasi-title-highlight" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="rasi-zigzag-badge">Quality First</span>
              <h2>Baked with Fresh Ingredients</h2>
              <p>We use only the finest ingredients to ensure every bite is a celebration of flavor.</p>
              <button className="rasi-btn-outline">Learn More <ArrowRight size={18} /></button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="rasi-home-contact-full">
        <div className="rasi-home-contact-overlay"></div>
        <div className="rasi-container">
          <div className="rasi-section-header rasi-contact-header-white">
            <h2>Get in Touch</h2>
            <p>Visit us in Thanjavur or reach out for special orders.</p>
          </div>
          <div className="rasi-home-contact-info-centered">
            <div className="rasi-contact-item-dark"><MapPin size={20} /> <p>Madarasa Street, Rajagiri, Thanjavur</p></div>
            <div className="rasi-contact-item-dark"><Phone size={20} /> <p>+91-9443476738</p></div>
            <div className="rasi-contact-item-dark"><Mail size={20} /> <p>rajagirirasibakery@gmail.com</p></div>
          </div>
        </div>
      </section>
      <MarqueeSection />
    </div>
    </>
    
  );
};

export default Home;
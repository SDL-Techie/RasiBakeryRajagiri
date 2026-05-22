import React, { useState, useEffect } from 'react';
import { 
  FaTachometerAlt, FaPlusCircle, FaList, FaBoxOpen, FaThList, 
  FaShoppingCart, FaUsers, FaSignOutAlt, FaBars, FaSearch, 
  FaMoon, FaSun, FaTimes, FaUserTie, FaMapMarkerAlt, FaCoins 
} from 'react-icons/fa';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminLayout.css';

const AdminSidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin/dashboard' },
    { name: 'Add Category', icon: <FaPlusCircle />, path: '/admin/add-category' },
    { name: 'Category Details', icon: <FaThList />, path: '/admin/categories' },
    { name: 'Add Product', icon: <FaBoxOpen />, path: '/admin/add-product' },
    { name: 'Product Details', icon: <FaList />, path: '/admin/products' },
    { name: 'Orders', icon: <FaShoppingCart />, path: '/admin/orders' },
    { name: 'Retailer Orders', icon: <FaShoppingCart />, path: '/admin/retailerorder' },
    { name: 'Fast Orders', icon: <FaShoppingCart />, path: '/admin/fastorder' },
    { name: 'Users', icon: <FaUsers />, path: '/admin/users' },
    { name: 'Retailer', icon: <FaUserTie />, path: '/admin/retailer' },
    { name: 'Pincode', icon: <FaMapMarkerAlt />, path: '/admin/pincode' },
    { name: 'Point', icon: <FaCoins />, path: '/admin/point' },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && window.innerWidth <= 1024 && (
          <motion.div 
            className="rasi-sidebar-overlay" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div 
        className={`rasi-admin-sidebar ${isOpen ? 'open' : 'closed'}`}
        variants={sidebarVariants}
        animate={isOpen || window.innerWidth > 1024 ? 'open' : 'closed'}
      >
        <div className="rasi-admin-sidebar-header">
          <div className="admin-logo-box">
             <div className="logo-dot"></div>
             <h2>RASI ADMIN</h2>
          </div>
          <button className="rasi-sidebar-close-btn mobile-only" onClick={onClose}>
            {/* <FaTimes />  */}
            <span className="rasi-x">X</span>
          </button>
        </div>

        <nav className="rasi-admin-menu-container">
          <ul className="rasi-admin-menu">
            {menuItems.map((item, index) => (
              <li key={index} className={location.pathname === item.path ? 'active' : ''}>
                <Link to={item.path} onClick={() => window.innerWidth <= 1024 && onClose()}>
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-text">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="rasi-sidebar-footer">
          <button onClick={onLogout} className="rasi-logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

const AdminLayout = ({ theme, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className={`rasi-admin-layout ${theme}`}>
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onLogout={handleLogout} 
      />
      
      <main className={`rasi-admin-main ${!isSidebarOpen ? 'expanded' : ''}`}>
        <header className="rasi-admin-header">
          <div className="header-left-group">
            <button className="rasi-sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </button>
            <div className="header-search-box desktop-only">
              <FaSearch />
              <input type="text" placeholder="Quick search..." />
            </div>
          </div>
          
          <div className="header-right-group">
            {/* <button className="admin-icon-action" onClick={toggleTheme}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button> */}
            <div className="admin-profile-pill">
              <img src="https://i.pinimg.com/736x/ee/bb/ac/eebbac6e5bd39517d6a7043ca623c57e.jpg" alt="Admin" />
              <div className="admin-info desktop-only">
                <span className="admin-name">RRR</span>
                <span className="admin-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <section className="rasi-admin-content-wrapper">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
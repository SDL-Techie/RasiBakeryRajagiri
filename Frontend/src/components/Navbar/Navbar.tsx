import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, User, Menu, X, 
  LayoutDashboard, UserCircle, Package, Heart, 
  Download, ChevronDown, Phone, Mail, Coins, ChevronLeft, ChevronRight, LogOut 
} from 'lucide-react';
import Logo from '../Logo/Logo';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import './Navbar.css';
import axios from 'axios';

// Firestore imports
import { db } from '../../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface NavbarProps {
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // Controlled visibility state
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [userPoints, setUserPoints] = useState(0); 
  const [categories, setCategories] = useState<any[]>([]); 
  
  const navigate = useNavigate();
  const { customer, isLoggedIn, logout } = useCustomerAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for detecting external clicks

  // Admin and Role Logic
  const isAdmin = isLoggedIn && customer?.mobile === "9444292269"; 
  const isRetailer = isLoggedIn && customer?.role?.toLowerCase() === 'retailer';
  const [cocopoint, setcocopoint] = useState("");

  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/category");
        if (response.data.success) {
          setCategories(response.data.data);
        }

        const customerphone = localStorage.getItem('userPhone');

        if (isLoggedIn && customer) {
          if (!isRetailer) {
            const pointsRes = await axios.get(`http://localhost:4000/api/v1/getuserpoints/${customerphone}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
            setcocopoint(pointsRes.data.currentPoints);
            setUserPoints(pointsRes.data.currentPoints);
            // if (pointsRes.data.success) {
            //   setUserPoints(pointsRes.data.currentPoints);
            // }
          }

          const ordersQ = query(collection(db, 'orders'), where('customerId', '==', customer.id));
          const ordersSnap = await getDocs(ordersQ);
          setOrdersCount(ordersSnap.size);

          const wishQ = query(collection(db, 'wishlist'), where('customerId', '==', customer.id));
          const wishSnap = await getDocs(wishQ);
          setWishlistCount(wishSnap.size);
        } else {
          const savedWishlist = localStorage.getItem('rasi_wishlist');
          if (savedWishlist) setWishlistCount(JSON.parse(savedWishlist).length);
        }
      } catch (err) {
        console.error('Navbar fetch error:', err);
      }
    };

    fetchNavbarData();
  }, [isLoggedIn, customer, isRetailer]);

  // Listener to close desktop dropdown if clicked anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // const handleLogout = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:4000/api/v1/logout");
      
  //     if (res.data.success) {
  //       logout(); 
  //       localStorage.removeItem('userPhone');
  //       localStorage.removeItem('customerMobile');
  //       localStorage.removeItem('userName');
  //       localStorage.removeItem('userRole');
  //       localStorage.removeItem('token');

  //       navigate('/login');
  //       closeMenu();
  //       setIsUserDropdownOpen(false);
  //       toast.success("Logged out successfully");
  //     }
  //   } catch (err) {
  //     console.error("Logout failed:", err);
  //     toast.error("Something went wrong during logout");
  //   }
  // };


const handleLogout = async () => {
  try {
    const res = await axios.get("http://localhost:4000/api/v1/logout");
    
    if (res.data.success) {
      logout(); // This calls your context logout which handles everything
      setIsUserDropdownOpen(false);
      closeMenu();
      navigate('/login');
      toast.success("Logged out successfully");
  
    }
  } catch (err) {
    console.error("Logout failed:", err);
    toast.error("Something went wrong during logout");
  }
};

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setIsMenuOpen(false);
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="rasi-navbar">
      {/* Topbar */}
      <div className="rasi-topbar">
        <div className="rasi-topbar-container">
          <div className="rasi-topbar-left">
            <span><Phone size={14} /> +91-9443476738</span>
            <span><Mail size={14} /> rajagirirasibakery@gmail.com</span>
          </div>
          <div className="rasi-topbar-right">
            {isLoggedIn && !isRetailer && (
              <div className="rasi-topbar-points">
                <Coins size={14} color="#d4a373" />
                <Link to="/coupon-user"><span>{cocopoint} Points</span></Link> 
              </div>
            )}
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="rasi-marquee">
        <div className="rasi-marquee-content">
          ✨ Special Offer: Get 20% OFF on all Custom Cakes! | Freshly baked breads available daily. 🍞 
        </div>
      </div>

      {/* Main Navbar */}
      <div className="rasi-navbar-container">
        <div className="rasi-navbar-left">
          <Link to="/" className="rasi-logo"><Logo /></Link>
        </div>

        <div className="rasi-navbar-center">
          <form className="rasi-search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search for cakes, breads, snacks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><Search size={18} /></button>
          </form>
        </div>

        <div className="rasi-navbar-right">
          {isRetailer && (
            <button className="retailerorder-btn">
                <Link to={"/retailerorder"}>Fast Order</Link>
            </button>
          )}

          {/* Separate Container Hooked into outside-click detection */}
          <div className="rasi-nav-dropdown desktop-only" ref={dropdownRef}>
            <button 
              type="button" 
              className="rasi-nav-link rasi-login-btn"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <User size={20} /> 
              <span>{isLoggedIn && customer ? customer.name : 'Login'}</span> 
              <ChevronDown size={14} className={`rasi-chevron ${isUserDropdownOpen ? 'rotated' : ''}`} />
            </button>

            {/* Click-to-toggle Dropdown Content Window */}
            {isUserDropdownOpen && (
              <div className="rasi-dropdown-content" onClick={() => setIsUserDropdownOpen(false)}>
                {!isLoggedIn && (
                  <div className="rasi-dropdown-header">
                    <span>New customer?</span>
                    <Link to="/register" className="rasi-signup-link">Sign Up</Link>
                  </div>
                )}

                {isLoggedIn && !isRetailer && (
                  <Link to="" className="rasi-dropdown-points-card">
                     <div className="points-label">Your Rewards</div>
                     <div className="points-value" ><Coins size={16} color='#a0522d'/> {cocopoint} Pts</div>
                  </Link>
                )}

                <div className="rasi-dropdown-divider"></div>
                
                <Link to="/profile" className="rasi-dropdown-item-with-badge">
                  <div className="rasi-item-label"><UserCircle size={18} color='#a0522d' />  Profile</div>
                </Link>

                <Link to="/orders" className="rasi-dropdown-item-with-badge">
                  <div className="rasi-item-label"><Package size={18} color='#a0522d' /> Orders</div>
                  {ordersCount > 0 && <span className="rasi-dropdown-badge">{ordersCount}</span>}
                </Link>
                
                <Link to="/wishlist" className="rasi-dropdown-item-with-badge">
                  <div className="rasi-item-label"><Heart size={18} color='#a0522d' /> Wishlist</div>
                  {wishlistCount > 0 && <span className="rasi-dropdown-badge">{wishlistCount}</span>}
                </Link>

                <a
                  href="javascript:void(0)"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new Event('triggerPwaInstall'));
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                >
                  <Download size={18} color='#a0522d' /> Download App
                </a>

                {isAdmin && (
                  <>
                    <div className="rasi-dropdown-divider"></div>
                    <Link to="/admin/dashboard" className="admin-link-highlight">
                      <LayoutDashboard size={18} /> Admin Dashboard
                    </Link>
                  </>
                )}

                {isLoggedIn && (
                  <>
                    <div className="rasi-dropdown-divider"></div>
                    <button onClick={handleLogout} className="rasi-dropdown-logout-btn" style={{width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer'}}>
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="rasi-nav-link rasi-cart-link desktop-only">
            <div className="rasi-cart-icon-wrapper">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="rasi-cart-badge">{cartCount}</span>}
            </div>
            <span>Cart</span>
          </Link>

          <button className="rasi-mobile-menu-btn" onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Category Slider */}
      <div className="rasi-category-nav">
        <div className="category-slider-wrapper">
          <button className="slider-arrow left" onClick={() => scrollCategories('left')}><ChevronLeft size={18}/></button>
          <div className="rasi-category-container" ref={scrollRef}>
            <Link to="/">Home</Link>
            {categories.map((cat) => (
              <Link key={cat._id} to={`/categoryproduct/${encodeURIComponent(cat.name)}`}>
                {cat.name}
              </Link>
            ))}
          </div>
          <button className="slider-arrow right" onClick={() => scrollCategories('right')}><ChevronRight size={18}/></button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`rasi-mobile-sidebar-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
      <div className={`rasi-mobile-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="rasi-sidebar-header">
          <Link to="/" className="rasi-logo" onClick={closeMenu}><Logo /></Link>
          <button className="rasi-close-sidebar" onClick={closeMenu}><X size={24} /></button>
        </div>

        {isLoggedIn && !isRetailer && (
          <div className="rasi-mobile-points-banner">
            <div className="banner-text">
              <Coins size={18} />
              <span>Points: <strong>{userPoints}</strong></span>
            </div>
            <Link to={"/coupon-user"} onClick={closeMenu} className="redeem-btn">Redeem</Link>
          </div>
        )}

        <div className="rasi-sidebar-menu">
          <div className="rasi-sidebar-section">
            <h3>Menu</h3>
            <Link to="/" onClick={closeMenu}>Home</Link>
            <Link to="/products" onClick={closeMenu}>All Products</Link>
            {isAdmin && <Link to="/admin/dashboard" onClick={closeMenu} style={{color: 'var(--coffee)', fontWeight: 'bold'}}>Admin Dashboard</Link>}
            {isRetailer && <Link to="/retailerorder" onClick={closeMenu}>Fast Order</Link>}

            <a
              href="javascript:void(0)"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new Event('triggerPwaInstall'));
                closeMenu();
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <Download size={18} /> Download App
            </a>
          </div>

          <div className="rasi-sidebar-section">
            <h3>Account</h3>
            {!isLoggedIn ? (
               <Link to="/login" onClick={closeMenu}><User size={18} /> Login / Register</Link>
            ) : (
               <Link to="/profile" onClick={closeMenu}><User size={18} /> {customer?.name}</Link>
            )}
            <Link to="/cart" onClick={closeMenu}><ShoppingCart size={18} /> My Cart </Link>
            <Link to="/wishlist" onClick={closeMenu}><Heart size={18} /> My Wishlist </Link>
            {isLoggedIn && <Link to="/orders" onClick={closeMenu}><Package size={18} /> My Orders </Link>}
            
            {isLoggedIn && (
              <button onClick={handleLogout} className="rasi-mobile-logout-link" style={{display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 0', color: '#e74c3c', background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', borderTop: '1px solid #eee', marginTop: '10px'}}>
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>

          <div className="rasi-sidebar-section">
            <h3>Categories</h3>
            {categories.map((cat) => (
              <Link key={cat._id} to={`/categoryproduct/${encodeURIComponent(cat.name)}`} onClick={closeMenu}>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
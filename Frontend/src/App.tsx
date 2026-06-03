import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, NavLink } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import Navbar from './components/Navbar/Navbar';
import Toast from './components/Toast/Toast';
import Footer from './components/Footer/Footer';
import PWAInstall from './components/PWAInstall/PWAInstall';
import CookieConsent from './components/CookieConsent/CookieConsent';
import AdminLayout from './admin/AdminLayout/AdminLayout';
import './App.css';
import Retailer from './admin/Retailer/Retailer';
import CategoryProduct from './pages/Categoryproducts/CategoryProduct';
import Pincode from './admin/Pincode/Pincode';
import Point from './admin/PointManagement/Point';
import Retailerlogin from './pages/Retailerlogin/Retailerlogin';
import Retailerorder from './pages/Retailerorder/Retailerorder';
import Retailerorderadmin from './admin/Retailerorder/Retailerorderadmin';
import Fastorder from './admin/Fastorder/Fastorder';
import Userpoint from './pages/Userpoints/Userpoint'; 
import AdminProtectedRoute from "./components/AdminProtectedRoute"; 
import Coupon from './pages/Coupon/Coupon';
import NotFound from './components/NotFound';
import BackupRestore from './admin/BackupRestore/BackupRestore';

// Lazy load pages
const Home = lazy(() => import('./pages/Home/Home'));
const Products = lazy(() => import('./pages/Products/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const About = lazy(() => import('./pages/About/About'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms/Terms'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const Orders = lazy(() => import('./pages/Orders/Orders'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'));

// Admin Pages
const AdminDashboard = lazy(() => import('./admin/Dashboard/Dashboard'));
const AddCategory = lazy(() => import('./admin/AddCategory/AddCategory'));
const CategoryDetails = lazy(() => import('./admin/CategoryDetails/CategoryDetails'));
const AddProduct = lazy(() => import('./admin/AddProduct/AddProduct'));
const AdminProductDetails = lazy(() => import('./admin/ProductDetails/ProductDetails'));
const AdminOrders = lazy(() => import('./admin/Orders/Orders'));
const Users = lazy(() => import('./admin/Users/Users'));

const Loading = () => (
  <div className="rasi-loading-screen">
    <div className="rasi-spinner"></div>
    <p>Baking something delicious...</p>
  </div>
);

const AppContent: React.FC = () => {
  const { cartCount, toast, hideToast } = useCart();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="rasi-app">
      {!isAdmin && <Navbar cartCount={cartCount} />}
      <PWAInstall />
      <Toast show={toast.show} message={toast.message} onClose={hideToast} />
      
      <main className={isAdmin ? "" : "rasi-main-content"}>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            {/* Public Route Fix: Adjusted path from "/products" to follow standard naming structure if needed */}
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/retailerlogin" element={<Retailerlogin />} />
            <Route path="/retailerorder" element={<Retailerorder />} />
            <Route path="/coupon-user-points" element={<Userpoint/>} />
            <Route path="/categoryproduct/:categoryname" element={<CategoryProduct />} />
            <Route path="/coupon-user" element={<Coupon/>}/>
            
            {/* Admin Routes wrapped in AdminProtectedRoute Layout wrapper */}
            <Route element={<AdminProtectedRoute />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="add-category" element={<AddCategory />} />
                <Route path="categories" element={<CategoryDetails />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="products" element={<AdminProductDetails />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<Users />} />
                <Route path="retailer" element={<Retailer />} />
                <Route path="pincode" element={<Pincode />} />
                <Route path="point" element={<Point />} />
                <Route path="retailerorder" element={<Retailerorderadmin />} />
                <Route path="fastorder" element={<Fastorder />} />
                <Route path="backup" element={<BackupRestore/>}/>
              </Route>
            </Route>

            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </Suspense>
      </main>
      
      {showBackToTop && (
        <button className="rasi-back-to-top" onClick={scrollToTop} aria-label="Back to top">
          <ArrowUp size={24} />
        </button>
      )}

      {!isAdmin && (
        <>
          <div className="rasi-mobile-bottom-nav">
            <NavLink to="/" className={({ isActive }) => `rasi-bottom-nav-item ${isActive ? 'active' : ''}`}>🏠<span>Home</span></NavLink>
            <NavLink to="/products" className={({ isActive }) => `rasi-bottom-nav-item ${isActive ? 'active' : ''}`}>🍰<span>Desert</span></NavLink>
            <NavLink to="/cart" className={({ isActive }) => `rasi-bottom-nav-item ${isActive ? 'active' : ''}`}>🛒<span>Cart</span></NavLink>
            <NavLink to="/orders" className={({ isActive }) => `rasi-bottom-nav-item ${isActive ? 'active' : ''}`}>📦<span>Orders</span></NavLink>
            <NavLink to="/profile" className={({ isActive }) => `rasi-bottom-nav-item ${isActive ? 'active' : ''}`}>👤<span>Account</span></NavLink>
          </div>
          <CookieConsent />
          <Footer />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <CustomerAuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </CustomerAuthProvider>
    </Router>
  );
}

// Register Service Worker for PWA installation support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('PWA Service Worker Active:', reg.scope))
      .catch((err) => console.error('PWA Service Worker Error:', err));
  });
}

export default App;
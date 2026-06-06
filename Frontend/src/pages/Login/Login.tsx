import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
// import { Eye, EyeOff } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './Login.css';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ phoneno: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useCustomerAuth();

  // Handle registration success message from URL
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast.success('Registration successful! Please login.');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const loginToast = toast.loading('Verifying credentials...');
  //   try {
  //     // ✅ UNIFIED LOGIN: Every user (Admin/Retailer/Customer) routes through the backend database
  //     const response = await axios.post('http://localhost:4000/api/v1/login', {
  //       phoneno: formData.phoneno,
  //       password: formData.password
  //     });

  //     if (response.data.success) {
  //       const userData = response.data.user;
  //       const token = response.data.token;
        
  //       // Store session data securely in LocalStorage
  //       localStorage.setItem('token', token);
  //       localStorage.setItem('userPhone', userData.phoneno);
  //       localStorage.setItem('userName', userData.name);
  //       localStorage.setItem('userRole', userData.role || 'customer');

  //       // Extra flag checks for the admin layout state configurations
  //       if (userData.role === 'admin') {
  //         localStorage.setItem('isAdminLoggedIn', 'true');
  //         localStorage.setItem('adminRole', 'admin');
  //       } else {
  //         // Clear any stale admin tracking if a customer logs in
  //         localStorage.removeItem('isAdminLoggedIn');
  //         localStorage.removeItem('adminRole');
  //       }

  //       // Synchronize Global Context State Provider parameters
  //       login({
  //         id: userData._id,
  //         name: userData.name,
  //         mobile: userData.phoneno,
  //         address: userData.addresses || [],
  //         role: userData.role,
  //       }, token);

  //       toast.success(`Welcome back, ${userData.name}!`, { id: loginToast });
        
  //       // 🔥 Dynamic layout redirection engine based directly on secure database value
  //       setTimeout(() => {
  //         if (userData.role === 'admin') {
  //           navigate('/admin/dashboard');
  //         } else {
  //           navigate('/');
  //         }
  //       }, 1500);
  //     } 
  //   } catch (error: any) {
  //     const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
  //     toast.error(message, { id: loginToast });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const loginToast = toast.loading('Verifying credentials...');
  try {
    const response = await axios.post('http://localhost:4000/api/v1/login', {
      phoneno: formData.phoneno,
      password: formData.password
    });

     console.log(response)

    if (response.data.success) {

      login(response.data.user, response.data.token);

       window.dispatchEvent(new Event('triggerPwaInstall'));

      // ✅ FIX: Safely read user data whether it is nested under .user or .data
      const userData = response.data.user || response.data.data;
      const token = response.data.token;

      if (!userData) {
        throw new Error("User data structure missing from backend payload response.");
      }

      // Convert role completely to lowercase to eliminate casing matching errors ('Admin' vs 'admin')
      const targetRole = (userData.role || 'customer').toLowerCase();

      // Store session data securely in LocalStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userPhone', userData.phoneno);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userRole', targetRole);
      localStorage.setItem(
  'user',
  JSON.stringify({
    _id: userData._id,
    name: userData.name,
    phoneno: userData.phoneno,
    role: targetRole,
    addresses: userData.addresses || [],
    pwaInstalled: userData.pwaInstalled || false
  })
);

      // Extra flags checks for your admin layout router state tracking
      if (targetRole === 'admin') {
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminRole', 'admin');
      } else {
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminRole');
      }

      // Synchronize Global Context State Provider parameters
      login({
        id: userData._id,
        name: userData.name,
        mobile: userData.phoneno,
        address: userData.addresses || [],
        role: targetRole,
      }, token);

      toast.success(`Welcome back, ${userData.name}!`, { id: loginToast });
      
      // ✅ FIX: Dynamic routing check handles string values accurately
      setTimeout(() => {
        if (targetRole === 'admin') {
          console.log("Redirecting user cleanly to admin area dashboard route...");
          navigate('/admin/dashboard');
        } else {
          console.log("Redirecting standard client down to default catalog root index...");
          navigate('/');
        }
      }, 1000);
    } 
  } catch (error: any) {
    console.error("Login Submission Error Handling Context:", error);
    const message = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
    toast.error(message, { id: loginToast });
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="rasi-login-page">
      <Toaster position="top-center" />
      
      <motion.div 
        className="rasi-login-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rasi-login-header">
          <h2>Welcome Back</h2>
          <p>Login to your Rasi Bakery account</p>
        </div>
        
        <form className="rasi-login-form" onSubmit={handleSubmit}>
          <div className="rasi-form-group">
            <input 
              type="tel" 
              name="phoneno" 
              id="phoneno"
              required 
              value={formData.phoneno}
              onChange={handleChange}
              placeholder=" "
              maxLength={10}
              autoComplete="tel"
            />
            <label htmlFor="phoneno">Phone Number</label>
          </div>
          
          <div className="rasi-form-group">
            <input 
              type={showPassword ? "text" : "password"}
              name="password" 
              id="password"
              required 
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              autoComplete="current-password"
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="rasi-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* <div className="rasi-form-options">
            <label className="rasi-checkbox">
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>
          </div> */}
          
          <motion.button 
            type="submit" 
            className="rasi-login-submit-btn" 
            disabled={loading}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        
        <div className="rasi-login-footer">
          <p>Don't have an account? <Link to="/register">Register Now</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
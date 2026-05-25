import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { Eye, EyeOff } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './Login.css';

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

  // Updated admin credentials with your new requirement
  const adminCredentials = {
    '8903652269': { password: 'admin@sdl!', role: 'admin' },
    '8220701195': { password: 'rrb@1195', role: 'admin' },
    '9444292269': { password: 'admin123', role: 'admin' } // ✅ New Admin Added
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Check Admin Login first (Hardcoded logic)
    const adminUser = adminCredentials[formData.phoneno as keyof typeof adminCredentials];
    if (adminUser && adminUser.password === formData.password) {
      localStorage.setItem('adminRole', adminUser.role);
      localStorage.setItem('userRole', adminUser.role); // Syncing role
      localStorage.setItem('isAdminLoggedIn', 'true');
      
      toast.success(`Welcome Admin: ${adminUser.role}`);
      setLoading(false);
      navigate('/admin/dashboard');
      return;
    }

    // 2. Node.js Backend Login for regular customers/retailers
    const loginToast = toast.loading('Verifying credentials...');
    try {
      const response = await axios.post('http://localhost:4000/api/v1/login', {
        phoneno: formData.phoneno,
        password: formData.password
      });

      //console.log(response)

      if (response.data.success) {
        const userData = response.data.data;

        // Store in LocalStorage
        localStorage.setItem('userPhone', userData.phoneno);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role || 'customer');

        // Update Context
        login({
          id: userData._id,
          name: userData.name,
          mobile: userData.phoneno,
          address: userData.addresses || [],
          role: userData.role,
        }, response.data.token);

        toast.success(`Welcome back, ${userData.name}!`, { id: loginToast });
        setTimeout(() => navigate('/'), 1500);
      } 
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
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
          
          <div className="rasi-form-options">
            <label className="rasi-checkbox">
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>
            {/* <Link to="/forgot-password" style={{ color: 'var(--highlight)', fontSize: '14px', fontWeight: '700' }}>
               Forgot Password?
            </Link> */}
          </div>
          
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
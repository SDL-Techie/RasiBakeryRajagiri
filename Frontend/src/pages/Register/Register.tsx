import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Ticket, Store } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    phoneno: '', 
    password: '',
    confirmPassword: '',
    retailerCode: '' // New field
  });
  
  const [isRetailer, setIsRetailer] = useState(false); // Toggle state
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };




  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validations
  if (formData.password !== formData.confirmPassword) {
    return toast.error("Passwords do not match!");
  }
  if (formData.phoneno.length !== 10) {
    return toast.error("Please enter a 10-digit mobile number");
  }
  if (isRetailer && !formData.retailerCode) {
    return toast.error("Please enter your Retailer Access Code");
  }

  setLoading(true);
  const loadToast = toast.loading("Creating your account...");

  try {
    // Only ONE endpoint needed now
    const response = await axios.post('http://localhost:4000/api/v1/register', {
      name: formData.name,
      phoneno: formData.phoneno,
      password: formData.password,
      // If isRetailer is true, send the code; otherwise send null/undefined
      code: isRetailer ? formData.retailerCode.toUpperCase() : undefined
    });
    
    if (response.data.success) {
      toast.success(response.data.message, { id: loadToast });
      setTimeout(() => navigate('/login'), 2000);
    }
  } catch (err: any) {
    const msg = err.response?.data?.message || "Registration failed";
    toast.error(msg, { id: loadToast });
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="rasi-register-page">
      <Toaster position="top-center" />
      
      <motion.div 
        className="rasi-register-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rasi-register-header">
          <h2>Create Account</h2>
          <p>Join Rasi Bakery family today</p>
        </div>
        
        <form className="rasi-register-form" onSubmit={handleSubmit}>
          {/* Standard Fields */}
          <div className="rasi-form-group">
            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder=" " />
            <label>Full Name *</label>
          </div>

          <div className="rasi-form-group">
            <input type="tel" name="phoneno" required value={formData.phoneno} onChange={handleChange} placeholder=" " maxLength={10} />
            <label>Mobile Number *</label>
          </div>
          
          <div className="rasi-form-group">
            <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} placeholder=" " />
            <label>Password *</label>
            <button type="button" className="rasi-password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="rasi-form-group">
            <input type={showPassword ? "text" : "password"} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder=" " />
            <label>Confirm Password *</label>
          </div>

          {/* Retailer Toggle */}
          <div className="retailer-toggle-container" style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="retailerCheck" 
              checked={isRetailer} 
              onChange={() => setIsRetailer(!isRetailer)} 
              style={{ cursor: 'pointer', width: '18px', height: '18px' }}
            />
            <label htmlFor="retailerCheck" style={{ cursor: 'pointer', fontWeight: '500', color: 'var(--coffee)' }}>
              Are you a Retailer?
            </label>
          </div>

          {/* Conditional Retailer Code Field */}
          <AnimatePresence>
            {isRetailer && (
              <motion.div 
                className="rasi-form-group"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <input 
                  type="text" name="retailerCode" required 
                  value={formData.retailerCode} onChange={handleChange} 
                  placeholder=" " style={{ borderColor: 'var(--highlight)' }}
                />
                <label> Retailer Access Code *</label>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button 
            type="submit" className="rasi-register-submit-btn" 
            disabled={loading} whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Processing...' : 'Register'}
          </motion.button>
        </form>
        
        <div className="rasi-register-footer">
          <p>Already have an account? <Link to="/login">Login Now</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
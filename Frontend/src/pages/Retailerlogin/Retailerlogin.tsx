import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Phone, Loader2, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useCustomerAuth } from '@/src/context/CustomerAuthContext';
import './Retailerlogin.css';

const Retailerlogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useCustomerAuth();
  const [formData, setFormData] = useState({
    phoneno: '',
    password: '',
    code: ''
  });

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const phone = formData.phoneno.trim();
    const password = formData.password.trim();
    const code = formData.code.trim().toUpperCase();

    // ✅ Validation
    if (!phone || !password || !code) {
      return toast.error("All fields are required");
    }

    if (phone.length !== 10) {
      return toast.error("Enter valid 10-digit phone number");
    }

    setLoading(true);
    const loadToast = toast.loading("Verifying Retailer Access...");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/retailer-login",
        { phoneno: phone, password, code }
      );

      console.log(res)

      if (res.data.success) {
        const user = res.data.user;
        const token = res.data.token || "";
        toast.success("Retailer Identity Verified!", { id: loadToast });

  const customerData = {
    id: user._id,
    name: user.name,
    mobile: user.phoneno, // Use phoneno from backend
    role: user.role,      // This is the key for "isRetailer"
    email: user.email || ""
  };

  login(customerData, token); // This updates the Navbar instantly
  navigate("/");
        // ✅ Save data
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userName", user.name);

        // ✅ Redirect based on role
        setTimeout(() => {
          if (user.role === "retailer") {
            navigate("/"); // create this page later
          } else {
            navigate("/");
          }
        }, 1000);
      }

    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Invalid Retailer Credentials";

      toast.error(msg, { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rasi-login-page">
      <Toaster position="top-center" />

      <motion.div
        className="rasi-login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="rasi-login-header">
          <div className="brand-icon-wrapper">
            <ShieldCheck size={40} color="var(--highlight)" />
          </div>
          <h2>Retailer Hub</h2>
          <p>Verify your shop credentials and access code</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="rasi-login-form">

          {/* Phone */}
          <div className="rasi-form-group">
            <input
              type="tel"
              placeholder=" "
              required
              maxLength={10}
              value={formData.phoneno}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phoneno: e.target.value.replace(/\D/g, '')
                })
              }
            />
            <label><Phone size={14} /> Phone Number</label>
          </div>

          {/* Password */}
          <div className="rasi-form-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" "
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value
                })
              }
            />
            <label><Lock size={14} /> Password</label>

            <button
              type="button"
              className="rasi-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Code */}
          <div className="rasi-form-group">
            <input
              type="text"
              className="code-input"
              placeholder=" "
              required
              value={formData.code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.target.value.toUpperCase()
                })
              }
            />
            <label><Ticket size={14} /> Retailer Access Code</label>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="rasi-login-submit-btn"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <Loader2 className="spinner" />
            ) : (
              "Verify & Access"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="rasi-login-footer">
          <p>
            Not a retailer? <Link to="/login">Standard Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Retailerlogin;
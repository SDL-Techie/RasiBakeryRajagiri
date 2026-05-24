import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Package, Heart,
  LogOut, ChevronRight, Save, Loader2, Plus,
  Check, Trash2, Home as HomeIcon, Edit3, X,
  Shield, Star,
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import Toast from '../../components/Toast/Toast';
import './Profile.css';

/* ─── Types ───────────────────────F───────────────────────────────── */
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface FormData {
  name: string;
  email: string;
  mobile: string;
}

/* ─── Animation Variants ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
};

const slideRight = {
  hidden: { opacity: 0, x: -24 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, delay: i * 0.07, ease: 'easeOut' },
  }),
};

const panelSwitch = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: -14, transition: { duration: 0.25 } },
};

const addrVariant = {
  hidden: { opacity: 0, x: -18, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1, x: 0, scale: 1,
    transition: { duration: 0.38, delay: i * 0.06, ease: 'easeOut' },
  }),
  exit: { opacity: 0, x: 18, scale: 0.95, transition: { duration: 0.22 } },
};

const AVATAR_URL =
  'https://i.pinimg.com/736x/ba/dc/43/badc433982006eda374d17887c7e2ae5.jpg';

/* ─── Component ──────────────────────────────────────────────────── */
const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { customer, isLoggedIn, logout, updateCustomer } = useCustomerAuth();

  const [loading,   setLoading]   = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'address'>('info');

  const [formData,  setFormData]  = useState<FormData>({ name: '', email: '', mobile: '' });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast,    setShowToast]    = useState(false);

  /* ── Data fetch ── */
  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    const fetchProfile = async () => {
      try {
        const res  = await axios.get(`http://localhost:4000/api/v1/profile/${customer?.id}`);
        const data = res.data.data;
        setFormData({ name: data.name, email: data.email || '', mobile: data.phoneno });
        setAddresses(data.addresses || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [isLoggedIn, customer?.id, navigate]);

  /* ── Address helpers ── */
  const addAddress = () => {
    setAddresses(prev => [
      ...prev,
      { street: '', city: '', state: '', zipCode: '', isDefault: prev.length === 0 },
    ]);
    setIsEditing(true);
    setActiveTab('address');
  };

  const removeAddress = (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    if (addresses[index].isDefault && updated.length > 0) updated[0].isDefault = true;
    setAddresses(updated);
  };

  const updateAddress = (index: number, field: string, value: string) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    setAddresses(updated);
  };

  const setDefaultAddress = (index: number) =>
    setAddresses(addresses.map((addr, i) => ({ ...addr, isDefault: i === index })));

  /* ── Save ── */
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await axios.put(`http://localhost:4000/api/v1/profile/${customer?.id}`, {
        name: formData.name, email: formData.email, phoneno: formData.mobile, addresses,
      });
      updateCustomer(formData);
      setToastMessage('✅ Profile Updated Successfully');
      setShowToast(true);
      setIsEditing(false);
    } catch {
      setToastMessage('❌ Update Failed. Please try again.');
      setShowToast(true);
    } finally { setIsSaving(false); }
  };

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div className="pf-loading-screen">
        <motion.div
          className="pf-loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
        >
          <Loader2 size={38} />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          Brewing your profile…
        </motion.p>
      </div>
    );
  }

  /* ────────────────────────────── RENDER ──────────────────────────── */
  return (
    <div className="pf-page">

      {/* ════════════ HERO HEADER ════════════ */}
      <motion.header
        className="pf-hero"
        custom={0} initial="hidden" animate="visible"
      >
        <div className="pf-hero-blob pf-hero-blob--1" />
        <div className="pf-hero-blob pf-hero-blob--2" />
        <span className="pf-hero-deco">☕</span>

        {/* Avatar */}
        {/* <motion.div
          className="pf-avatar-wrap"
          whileHover={{ scale: 1.07 }}
          transition={{ type: 'spring', stiffness: 280 }}
        >
          <img src={AVATAR_URL} alt="Profile" className="pf-avatar" />
          <span className="pf-avatar-ring" />
        </motion.div> */}

        {/* Name & badges */}
        <div className="pf-hero-text">
          <motion.h1 
          custom={1} initial="hidden" animate="visible">
            {formData.name}
          </motion.h1>
          <motion.div className="pf-hero-badges"
           custom={2} initial="hidden" animate="visible">
            <span className="pf-badge"><Shield size={11} /> Verified Customer</span>
          </motion.div>
        </div>

        {/* Logout */}
        <motion.button
          className="pf-logout-btn"
          onClick={logout}
          custom={3} initial="hidden" animate="visible"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
        >
          <LogOut size={16} /> <span>Logout</span>
        </motion.button>
      </motion.header>

      {/* ════════════ MAIN GRID ════════════ */}
      <div className="pf-grid">

        {/* ──────── Left Column ──────── */}
        <section className="pf-left">

          {/* Tab switcher */}
          <motion.div className="pf-tab-bar" 
          custom={1} initial="hidden" animate="visible">
            {([
              { key: 'info',    icon: <User size={15} />,   label: 'Personal Info' },
              { key: 'address', icon: <MapPin size={15} />, label: 'Addresses'     },
            ] as const).map(({ key, icon, label }) => (
              <button
                key={key}
                className={`pf-tab ${activeTab === key ? 'pf-tab--active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {icon} <span className="pf-tab-label">{label}</span>
                {activeTab === key && (
                  <motion.span className="pf-tab-pill" layoutId="tab-pill" />
                )}
              </button>
            ))}
          </motion.div>

          {/* ─── PANEL: PERSONAL INFO ─── */}
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div
                key="info-panel"
                className="pf-card"
                initial="hidden" animate="visible" exit="exit"
              >
                <div className="pf-card-head">
                  <div className="pf-card-title">
                    <span className="pf-card-icon-box"><User size={16} /></span>
                    <span className="pf-card-title-text">Personal Information</span>
                  </div>
                  {!isEditing && (
                    <motion.button
                      className="pf-edit-btn"
                      onClick={() => setIsEditing(true)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit3 size={13} /> <span className="pf-edit-btn-text">Edit Profile</span>
                    </motion.button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    /* ── Display view ── */
                    <motion.div
                      key="display"
                      className="pf-info-list"
                      variants={fadeIn} initial="hidden" animate="visible" exit="hidden"
                    >
                      {[
                        { icon: <Mail size={16} />,  label: 'Email Address', value: formData.email || 'Not added yet' },
                        { icon: <Phone size={16} />, label: 'Mobile Number', value: formData.mobile },
                      ].map(({ icon, label, value }, i) => (
                        <motion.div
                          key={label}
                          className="pf-info-row"
                          custom={i} initial="hidden" animate="visible"
                        >
                          <div className="pf-info-icon-box">{icon}</div>
                          <div className="pf-info-body">
                            <span className="pf-info-label">{label}</span>
                            <span className="pf-info-value">{value}</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    /* ── Edit view ── */
                    <motion.div
                      key="edit-form"
                      className="pf-form"
                      variants={fadeIn} initial="hidden" animate="visible" exit="hidden"
                    >
                      {[
                        { label: 'Full Name',     key: 'name',   icon: <User size={15} />,  disabled: false },
                        { label: 'Email Address', key: 'email',  icon: <Mail size={15} />,  disabled: false },
                        { label: 'Mobile Number', key: 'mobile', icon: <Phone size={15} />, disabled: true  },
                      ].map(({ label, key, icon, disabled }, i) => (
                        <motion.div
                          key={key}
                          className="pf-field"
                          custom={i} initial="hidden" animate="visible"
                        >
                          <label className="pf-field-label">{label}</label>
                          <div className={`pf-input-wrap${disabled ? ' pf-input-wrap--locked' : ''}`}>
                            <span className="pf-input-icon">{icon}</span>
                            <input
                              className="pf-input"
                              value={(formData as any)[key]}
                              disabled={disabled}
                              onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                              placeholder={`Enter ${label.toLowerCase()}`}
                            />
                            {disabled && <span className="pf-locked-tag">Locked</span>}
                          </div>
                          {disabled && <p className="pf-field-hint">Mobile number cannot be changed</p>}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ─── PANEL: ADDRESSES ─── */}
            {activeTab === 'address' && (
              <motion.div
                key="address-panel"
                className="pf-card"
                initial="hidden" animate="visible" exit="exit"
              >
                <div className="pf-card-head">
                  <div className="pf-card-title">
                    <span className="pf-card-icon-box"><MapPin size={16} /></span>
                    <span className="pf-card-title-text">Delivery Addresses</span>
                  </div>
                  <motion.button
                    className="pf-add-addr-btn"
                    onClick={addAddress}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <Plus size={14} /> <span className="pf-add-addr-text">Add New</span>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {addresses.length === 0 ? (
                    <motion.div
                      className="pf-empty-state"
                      initial={{ opacity: 0, scale: 0.93 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="pf-empty-icon-box"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                      >
                        <MapPin size={28} />
                      </motion.div>
                      <h4>No Addresses Yet</h4>
                      <p>Add a delivery address for faster, smoother checkout</p>
                      <motion.button
                        className="pf-empty-cta"
                        onClick={addAddress}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        Add My First Address
                      </motion.button>
                    </motion.div>
                  ) : (
                    <div className="pf-addr-list">
                      <AnimatePresence>
                        {addresses.map((addr, index) => (
                          <motion.div
                            key={index}
                            className={`pf-addr-card${addr.isDefault ? ' pf-addr-card--default' : ''}`}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                          >
                            {isEditing ? (
                              <div className="pf-addr-edit-body">
                                <div className="pf-addr-grid">
                                  {[
                                    { ph: 'Street / Door No', field: 'street'  },
                                    { ph: 'City',             field: 'city'    },
                                    { ph: 'State',            field: 'state'   },
                                    { ph: 'Zip Code',         field: 'zipCode' },
                                  ].map(({ ph, field }) => (
                                    <input
                                      key={field}
                                      className="pf-addr-input"
                                      placeholder={ph}
                                      value={(addr as any)[field]}
                                      onChange={e => updateAddress(index, field, e.target.value)}
                                    />
                                  ))}
                                </div>
                                <div className="pf-addr-edit-footer">
                                  <motion.button
                                    className={`pf-default-toggle${addr.isDefault ? ' pf-default-toggle--on' : ''}`}
                                    onClick={() => setDefaultAddress(index)}
                                    whileTap={{ scale: 0.93 }}
                                  >
                                    {addr.isDefault && <Check size={12} />}
                                    <span className="pf-default-toggle-text">{addr.isDefault ? 'Primary Address' : 'Set as Default'}</span>
                                  </motion.button>
                                  <motion.button
                                    className="pf-remove-btn"
                                    onClick={() => removeAddress(index)}
                                    whileHover={{ scale: 1.12 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Trash2 size={15} />
                                  </motion.button>
                                </div>
                              </div>
                            ) : (
                              <div className="pf-addr-display">
                                <div className="pf-addr-home-icon">
                                  <HomeIcon size={17} />
                                </div>
                                <div className="pf-addr-details">
                                  <p className="pf-addr-text">
                                    {addr.street}, {addr.city}, {addr.state} – {addr.zipCode}
                                  </p>
                                  {addr.isDefault && (
                                    <motion.span
                                      className="pf-primary-pill"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: 'spring', stiffness: 500 }}
                                    >
                                      <Check size={10} /> <span className="pf-primary-pill-text">Primary</span>
                                    </motion.span>
                                  )}
                                </div>
                                {!addr.isDefault && (
                                  <button
                                    className="pf-set-default-btn"
                                    onClick={() => { setDefaultAddress(index); handleSave(); }}
                                  >
                                    Set Default
                                  </button>
                                )}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Sticky Save Bar ── */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                className="pf-action-bar"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              >
                <motion.button
                  className="pf-cancel-btn"
                  onClick={() => setIsEditing(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <X size={15} /> <span className="pf-cancel-btn-text">Cancel</span>
                </motion.button>
                <motion.button
                  className="pf-save-btn"
                  onClick={handleSave}
                  disabled={isSaving}
                  whileHover={{ scale: isSaving ? 1 : 1.04 }}
                  whileTap={{ scale: isSaving ? 1 : 0.96 }}
                >
                  {isSaving ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
                      style={{ display: 'flex' }}
                    >
                      <Loader2 size={16} />
                    </motion.span>
                  ) : (
                    <Save size={16} />
                  )}
                  <span className="pf-save-btn-text">{isSaving ? 'Saving…' : 'Save Changes'}</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ──────── Right Sidebar ──────── */}
        <aside className="pf-sidebar">
          {/* Promo card */}
          <motion.div
            className="pf-promo-card"
            custom={4} initial="hidden" animate="visible"
            whileHover={{ scale: 1.025 }}
            transition={{ type: 'spring', stiffness: 220 }}
          >
            <motion.div
              className="pf-promo-emoji"
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            >
              ☕
            </motion.div>
            <p className="pf-promo-title">Complete Your Profile</p>
            <p className="pf-promo-sub">
              Be a part of Rasi Bakery's sweet journey unlock exclusive offers crafted just for you
            </p>

            {!formData.email && (
              <motion.button
                className="pf-promo-cta"
                onClick={() => { setActiveTab('info'); setIsEditing(true); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Email
              </motion.button>
            )}
          </motion.div>
        </aside>
      </div>

      <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default Profile;
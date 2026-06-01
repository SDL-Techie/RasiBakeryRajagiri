// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import { useNavigate } from 'react-router-dom';
// // // import {
// // //   User, Mail, Phone, MapPin, Package, Heart,
// // //   LogOut, ChevronRight, Save, Loader2, Plus,
// // //   Check, Trash2, Home as HomeIcon, Edit3, X,
// // //   Shield, Star,
// // // } from 'lucide-react';
// // // import { useCustomerAuth } from '../../context/CustomerAuthContext';
// // // import Toast from '../../components/Toast/Toast';
// // // import './Profile.css';

// // // interface Address {
// // //   street: string;
// // //   city: string;
// // //   state: string;
// // //   zipCode: string;
// // //   isDefault: boolean;
// // // }

// // // interface FormData {
// // //   name: string;
// // //   email: string;
// // //   mobile: string;
// // // }

// // // /* ─── Animation Variants ─────────────────────────────────────────── */
// // // const fadeUp = {
// // //   hidden: { opacity: 0, y: 28 },
// // //   visible: (i = 0) => ({
// // //     opacity: 1,
// // //     y: 0,
// // //     transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
// // //   }),
// // // };

// // // const fadeIn = {
// // //   hidden: { opacity: 0 },
// // //   visible: { opacity: 1, transition: { duration: 0.35 } },
// // // };

// // // const slideRight = {
// // //   hidden: { opacity: 0, x: -24 },
// // //   visible: (i = 0) => ({
// // //     opacity: 1,
// // //     x: 0,
// // //     transition: { duration: 0.42, delay: i * 0.07, ease: 'easeOut' },
// // //   }),
// // // };

// // // const panelSwitch = {
// // //   hidden: { opacity: 0, y: 18 },
// // //   visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
// // //   exit:   { opacity: 0, y: -14, transition: { duration: 0.25 } },
// // // };

// // // const addrVariant = {
// // //   hidden: { opacity: 0, x: -18, scale: 0.97 },
// // //   visible: (i = 0) => ({
// // //     opacity: 1, x: 0, scale: 1,
// // //     transition: { duration: 0.38, delay: i * 0.06, ease: 'easeOut' },
// // //   }),
// // //   exit: { opacity: 0, x: 18, scale: 0.95, transition: { duration: 0.22 } },
// // // };

// // // const AVATAR_URL =
// // //   'https://i.pinimg.com/736x/ba/dc/43/badc433982006eda374d17887c7e2ae5.jpg';

// // // /* ─── Component ──────────────────────────────────────────────────── */
// // // const Profile: React.FC = () => {
// // //   const navigate = useNavigate();
// // //   const { customer, isLoggedIn, logout, updateCustomer } = useCustomerAuth();

// // //   const [loading,   setLoading]   = useState(true);
// // //   const [isEditing, setIsEditing] = useState(false);
// // //   const [isSaving,  setIsSaving]  = useState(false);
// // //   const [activeTab, setActiveTab] = useState<'info' | 'address'>('info');

// // //   const [formData,  setFormData]  = useState<FormData>({ name: '', email: '', mobile: '' });
// // //   const [addresses, setAddresses] = useState<Address[]>([]);
// // //   const [toastMessage, setToastMessage] = useState('');
// // //   const [showToast,    setShowToast]    = useState(false);

// // //   /* ── Data fetch ── */
// // //   useEffect(() => {
// // //     if (!isLoggedIn) { navigate('/login'); return; }
// // //     const fetchProfile = async () => {
// // //       try {
// // //         const res  = await axios.get(`http://localhost:4000/api/v1/profile/${customer?.id}`, {
// // //     headers: {
// // //       Authorization: `Bearer ${localStorage.getItem("token")}`
// // //     }
// // //   });
// // //         const data = res.data.data;
// // //         setFormData({ name: data.name, email: data.email || '', mobile: data.phoneno });
// // //         setAddresses(data.addresses || []);
// // //       } catch (err) { console.error(err); }
// // //       finally { setLoading(false); }
// // //     };
// // //     fetchProfile();
// // //   }, [isLoggedIn, customer?.id, navigate]);

// // //   /* ── Address helpers ── */
// // //   const addAddress = () => {
// // //     setAddresses(prev => [
// // //       ...prev,
// // //       { street: '', city: '', state: '', zipCode: '', isDefault: prev.length === 0 },
// // //     ]);
// // //     setIsEditing(true);
// // //     setActiveTab('address');
// // //   };

// // //   const removeAddress = (index: number) => {
// // //     const updated = addresses.filter((_, i) => i !== index);
// // //     if (addresses[index].isDefault && updated.length > 0) updated[0].isDefault = true;
// // //     setAddresses(updated);
// // //   };

// // //   const updateAddress = (index: number, field: string, value: string) => {
// // //     const updated = [...addresses];
// // //     updated[index] = { ...updated[index], [field]: value };
// // //     setAddresses(updated);
// // //   };

// // //   const setDefaultAddress = (index: number) =>
// // //     setAddresses(addresses.map((addr, i) => ({ ...addr, isDefault: i === index })));

// // //   /* ── Save ── */
// // //   const handleSave = async () => {
// // //     try {
// // //       setIsSaving(true);
// // //       await axios.put(`http://localhost:4000/api/v1/profile/${customer?.id}`, {
// // //         name: formData.name, email: formData.email, phoneno: formData.mobile, addresses,
// // //       },
// // //      {
// // //     headers: {
// // //       Authorization: `Bearer ${localStorage.getItem("token")}`
// // //     }
// // //   }
// // //     );
// // //       updateCustomer(formData);
// // //       setToastMessage('✅ Profile Updated Successfully');
// // //       setShowToast(true);
// // //       setIsEditing(false);
// // //     } catch {
// // //       setToastMessage('❌ Update Failed. Please try again.');
// // //       setShowToast(true);
// // //     } finally { setIsSaving(false); }
// // //   };

// // //   /* ── Loading screen ── */
// // //   if (loading) {
// // //     return (
// // //       <div className="pf-loading-screen">
// // //         <motion.div
// // //           className="pf-loading-spinner"
// // //           animate={{ rotate: 360 }}
// // //           transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
// // //         >
// // //           <Loader2 size={38} />
// // //         </motion.div>
// // //         <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
// // //           Brewing your profile…
// // //         </motion.p>
// // //       </div>
// // //     );
// // //   }

// // //   /* ────────────────────────────── RENDER ──────────────────────────── */
// // //   return (
// // //     <div className="pf-page">

// // //       {/* ════════════ HERO HEADER ════════════ */}
// // //       <motion.header
// // //         className="pf-hero"
// // //         custom={0} initial="hidden" animate="visible"
// // //       >
// // //         <div className="pf-hero-blob pf-hero-blob--1" />
// // //         <div className="pf-hero-blob pf-hero-blob--2" />
// // //         <span className="pf-hero-deco">☕</span>

// // //         {/* Avatar */}
// // //         {/* <motion.div
// // //           className="pf-avatar-wrap"
// // //           whileHover={{ scale: 1.07 }}
// // //           transition={{ type: 'spring', stiffness: 280 }}
// // //         >
// // //           <img src={AVATAR_URL} alt="Profile" className="pf-avatar" />
// // //           <span className="pf-avatar-ring" />
// // //         </motion.div> */}

// // //         {/* Name & badges */}
// // //         <div className="pf-hero-text">
// // //           <motion.h1 
// // //           custom={1} initial="hidden" animate="visible">
// // //             {formData.name}
// // //           </motion.h1>
// // //           <motion.div className="pf-hero-badges"
// // //            custom={2} initial="hidden" animate="visible">
// // //             <span className="pf-badge"><Shield size={11} /> Verified Customer</span>
// // //           </motion.div>
// // //         </div>

// // //         {/* Logout */}
// // //         <motion.button
// // //           className="pf-logout-btn"
// // //           onClick={logout}
// // //           custom={3} initial="hidden" animate="visible"
// // //           whileHover={{ scale: 1.05 }}
// // //           whileTap={{ scale: 0.94 }}
// // //         >
// // //           <LogOut size={16} /> <span>Logout</span>
// // //         </motion.button>
// // //       </motion.header>

// // //       {/* ════════════ MAIN GRID ════════════ */}
// // //       <div className="pf-grid">

// // //         {/* ──────── Left Column ──────── */}
// // //         <section className="pf-left">

// // //           {/* Tab switcher */}
// // //           <motion.div className="pf-tab-bar" 
// // //           custom={1} initial="hidden" animate="visible">
// // //             {([
// // //               { key: 'info',    icon: <User size={15} />,   label: 'Personal Info' },
// // //               { key: 'address', icon: <MapPin size={15} />, label: 'Addresses'     },
// // //             ] as const).map(({ key, icon, label }) => (
// // //               <button
// // //                 key={key}
// // //                 className={`pf-tab ${activeTab === key ? 'pf-tab--active' : ''}`}
// // //                 onClick={() => setActiveTab(key)}
// // //               >
// // //                 {icon} <span className="pf-tab-label">{label}</span>
// // //                 {activeTab === key && (
// // //                   <motion.span className="pf-tab-pill" layoutId="tab-pill" />
// // //                 )}
// // //               </button>
// // //             ))}
// // //           </motion.div>

// // //           {/* ─── PANEL: PERSONAL INFO ─── */}
// // //           <AnimatePresence mode="wait">
// // //             {activeTab === 'info' && (
// // //               <motion.div
// // //                 key="info-panel"
// // //                 className="pf-card"
// // //                 initial="hidden" animate="visible" exit="exit"
// // //               >
// // //                 <div className="pf-card-head">
// // //                   <div className="pf-card-title">
// // //                     <span className="pf-card-icon-box"><User size={16} /></span>
// // //                     <span className="pf-card-title-text">Personal Information</span>
// // //                   </div>
// // //                   {!isEditing && (
// // //                     <motion.button
// // //                       className="pf-edit-btn"
// // //                       onClick={() => setIsEditing(true)}
// // //                       whileHover={{ scale: 1.04 }}
// // //                       whileTap={{ scale: 0.95 }}
// // //                     >
// // //                       <Edit3 size={13} /> <span className="pf-edit-btn-text">Edit Profile</span>
// // //                     </motion.button>
// // //                   )}
// // //                 </div>

// // //                 <AnimatePresence mode="wait">
// // //                   {!isEditing ? (
// // //                     /* ── Display view ── */
// // //                     <motion.div
// // //                       key="display"
// // //                       className="pf-info-list"
// // //                       variants={fadeIn} initial="hidden" animate="visible" exit="hidden"
// // //                     >
// // //                       {[
// // //                         { icon: <Mail size={16} />,  label: 'Email Address', value: formData.email || 'Not added yet' },
// // //                         { icon: <Phone size={16} />, label: 'Mobile Number', value: formData.mobile },
// // //                       ].map(({ icon, label, value }, i) => (
// // //                         <motion.div
// // //                           key={label}
// // //                           className="pf-info-row"
// // //                           custom={i} initial="hidden" animate="visible"
// // //                         >
// // //                           <div className="pf-info-icon-box">{icon}</div>
// // //                           <div className="pf-info-body">
// // //                             <span className="pf-info-label">{label}</span>
// // //                             <span className="pf-info-value">{value}</span>
// // //                           </div>
// // //                         </motion.div>
// // //                       ))}
// // //                     </motion.div>
// // //                   ) : (
// // //                     /* ── Edit view ── */
// // //                     <motion.div
// // //                       key="edit-form"
// // //                       className="pf-form"
// // //                       variants={fadeIn} initial="hidden" animate="visible" exit="hidden"
// // //                     >
// // //                       {[
// // //                         { label: 'Full Name',     key: 'name',   icon: <User size={15} />,  disabled: false },
// // //                         { label: 'Email Address', key: 'email',  icon: <Mail size={15} />,  disabled: false },
// // //                         { label: 'Mobile Number', key: 'mobile', icon: <Phone size={15} />, disabled: true  },
// // //                       ].map(({ label, key, icon, disabled }, i) => (
// // //                         <motion.div
// // //                           key={key}
// // //                           className="pf-field"
// // //                           custom={i} initial="hidden" animate="visible"
// // //                         >
// // //                           <label className="pf-field-label">{label}</label>
// // //                           <div className={`pf-input-wrap${disabled ? ' pf-input-wrap--locked' : ''}`}>
// // //                             <span className="pf-input-icon">{icon}</span>
// // //                             <input
// // //                               className="pf-input"
// // //                               value={(formData as any)[key]}
// // //                               disabled={disabled}
// // //                               onChange={e => setFormData({ ...formData, [key]: e.target.value })}
// // //                               placeholder={`Enter ${label.toLowerCase()}`}
// // //                             />
// // //                             {disabled && <span className="pf-locked-tag">Locked</span>}
// // //                           </div>
// // //                           {disabled && <p className="pf-field-hint">Mobile number cannot be changed</p>}
// // //                         </motion.div>
// // //                       ))}
// // //                     </motion.div>
// // //                   )}
// // //                 </AnimatePresence>
// // //               </motion.div>
// // //             )}

// // //             {/* ─── PANEL: ADDRESSES ─── */}
// // //             {activeTab === 'address' && (
// // //               <motion.div
// // //                 key="address-panel"
// // //                 className="pf-card"
// // //                 initial="hidden" animate="visible" exit="exit"
// // //               >
// // //                 <div className="pf-card-head">
// // //                   <div className="pf-card-title">
// // //                     <span className="pf-card-icon-box"><MapPin size={16} /></span>
// // //                     <span className="pf-card-title-text">Delivery Addresses</span>
// // //                   </div>
// // //                   <motion.button
// // //                     className="pf-add-addr-btn"
// // //                     onClick={addAddress}
// // //                     whileHover={{ scale: 1.05 }}
// // //                     whileTap={{ scale: 0.94 }}
// // //                   >
// // //                     <Plus size={14} /> <span className="pf-add-addr-text">Add New</span>
// // //                   </motion.button>
// // //                 </div>

// // //                 <AnimatePresence>
// // //                   {addresses.length === 0 ? (
// // //                     <motion.div
// // //                       className="pf-empty-state"
// // //                       initial={{ opacity: 0, scale: 0.93 }}
// // //                       animate={{ opacity: 1, scale: 1 }}
// // //                       exit={{ opacity: 0 }}
// // //                     >
// // //                       <motion.div
// // //                         className="pf-empty-icon-box"
// // //                         animate={{ y: [0, -10, 0] }}
// // //                         transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
// // //                       >
// // //                         <MapPin size={28} />
// // //                       </motion.div>
// // //                       <h4>No Addresses Yet</h4>
// // //                       <p>Add a delivery address for faster, smoother checkout</p>
// // //                       <motion.button
// // //                         className="pf-empty-cta"
// // //                         onClick={addAddress}
// // //                         whileHover={{ scale: 1.04 }}
// // //                         whileTap={{ scale: 0.96 }}
// // //                       >
// // //                         Add My First Address
// // //                       </motion.button>
// // //                     </motion.div>
// // //                   ) : (
// // //                     <div className="pf-addr-list">
// // //                       <AnimatePresence>
// // //                         {addresses.map((addr, index) => (
// // //                           <motion.div
// // //                             key={index}
// // //                             className={`pf-addr-card${addr.isDefault ? ' pf-addr-card--default' : ''}`}
// // //                             custom={index}
// // //                             initial="hidden"
// // //                             animate="visible"
// // //                             exit="exit"
// // //                             layout
// // //                           >
// // //                             {isEditing ? (
// // //                               <div className="pf-addr-edit-body">
// // //                                 <div className="pf-addr-grid">
// // //                                   {[
// // //                                     { ph: 'Street / Door No', field: 'street'  },
// // //                                     { ph: 'City',             field: 'city'    },
// // //                                     { ph: 'State',            field: 'state'   },
// // //                                     { ph: 'Zip Code',         field: 'zipCode' },
// // //                                   ].map(({ ph, field }) => (
// // //                                     <input
// // //                                       key={field}
// // //                                       className="pf-addr-input"
// // //                                       placeholder={ph}
// // //                                       value={(addr as any)[field]}
// // //                                       onChange={e => updateAddress(index, field, e.target.value)}
// // //                                     />
// // //                                   ))}
// // //                                 </div>
// // //                                 <div className="pf-addr-edit-footer">
// // //                                   <motion.button
// // //                                     className={`pf-default-toggle${addr.isDefault ? ' pf-default-toggle--on' : ''}`}
// // //                                     onClick={() => setDefaultAddress(index)}
// // //                                     whileTap={{ scale: 0.93 }}
// // //                                   >
// // //                                     {addr.isDefault && <Check size={12} />}
// // //                                     <span className="pf-default-toggle-text">{addr.isDefault ? 'Primary Address' : 'Set as Default'}</span>
// // //                                   </motion.button>
// // //                                   <motion.button
// // //                                     className="pf-remove-btn"
// // //                                     onClick={() => removeAddress(index)}
// // //                                     whileHover={{ scale: 1.12 }}
// // //                                     whileTap={{ scale: 0.9 }}
// // //                                   >
// // //                                     <Trash2 size={15} />
// // //                                   </motion.button>
// // //                                 </div>
// // //                               </div>
// // //                             ) : (
// // //                               <div className="pf-addr-display">
// // //                                 <div className="pf-addr-home-icon">
// // //                                   <HomeIcon size={17} />
// // //                                 </div>
// // //                                 <div className="pf-addr-details">
// // //                                   <p className="pf-addr-text">
// // //                                     {addr.street}, {addr.city}, {addr.state} – {addr.zipCode}
// // //                                   </p>
// // //                                   {addr.isDefault && (
// // //                                     <motion.span
// // //                                       className="pf-primary-pill"
// // //                                       initial={{ scale: 0 }}
// // //                                       animate={{ scale: 1 }}
// // //                                       transition={{ type: 'spring', stiffness: 500 }}
// // //                                     >
// // //                                       <Check size={10} /> <span className="pf-primary-pill-text">Primary</span>
// // //                                     </motion.span>
// // //                                   )}
// // //                                 </div>
// // //                                 {!addr.isDefault && (
// // //                                   <button
// // //                                     className="pf-set-default-btn"
// // //                                     onClick={() => { setDefaultAddress(index); handleSave(); }}
// // //                                   >
// // //                                     Set Default
// // //                                   </button>
// // //                                 )}
// // //                               </div>
// // //                             )}
// // //                           </motion.div>
// // //                         ))}
// // //                       </AnimatePresence>
// // //                     </div>
// // //                   )}
// // //                 </AnimatePresence>
// // //               </motion.div>
// // //             )}
// // //           </AnimatePresence>

// // //           {/* ── Sticky Save Bar ── */}
// // //           <AnimatePresence>
// // //             {isEditing && (
// // //               <motion.div
// // //                 className="pf-action-bar"
// // //                 initial={{ opacity: 0, y: 40 }}
// // //                 animate={{ opacity: 1, y: 0 }}
// // //                 exit={{ opacity: 0, y: 40 }}
// // //                 transition={{ type: 'spring', stiffness: 320, damping: 28 }}
// // //               >
// // //                 <motion.button
// // //                   className="pf-cancel-btn"
// // //                   onClick={() => setIsEditing(false)}
// // //                   whileHover={{ scale: 1.03 }}
// // //                   whileTap={{ scale: 0.96 }}
// // //                 >
// // //                   <X size={15} /> <span className="pf-cancel-btn-text">Cancel</span>
// // //                 </motion.button>
// // //                 <motion.button
// // //                   className="pf-save-btn"
// // //                   onClick={handleSave}
// // //                   disabled={isSaving}
// // //                   whileHover={{ scale: isSaving ? 1 : 1.04 }}
// // //                   whileTap={{ scale: isSaving ? 1 : 0.96 }}
// // //                 >
// // //                   {isSaving ? (
// // //                     <motion.span
// // //                       animate={{ rotate: 360 }}
// // //                       transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
// // //                       style={{ display: 'flex' }}
// // //                     >
// // //                       <Loader2 size={16} />
// // //                     </motion.span>
// // //                   ) : (
// // //                     <Save size={16} />
// // //                   )}
// // //                   <span className="pf-save-btn-text">{isSaving ? 'Saving…' : 'Save Changes'}</span>
// // //                 </motion.button>
// // //               </motion.div>
// // //             )}
// // //           </AnimatePresence>
// // //         </section>

// // //         {/* ──────── Right Sidebar ──────── */}
// // //         <aside className="pf-sidebar">
// // //           {/* Promo card */}
// // //           <motion.div
// // //             className="pf-promo-card"
// // //             custom={4} initial="hidden" animate="visible"
// // //             whileHover={{ scale: 1.025 }}
// // //             transition={{ type: 'spring', stiffness: 220 }}
// // //           >
// // //             <motion.div
// // //               className="pf-promo-emoji"
// // //               animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
// // //               transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
// // //             >
// // //               ☕
// // //             </motion.div>
// // //             <p className="pf-promo-title">Complete Your Profile</p>
// // //             <p className="pf-promo-sub">
// // //               Be a part of Rasi Bakery's sweet journey unlock exclusive offers crafted just for you
// // //             </p>

// // //             {!formData.email && (
// // //               <motion.button
// // //                 className="pf-promo-cta"
// // //                 onClick={() => { setActiveTab('info'); setIsEditing(true); }}
// // //                 whileHover={{ scale: 1.05 }}
// // //                 whileTap={{ scale: 0.95 }}
// // //               >
// // //                 Add Email
// // //               </motion.button>
// // //             )}
// // //           </motion.div>
// // //         </aside>
// // //       </div>

// // //       <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
// // //     </div>
// // //   );
// // // };

// // // export default Profile;


// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //   User, Mail, Phone, MapPin, Package, Heart,
// //   LogOut, ChevronRight, Save, Loader2, Plus,
// //   Check, Trash2, Home as HomeIcon, Edit3, X,
// //   Shield, Star, AlertCircle,
// // } from 'lucide-react';
// // import { useCustomerAuth } from '../../context/CustomerAuthContext';
// // import Toast from '../../components/Toast/Toast';
// // import './Profile.css';

// // interface Address {
// //   street: string;
// //   city: string;
// //   state: string;
// //   zipCode: string;
// //   isDefault: boolean;
// // }

// // interface AddressError {
// //   [key: number]: {
// //     street?: string;
// //     city?: string;
// //     state?: string;
// //     zipCode?: string;
// //   };
// // }

// // interface FormData {
// //   name: string;
// //   email: string;
// //   mobile: string;
// // }

// // /* ─── Animation Variants ─────────────────────────────────────────── */
// // const fadeUp = {
// //   hidden: { opacity: 0, y: 28 },
// //   visible: (i = 0) => ({
// //     opacity: 1,
// //     y: 0,
// //     transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
// //   }),
// // };

// // const fadeIn = {
// //   hidden: { opacity: 0 },
// //   visible: { opacity: 1, transition: { duration: 0.35 } },
// // };

// // const slideRight = {
// //   hidden: { opacity: 0, x: -24 },
// //   visible: (i = 0) => ({
// //     opacity: 1,
// //     x: 0,
// //     transition: { duration: 0.42, delay: i * 0.07, ease: 'easeOut' },
// //   }),
// // };

// // const panelSwitch = {
// //   hidden: { opacity: 0, y: 18 },
// //   visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
// //   exit:   { opacity: 0, y: -14, transition: { duration: 0.25 } },
// // };

// // const addrVariant = {
// //   hidden: { opacity: 0, x: -18, scale: 0.97 },
// //   visible: (i = 0) => ({
// //     opacity: 1, x: 0, scale: 1,
// //     transition: { duration: 0.38, delay: i * 0.06, ease: 'easeOut' },
// //   }),
// //   exit: { opacity: 0, x: 18, scale: 0.95, transition: { duration: 0.22 } },
// // };

// // const AVATAR_URL =
// //   'https://i.pinimg.com/736x/ba/dc/43/badc433982006eda374d17887c7e2ae5.jpg';

// // /* ─── Component ──────────────────────────────────────────────────── */
// // const Profile: React.FC = () => {
// //   const navigate = useNavigate();
// //   const { customer, isLoggedIn, logout, updateCustomer } = useCustomerAuth();

// //   const [loading,   setLoading]   = useState(true);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [isSaving,  setIsSaving]  = useState(false);
// //   const [activeTab, setActiveTab] = useState<'info' | 'address'>('info');

// //   const [formData,  setFormData]  = useState<FormData>({ name: '', email: '', mobile: '' });
// //   const [addresses, setAddresses] = useState<Address[]>([]);
// //   const [addressErrors, setAddressErrors] = useState<AddressError>({});
// //   const [toastMessage, setToastMessage] = useState('');
// //   const [showToast,    setShowToast]    = useState(false);

// //   /* ── Data fetch ── */
// //   useEffect(() => {
// //     if (!isLoggedIn) { navigate('/login'); return; }
// //     const fetchProfile = async () => {
// //       try {
// //         const res  = await axios.get(`http://localhost:4000/api/v1/profile/${customer?.id}`, {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`
// //           }
// //         });
// //         const data = res.data.data;
// //         setFormData({ name: data.name, email: data.email || '', mobile: data.phoneno });
// //         setAddresses(data.addresses || []);
// //       } catch (err) { console.error(err); }
// //       finally { setLoading(false); }
// //     };
// //     fetchProfile();
// //   }, [isLoggedIn, customer?.id, navigate]);

// //   /* ── Validation helper ── */
// //   const validateAddress = (addr: Address): boolean => {
// //     return !!(addr.street.trim() && addr.city.trim() && addr.state.trim() && addr.zipCode.trim());
// //   };

// //   const validateAddresses = (): boolean => {
// //     const errors: AddressError = {};
// //     let isValid = true;

// //     addresses.forEach((addr, index) => {
// //       const addrErrors: any = {};
      
// //       if (!addr.street.trim()) {
// //         addrErrors.street = 'Street address is required';
// //         isValid = false;
// //       }
// //       if (!addr.city.trim()) {
// //         addrErrors.city = 'City is required';
// //         isValid = false;
// //       }
// //       if (!addr.state.trim()) {
// //         addrErrors.state = 'State is required';
// //         isValid = false;
// //       }
// //       if (!addr.zipCode.trim()) {
// //         addrErrors.zipCode = 'Zip code is required';
// //         isValid = false;
// //       }

// //       if (Object.keys(addrErrors).length > 0) {
// //         errors[index] = addrErrors;
// //       }
// //     });

// //     setAddressErrors(errors);
// //     return isValid;
// //   };

// //   /* ── Address helpers ── */
// //   const addAddress = () => {
// //     setAddresses(prev => [
// //       ...prev,
// //       { street: '', city: '', state: '', zipCode: '', isDefault: prev.length === 0 },
// //     ]);
// //     setAddressErrors({});
// //     setIsEditing(true);
// //     setActiveTab('address');
// //   };

// //   const removeAddress = (index: number) => {
// //     const updated = addresses.filter((_, i) => i !== index);
// //     if (addresses[index].isDefault && updated.length > 0) updated[0].isDefault = true;
// //     setAddresses(updated);
    
// //     // Clear errors for removed address
// //     const newErrors = { ...addressErrors };
// //     delete newErrors[index];
// //     setAddressErrors(newErrors);
// //   };

// //   const updateAddress = (index: number, field: string, value: string) => {
// //     const updated = [...addresses];
// //     updated[index] = { ...updated[index], [field]: value };
// //     setAddresses(updated);

// //     // Clear error for this field if it's now filled
// //     if (value.trim()) {
// //       const newErrors = { ...addressErrors };
// //       if (newErrors[index]) {
// //         delete newErrors[index][field as keyof typeof newErrors[0]];
// //         if (Object.keys(newErrors[index]).length === 0) {
// //           delete newErrors[index];
// //         }
// //         setAddressErrors(newErrors);
// //       }
// //     }
// //   };

// //   const setDefaultAddress = (index: number) =>
// //     setAddresses(addresses.map((addr, i) => ({ ...addr, isDefault: i === index })));

// //   /* ── Save ── */
// //   const handleSave = async () => {
// //     // Validate addresses if in editing mode
// //     if (isEditing && activeTab === 'address' && addresses.length > 0) {
// //       if (!validateAddresses()) {
// //         setToastMessage('⚠️ Please fill all address fields');
// //         setShowToast(true);
// //         return;
// //       }
// //     }

// //     try {
// //       setIsSaving(true);
// //       await axios.put(`http://localhost:4000/api/v1/profile/${customer?.id}`, {
// //         name: formData.name, email: formData.email, phoneno: formData.mobile, addresses,
// //       },
// //      {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`
// //         }
// //       }
// //     );
// //       updateCustomer(formData);
// //       setToastMessage('✅ Profile Updated Successfully');
// //       setShowToast(true);
// //       setIsEditing(false);
// //       setAddressErrors({});
// //     } catch {
// //       setToastMessage('❌ Update Failed. Please try again.');
// //       setShowToast(true);
// //     } finally { setIsSaving(false); }
// //   };

// //   const canSave = (): boolean => {
// //     if (activeTab === 'address' && addresses.length > 0) {
// //       return Object.keys(addressErrors).length === 0 && 
// //              addresses.every(addr => validateAddress(addr));
// //     }
// //     return true;
// //   };

// //   /* ── Loading screen ── */
// //   if (loading) {
// //     return (
// //       <div className="pf-loading-screen">
// //         <motion.div
// //           className="pf-loading-spinner"
// //           animate={{ rotate: 360 }}
// //           transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
// //         >
// //           <Loader2 size={38} />
// //         </motion.div>
// //         <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
// //           Brewing your profile…
// //         </motion.p>
// //       </div>
// //     );
// //   }

// //   /* ────────────────────────────── RENDER ──────────────────────────── */
// //   return (
// //     <div className="pf-page">

// //       {/* ════════════ HERO HEADER ════════════ */}
// //       <motion.header
// //         className="pf-hero"
// //         custom={0} initial="hidden" animate="visible"
// //       >
// //         <div className="pf-hero-blob pf-hero-blob--1" />
// //         <div className="pf-hero-blob pf-hero-blob--2" />
// //         <span className="pf-hero-deco">☕</span>

// //         {/* Avatar */}
// //         {/* <motion.div
// //           className="pf-avatar-wrap"
// //           whileHover={{ scale: 1.07 }}
// //           transition={{ type: 'spring', stiffness: 280 }}
// //         >
// //           <img src={AVATAR_URL} alt="Profile" className="pf-avatar" />
// //           <span className="pf-avatar-ring" />
// //         </motion.div> */}

// //         {/* Name & badges */}
// //         <div className="pf-hero-text">
// //           <motion.h1 
// //           custom={1} initial="hidden" animate="visible">
// //             {formData.name}
// //           </motion.h1>
// //           <motion.div className="pf-hero-badges"
// //            custom={2} initial="hidden" animate="visible">
// //             <span className="pf-badge"><Shield size={11} /> Verified Customer</span>
// //           </motion.div>
// //         </div>

// //         {/* Logout */}
// //         <motion.button
// //           className="pf-logout-btn"
// //           onClick={logout}
// //           custom={3} initial="hidden" animate="visible"
// //           whileHover={{ scale: 1.05 }}
// //           whileTap={{ scale: 0.94 }}
// //         >
// //           <LogOut size={16} /> <span>Logout</span>
// //         </motion.button>
// //       </motion.header>

// //       {/* ════════════ MAIN GRID ════════════ */}
// //       <div className="pf-grid">

// //         {/* ──────── Left Column ──────── */}
// //         <section className="pf-left">

// //           {/* Tab switcher */}
// //           <motion.div className="pf-tab-bar" 
// //           custom={1} initial="hidden" animate="visible">
// //             {([
// //               { key: 'info',    icon: <User size={15} />,   label: 'Personal Info' },
// //               { key: 'address', icon: <MapPin size={15} />, label: 'Addresses'     },
// //             ] as const).map(({ key, icon, label }) => (
// //               <button
// //                 key={key}
// //                 className={`pf-tab ${activeTab === key ? 'pf-tab--active' : ''}`}
// //                 onClick={() => setActiveTab(key)}
// //               >
// //                 {icon} <span className="pf-tab-label">{label}</span>
// //                 {activeTab === key && (
// //                   <motion.span className="pf-tab-pill" layoutId="tab-pill" />
// //                 )}
// //               </button>
// //             ))}
// //           </motion.div>

// //           {/* ─── PANEL: PERSONAL INFO ─── */}
// //           <AnimatePresence mode="wait">
// //             {activeTab === 'info' && (
// //               <motion.div
// //                 key="info-panel"
// //                 className="pf-card"
// //                 initial="hidden" animate="visible" exit="exit"
// //               >
// //                 <div className="pf-card-head">
// //                   <div className="pf-card-title">
// //                     <span className="pf-card-icon-box"><User size={16} /></span>
// //                     <span className="pf-card-title-text">Personal Information</span>
// //                   </div>
// //                   {!isEditing && (
// //                     <motion.button
// //                       className="pf-edit-btn"
// //                       onClick={() => setIsEditing(true)}
// //                       whileHover={{ scale: 1.04 }}
// //                       whileTap={{ scale: 0.95 }}
// //                     >
// //                       <Edit3 size={13} /> <span className="pf-edit-btn-text">Edit Profile</span>
// //                     </motion.button>
// //                   )}
// //                 </div>

// //                 <AnimatePresence mode="wait">
// //                   {!isEditing ? (
// //                     /* ── Display view ── */
// //                     <motion.div
// //                       key="display"
// //                       className="pf-info-list"
// //                       variants={fadeIn} initial="hidden" animate="visible" exit="hidden"
// //                     >
// //                       {[
// //                         { icon: <Mail size={16} />,  label: 'Email Address', value: formData.email || 'Not added yet' },
// //                         { icon: <Phone size={16} />, label: 'Mobile Number', value: formData.mobile },
// //                       ].map(({ icon, label, value }, i) => (
// //                         <motion.div
// //                           key={label}
// //                           className="pf-info-row"
// //                           custom={i} initial="hidden" animate="visible"
// //                         >
// //                           <div className="pf-info-icon-box">{icon}</div>
// //                           <div className="pf-info-body">
// //                             <span className="pf-info-label">{label}</span>
// //                             <span className="pf-info-value">{value}</span>
// //                           </div>
// //                         </motion.div>
// //                       ))}
// //                     </motion.div>
// //                   ) : (
// //                     /* ── Edit view ── */
// //                     <motion.div
// //                       key="edit-form"
// //                       className="pf-form"
// //                       variants={fadeIn} initial="hidden" animate="visible" exit="hidden"
// //                     >
// //                       {[
// //                         { label: 'Full Name',     key: 'name',   icon: <User size={15} />,  disabled: false },
// //                         { label: 'Email Address', key: 'email',  icon: <Mail size={15} />,  disabled: false },
// //                         { label: 'Mobile Number', key: 'mobile', icon: <Phone size={15} />, disabled: true  },
// //                       ].map(({ label, key, icon, disabled }, i) => (
// //                         <motion.div
// //                           key={key}
// //                           className="pf-field"
// //                           custom={i} initial="hidden" animate="visible"
// //                         >
// //                           <label className="pf-field-label">{label}</label>
// //                           <div className={`pf-input-wrap${disabled ? ' pf-input-wrap--locked' : ''}`}>
// //                             <span className="pf-input-icon">{icon}</span>
// //                             <input
// //                               className="pf-input"
// //                               value={(formData as any)[key]}
// //                               disabled={disabled}
// //                               onChange={e => setFormData({ ...formData, [key]: e.target.value })}
// //                               placeholder={`Enter ${label.toLowerCase()}`}
// //                             />
// //                             {disabled && <span className="pf-locked-tag">Locked</span>}
// //                           </div>
// //                           {disabled && <p className="pf-field-hint">Mobile number cannot be changed</p>}
// //                         </motion.div>
// //                       ))}
// //                     </motion.div>
// //                   )}
// //                 </AnimatePresence>
// //               </motion.div>
// //             )}

// //             {/* ─── PANEL: ADDRESSES ─── */}
// //             {activeTab === 'address' && (
// //               <motion.div
// //                 key="address-panel"
// //                 className="pf-card"
// //                 initial="hidden" animate="visible" exit="exit"
// //               >
// //                 <div className="pf-card-head">
// //                   <div className="pf-card-title">
// //                     <span className="pf-card-icon-box"><MapPin size={16} /></span>
// //                     <span className="pf-card-title-text">Delivery Addresses</span>
// //                   </div>
// //                   <motion.button
// //                     className="pf-add-addr-btn"
// //                     onClick={addAddress}
// //                     whileHover={{ scale: 1.05 }}
// //                     whileTap={{ scale: 0.94 }}
// //                   >
// //                     <Plus size={14} /> <span className="pf-add-addr-text">Add New</span>
// //                   </motion.button>
// //                 </div>

// //                 <AnimatePresence>
// //                   {addresses.length === 0 ? (
// //                     <motion.div
// //                       className="pf-empty-state"
// //                       initial={{ opacity: 0, scale: 0.93 }}
// //                       animate={{ opacity: 1, scale: 1 }}
// //                       exit={{ opacity: 0 }}
// //                     >
// //                       <motion.div
// //                         className="pf-empty-icon-box"
// //                         animate={{ y: [0, -10, 0] }}
// //                         transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
// //                       >
// //                         <MapPin size={28} />
// //                       </motion.div>
// //                       <h4>No Addresses Yet</h4>
// //                       <p>Add a delivery address for faster, smoother checkout</p>
// //                       <motion.button
// //                         className="pf-empty-cta"
// //                         onClick={addAddress}
// //                         whileHover={{ scale: 1.04 }}
// //                         whileTap={{ scale: 0.96 }}
// //                       >
// //                         Add My First Address
// //                       </motion.button>
// //                     </motion.div>
// //                   ) : (
// //                     <div className="pf-addr-list">
// //                       <AnimatePresence>
// //                         {addresses.map((addr, index) => (
// //                           <motion.div
// //                             key={index}
// //                             className={`pf-addr-card${addr.isDefault ? ' pf-addr-card--default' : ''}`}
// //                             custom={index}
// //                             initial="hidden"
// //                             animate="visible"
// //                             exit="exit"
// //                             layout
// //                           >
// //                             {isEditing ? (
// //                               <div className="pf-addr-edit-body">
// //                                 <div className="pf-addr-grid">
// //                                   {[
// //                                     { ph: 'Street / Door No', field: 'street'  },
// //                                     { ph: 'City',             field: 'city'    },
// //                                     { ph: 'State',            field: 'state'   },
// //                                     { ph: 'Zip Code',         field: 'zipCode' },
// //                                   ].map(({ ph, field }) => (
// //                                     <div key={field}>
// //                                       <input
// //                                         className={`pf-addr-input ${
// //                                           addressErrors[index]?.[field as keyof typeof addressErrors[0]]
// //                                             ? 'pf-addr-input--error'
// //                                             : ''
// //                                         }`}
// //                                         placeholder={ph}
// //                                         value={(addr as any)[field]}
// //                                         onChange={e => updateAddress(index, field, e.target.value)}
// //                                       />
// //                                       {addressErrors[index]?.[field as keyof typeof addressErrors[0]] && (
// //                                         <motion.p
// //                                           className="pf-addr-error-msg"
// //                                           initial={{ opacity: 0, y: -4 }}
// //                                           animate={{ opacity: 1, y: 0 }}
// //                                         >
// //                                           <AlertCircle size={10} style={{ display: 'inline', marginRight: '4px' }} />
// //                                           {addressErrors[index][field as keyof typeof addressErrors[0]]}
// //                                         </motion.p>
// //                                       )}
// //                                     </div>
// //                                   ))}
// //                                 </div>
// //                                 <div className="pf-addr-edit-footer">
// //                                   <motion.button
// //                                     className={`pf-default-toggle${addr.isDefault ? ' pf-default-toggle--on' : ''}`}
// //                                     onClick={() => setDefaultAddress(index)}
// //                                     whileTap={{ scale: 0.93 }}
// //                                   >
// //                                     {addr.isDefault && <Check size={12} />}
// //                                     <span className="pf-default-toggle-text">{addr.isDefault ? 'Primary Address' : 'Set as Default'}</span>
// //                                   </motion.button>
// //                                   <motion.button
// //                                     className="pf-remove-btn"
// //                                     onClick={() => removeAddress(index)}
// //                                     whileHover={{ scale: 1.12 }}
// //                                     whileTap={{ scale: 0.9 }}
// //                                   >
// //                                     <Trash2 size={15} />
// //                                   </motion.button>
// //                                 </div>
// //                               </div>
// //                             ) : (
// //                               <div className="pf-addr-display">
// //                                 <div className="pf-addr-home-icon">
// //                                   <HomeIcon size={17} />
// //                                 </div>
// //                                 <div className="pf-addr-details">
// //                                   <p className="pf-addr-text">
// //                                     {addr.street}, {addr.city}, {addr.state} – {addr.zipCode}
// //                                   </p>
// //                                   {addr.isDefault && (
// //                                     <motion.span
// //                                       className="pf-primary-pill"
// //                                       initial={{ scale: 0 }}
// //                                       animate={{ scale: 1 }}
// //                                       transition={{ type: 'spring', stiffness: 500 }}
// //                                     >
// //                                       <Check size={10} /> <span className="pf-primary-pill-text">Primary</span>
// //                                     </motion.span>
// //                                   )}
// //                                 </div>
// //                                 {!addr.isDefault && (
// //                                   <button
// //                                     className="pf-set-default-btn"
// //                                     onClick={() => { setDefaultAddress(index); handleSave(); }}
// //                                   >
// //                                     Set Default
// //                                   </button>
// //                                 )}
// //                               </div>
// //                             )}
// //                           </motion.div>
// //                         ))}
// //                       </AnimatePresence>
// //                     </div>
// //                   )}
// //                 </AnimatePresence>
// //               </motion.div>
// //             )}
// //           </AnimatePresence>

// //           {/* ── Sticky Save Bar ── */}
// //           <AnimatePresence>
// //             {isEditing && (
// //               <motion.div
// //                 className="pf-action-bar"
// //                 initial={{ opacity: 0, y: 40 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 exit={{ opacity: 0, y: 40 }}
// //                 transition={{ type: 'spring', stiffness: 320, damping: 28 }}
// //               >
// //                 <motion.button
// //                   className="pf-cancel-btn"
// //                   onClick={() => {
// //                     setIsEditing(false);
// //                     setAddressErrors({});
// //                   }}
// //                   whileHover={{ scale: 1.03 }}
// //                   whileTap={{ scale: 0.96 }}
// //                 >
// //                   <X size={15} /> <span className="pf-cancel-btn-text">Cancel</span>
// //                 </motion.button>
// //                 <motion.button
// //                   className="pf-save-btn"
// //                   onClick={handleSave}
// //                   disabled={isSaving || !canSave()}
// //                   whileHover={{ scale: !isSaving && canSave() ? 1.04 : 1 }}
// //                   whileTap={{ scale: !isSaving && canSave() ? 0.96 : 1 }}
// //                 >
// //                   {isSaving ? (
// //                     <motion.span
// //                       animate={{ rotate: 360 }}
// //                       transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
// //                       style={{ display: 'flex' }}
// //                     >
// //                       <Loader2 size={16} />
// //                     </motion.span>
// //                   ) : (
// //                     <Save size={16} />
// //                   )}
// //                   <span className="pf-save-btn-text">{isSaving ? 'Saving…' : 'Save Changes'}</span>
// //                 </motion.button>
// //               </motion.div>
// //             )}
// //           </AnimatePresence>
// //         </section>

// //         {/* ──────── Right Sidebar ──────── */}
// //         <aside className="pf-sidebar">
// //           {/* Promo card */}
// //           <motion.div
// //             className="pf-promo-card"
// //             custom={4} initial="hidden" animate="visible"
// //             whileHover={{ scale: 1.025 }}
// //             transition={{ type: 'spring', stiffness: 220 }}
// //           >
// //             <motion.div
// //               className="pf-promo-emoji"
// //               animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
// //               transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
// //             >
// //               ☕
// //             </motion.div>
// //             <p className="pf-promo-title">Complete Your Profile</p>
// //             <p className="pf-promo-sub">
// //               Be a part of Rasi Bakery's sweet journey unlock exclusive offers crafted just for you
// //             </p>

// //             {!formData.email && (
// //               <motion.button
// //                 className="pf-promo-cta"
// //                 onClick={() => { setActiveTab('info'); setIsEditing(true); }}
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //               >
// //                 Add Email
// //               </motion.button>
// //             )}
// //           </motion.div>
// //         </aside>
// //       </div>

// //       <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
// //     </div>
// //   );
// // };

// // export default Profile;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import {
//   User, Mail, Phone, MapPin,
//   LogOut, Save, Loader2, Plus,
//   Check, Trash2, Home as HomeIcon, Edit3, X,
//   Shield, AlertCircle, Eye, EyeOff,
// } from 'lucide-react';
// import { useCustomerAuth } from '../../context/CustomerAuthContext';
// import Toast from '../../components/Toast/Toast';
// import './Profile.css';

// interface Address {
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   isDefault: boolean;
// }

// interface AddressError {
//   [key: string]: string;
// }

// interface FormData {
//   name: string;
//   email: string;
//   mobile: string;
// }

// /* ─── Animation Variants ─────────────────────────────────────────── */
// const fadeIn = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { duration: 0.35 } },
// };

// const AVATAR_URL =
//   'https://i.pinimg.com/736x/ba/dc/43/badc433982006eda374d17887c7e2ae5.jpg';

// /* ─── Component ──────────────────────────────────────────────────── */
// const Profile: React.FC = () => {
//   const navigate = useNavigate();
//   const { customer, isLoggedIn, logout, updateCustomer } = useCustomerAuth();

//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [activeTab, setActiveTab] = useState<'info' | 'address'>('info');

//   const [formData, setFormData] = useState<FormData>({ name: '', email: '', mobile: '' });
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [toastMessage, setToastMessage] = useState('');
//   const [showToast, setShowToast] = useState(false);

//   // Modal states
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [currentAddressIndex, setCurrentAddressIndex] = useState<number | null>(null);
//   const [formErrors, setFormErrors] = useState<AddressError>({});
//   const [tempAddress, setTempAddress] = useState<Address>({
//     street: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     isDefault: false,
//   });

//   /* ── Data fetch ── */
//   useEffect(() => {
//     if (!isLoggedIn) {
//       navigate('/login');
//       return;
//     }
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`http://localhost:4000/api/v1/profile/${customer?.id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         const data = res.data.data;
//         setFormData({ name: data.name, email: data.email || '', mobile: data.phoneno });
//         setAddresses(data.addresses || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [isLoggedIn, customer?.id, navigate]);

//   /* ── Validation helpers ── */
//   const validateAddress = (addr: Address): AddressError => {
//     const errors: AddressError = {};

//     if (!addr.street.trim()) {
//       errors.street = 'Street address is required';
//     }
//     if (!addr.city.trim()) {
//       errors.city = 'City is required';
//     }
//     if (!addr.state.trim()) {
//       errors.state = 'State is required';
//     }
//     if (!addr.zipCode.trim()) {
//       errors.zipCode = 'Zip code is required';
//     }

//     return errors;
//   };

//   /* ── Address Modal Handlers ── */
//   const openAddressModal = (index?: number) => {
//     if (index !== undefined) {
//       // Edit existing address
//       setCurrentAddressIndex(index);
//       setTempAddress({ ...addresses[index] });
//     } else {
//       // Add new address
//       setCurrentAddressIndex(null);
//       setTempAddress({
//         street: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         isDefault: addresses.length === 0,
//       });
//     }
//     setFormErrors({});
//     setShowAddressModal(true);
//   };

//   const closeAddressModal = () => {
//     setShowAddressModal(false);
//     setFormErrors({});
//     setTempAddress({
//       street: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       isDefault: false,
//     });
//   };

//   const handleAddressInputChange = (field: keyof Address, value: string | boolean) => {
//     setTempAddress(prev => ({ ...prev, [field]: value }));
//     // Clear error for this field
//     if (formErrors[field]) {
//       const newErrors = { ...formErrors };
//       delete newErrors[field];
//       setFormErrors(newErrors);
//     }
//   };

//   const handleSaveAddress = () => {
//     const errors = validateAddress(tempAddress);

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     if (currentAddressIndex !== null) {
//       // Update existing address
//       // const updated = [...addresses];
//       let updated = [...addresses];
//       updated[currentAddressIndex] = tempAddress;
//       if (tempAddress.isDefault) {
//         updated = updated.map((addr, i) => ({
//           ...addr,
//           isDefault: i === currentAddressIndex,
//         }));
//       }
//       setAddresses(updated);
//     } else {
//       // Add new address
//       let updatedAddresses = [...addresses, tempAddress];
//       if (tempAddress.isDefault) {
//         updatedAddresses = updatedAddresses.map((addr, i) => ({
//           ...addr,
//           isDefault: i === updatedAddresses.length - 1,
//         }));
//       }
//       setAddresses(updatedAddresses);
//     }

//     closeAddressModal();
//     setToastMessage('✅ Address saved successfully');
//     setShowToast(true);
//   };

//   const handleDeleteAddress = (index: number) => {
//     const updated = addresses.filter((_, i) => i !== index);
//     if (addresses[index].isDefault && updated.length > 0) {
//       updated[0].isDefault = true;
//     }
//     setAddresses(updated);
//     setToastMessage('✅ Address deleted');
//     setShowToast(true);
//   };

//   const setDefaultAddress = (index: number) => {
//     const updated = addresses.map((addr, i) => ({
//       ...addr,
//       isDefault: i === index,
//     }));
//     setAddresses(updated);
//   };

//   /* ── Save Profile   ── */
//   const handleSave = async () => {
//     try {
//       setIsSaving(true);
//       await axios.put(
//         `http://localhost:4000/api/v1/profile/${customer?.id}`,
//         {
//           name: formData.name,
//           email: formData.email,
//           phoneno: formData.mobile,
//           addresses,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       updateCustomer(formData);
//       setToastMessage('✅ Profile Updated Successfully');
//       setShowToast(true);
//       setIsEditing(false);
//     } catch {
//       setToastMessage('❌ Update Failed. Please try again.');
//       setShowToast(true);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   /* ── Loading screen ── */
//   if (loading) {
//     return (
//       <div className="pf-loading-screen">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
//         >
//           <Loader2 size={38} />
//         </motion.div>
//         <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
//           Brewing your profile…
//         </motion.p>
//       </div>
//     );
//   }

//   /* ────────────────────────────── RENDER ──────────────────────────── */
//   return (
//     <div className="pf-page">
//       {/* ════════════ HERO HEADER ════════════ */}
//       <motion.header className="pf-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//         <div className="pf-hero-blob pf-hero-blob--1" />
//         <div className="pf-hero-blob pf-hero-blob--2" />
//         <span className="pf-hero-deco">☕</span>

//         {/* Name & badges */}
//         <div className="pf-hero-text">
//           <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
//             {formData.name}
//           </motion.h1>
//           <motion.div className="pf-hero-badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
//             <span className="pf-badge">
//               <Shield size={11} /> Verified Customer
//             </span>
//           </motion.div>
//         </div>

//         {/* Logout */}
//         <motion.button
//           className="pf-logout-btn"
//           onClick={logout}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.94 }}
//         >
//           <LogOut size={16} /> <span>Logout</span>
//         </motion.button>
//       </motion.header>

//       {/* ════════════ MAIN GRID ════════════ */}
//       <div className="pf-grid">
//         {/* ──────── Left Column ──────── */}
//         <section className="pf-left">
//           {/* Tab switcher */}
//           <motion.div
//             className="pf-tab-bar"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             {(
//               [
//                 { key: 'info', icon: <User size={15} />, label: 'Personal Info' },
//                 { key: 'address', icon: <MapPin size={15} />, label: 'Addresses' },
//               ] as const
//             ).map(({ key, icon, label }) => (
//               <button
//                 key={key}
//                 className={`pf-tab ${activeTab === key ? 'pf-tab--active' : ''}`}
//                 onClick={() => setActiveTab(key)}
//               >
//                 {icon} <span className="pf-tab-label">{label}</span>
//                 {activeTab === key && <motion.span className="pf-tab-pill" layoutId="tab-pill" />}
//               </button>
//             ))}
//           </motion.div>

//           {/* ─── PANEL: PERSONAL INFO ─── */}
//           <AnimatePresence mode="wait">
//             {activeTab === 'info' && (
//               <motion.div
//                 key="info-panel"
//                 className="pf-card"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//               >
//                 <div className="pf-card-head">
//                   <div className="pf-card-title">
//                     <span className="pf-card-icon-box">
//                       <User size={16} />
//                     </span>
//                     <span className="pf-card-title-text">Personal Information</span>
//                   </div>
//                   {!isEditing && (
//                     <motion.button
//                       className="pf-edit-btn"
//                       onClick={() => setIsEditing(true)}
//                       whileHover={{ scale: 1.04 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       <Edit3 size={13} /> <span className="pf-edit-btn-text">Edit Profile</span>
//                     </motion.button>
//                   )}
//                 </div>

//                 <AnimatePresence mode="wait">
//                   {!isEditing ? (
//                     /* ── Display view ── */
//                     <motion.div key="display" className="pf-info-list" variants={fadeIn} initial="hidden" animate="visible">
//                       {[
//                         {
//                           icon: <Mail size={16} />,
//                           label: 'Email Address',
//                           value: formData.email || 'Not added yet',
//                         },
//                         { icon: <Phone size={16} />, label: 'Mobile Number', value: formData.mobile },
//                       ].map(({ icon, label, value }, i) => (
//                         <motion.div
//                           key={label}
//                           className="pf-info-row"
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: i * 0.1 }}
//                         >
//                           <div className="pf-info-icon-box">{icon}</div>
//                           <div className="pf-info-body">
//                             <span className="pf-info-label">{label}</span>
//                             <span className="pf-info-value">{value}</span>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </motion.div>
//                   ) : (
//                     /* ── Edit view ── */
//                     <motion.div
//                       key="edit-form"
//                       className="pf-form"
//                       variants={fadeIn}
//                       initial="hidden"
//                       animate="visible"
//                     >
//                       {[
//                         {
//                           label: 'Full Name',
//                           key: 'name',
//                           icon: <User size={15} />,
//                           disabled: false,
//                         },
//                         {
//                           label: 'Email Address',
//                           key: 'email',
//                           icon: <Mail size={15} />,
//                           disabled: false,
//                         },
//                         {
//                           label: 'Mobile Number',
//                           key: 'mobile',
//                           icon: <Phone size={15} />,
//                           disabled: true,
//                         },
//                       ].map(({ label, key, icon, disabled }, i) => (
//                         <motion.div
//                           key={key}
//                           className="pf-field"
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: i * 0.1 }}
//                         >
//                           <label className="pf-field-label">{label}</label>
//                           <div className={`pf-input-wrap${disabled ? ' pf-input-wrap--locked' : ''}`}>
//                             <span className="pf-input-icon">{icon}</span>
//                             <input
//                               className="pf-input"
//                               value={(formData as any)[key]}
//                               disabled={disabled}
//                               onChange={e =>
//                                 setFormData({ ...formData, [key]: e.target.value })
//                               }
//                               placeholder={`Enter ${label.toLowerCase()}`}
//                             />
//                             {disabled && <span className="pf-locked-tag">Locked</span>}
//                           </div>
//                           {disabled && (
//                             <p className="pf-field-hint">Mobile number cannot be changed</p>
//                           )}
//                         </motion.div>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             )}

//             {/* ─── PANEL: ADDRESSES ─── */}
//             {activeTab === 'address' && (
//               <motion.div
//                 key="address-panel"
//                 className="pf-card"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//               >
//                 <div className="pf-card-head">
//                   <div className="pf-card-title">
//                     <span className="pf-card-icon-box">
//                       <MapPin size={16} />
//                     </span>
//                     <span className="pf-card-title-text">Delivery Addresses</span>
//                   </div>
//                   <motion.button
//                     className="pf-add-addr-btn"
//                     onClick={() => openAddressModal()}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.94 }}
//                   >
//                     <Plus size={14} /> <span className="pf-add-addr-text">Add New</span>
//                   </motion.button>
//                 </div>

//                 <AnimatePresence>
//                   {addresses.length === 0 ? (
//                     <motion.div
//                       className="pf-empty-state"
//                       initial={{ opacity: 0, scale: 0.93 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0 }}
//                     >
//                       <motion.div
//                         className="pf-empty-icon-box"
//                         animate={{ y: [0, -10, 0] }}
//                         transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
//                       >
//                         <MapPin size={28} />
//                       </motion.div>
//                       <h4>No Addresses Yet</h4>
//                       <p>Add a delivery address for faster, smoother checkout</p>
//                       <motion.button
//                         className="pf-empty-cta"
//                         onClick={() => openAddressModal()}
//                         whileHover={{ scale: 1.04 }}
//                         whileTap={{ scale: 0.96 }}
//                       >
//                         Add My First Address
//                       </motion.button>
//                     </motion.div>
//                   ) : (
//                     <div className="pf-addr-list">
//                       <AnimatePresence>
//                         {addresses.map((addr, index) => (
//                           <motion.div
//                             key={index}
//                             className={`pf-addr-card${addr.isDefault ? ' pf-addr-card--default' : ''}`}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: 20 }}
//                             layout
//                           >
//                             <div className="pf-addr-display">
//                               <div className="pf-addr-home-icon">
//                                 <HomeIcon size={17} />
//                               </div>
//                               <div className="pf-addr-details">
//                                 <p className="pf-addr-text">
//                                   {addr.street}, {addr.city}, {addr.state} – {addr.zipCode}
//                                 </p>
//                                 {addr.isDefault && (
//                                   <motion.span
//                                     className="pf-primary-pill"
//                                     initial={{ scale: 0 }}
//                                     animate={{ scale: 1 }}
//                                     transition={{
//                                       type: 'spring',
//                                       stiffness: 500,
//                                     }}
//                                   >
//                                     <Check size={10} />{' '}
//                                     <span className="pf-primary-pill-text">Primary</span>
//                                   </motion.span>
//                                 )}
//                               </div>
//                               <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
//                                 <motion.button
//                                   className="pf-set-default-btn"
//                                   onClick={() => openAddressModal(index)}
//                                   whileHover={{ scale: 1.04 }}
//                                   whileTap={{ scale: 0.96 }}
//                                   style={{ width: 'auto', marginBottom: 0 }}
//                                 >
//                                   <Edit3 size={13} />
//                                 </motion.button>
//                                 {!addr.isDefault && (
//                                   <motion.button
//                                     className="pf-set-default-btn"
//                                     onClick={() => setDefaultAddress(index)}
//                                     whileHover={{ scale: 1.04 }}
//                                     whileTap={{ scale: 0.96 }}
//                                     style={{ width: 'auto', marginBottom: 0 }}
//                                   >
//                                     Set Default
//                                   </motion.button>
//                                 )}
//                                 <motion.button
//                                   onClick={() => handleDeleteAddress(index)}
//                                   whileHover={{ scale: 1.08 }}
//                                   whileTap={{ scale: 0.92 }}
//                                   style={{
//                                     background: 'rgba(229, 57, 53, 0.1)',
//                                     color: '#e53935',
//                                     border: 'none',
//                                     borderRadius: '8px',
//                                     padding: '6px 10px',
//                                     cursor: 'pointer',
//                                     fontSize: '0.75rem',
//                                     fontWeight: '600',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: '4px',
//                                   }}
//                                 >
//                                   <Trash2 size={13} />
//                                 </motion.button>
//                               </div>
//                             </div>
//                           </motion.div>
//                         ))}
//                       </AnimatePresence>
//                     </div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* ── Sticky Save Bar ── */}
//           <AnimatePresence>
//             {isEditing && (
//               <motion.div
//                 className="pf-action-bar"
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 40 }}
//                 transition={{ type: 'spring', stiffness: 320, damping: 28 }}
//               >
//                 <motion.button
//                   className="pf-cancel-btn"
//                   onClick={() => setIsEditing(false)}
//                   whileHover={{ scale: 1.03 }}
//                   whileTap={{ scale: 0.96 }}
//                 >
//                   <X size={15} /> <span className="pf-cancel-btn-text">Cancel</span>
//                 </motion.button>
//                 <motion.button
//                   className="pf-save-btn"
//                   onClick={handleSave}
//                   disabled={isSaving}
//                   whileHover={{ scale: !isSaving ? 1.04 : 1 }}
//                   whileTap={{ scale: !isSaving ? 0.96 : 1 }}
//                 >
//                   {isSaving ? (
//                     <motion.span
//                       animate={{ rotate: 360 }}
//                       transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
//                       style={{ display: 'flex' }}
//                     >
//                       <Loader2 size={16} />
//                     </motion.span>
//                   ) : (
//                     <Save size={16} />
//                   )}
//                   <span className="pf-save-btn-text">{isSaving ? 'Saving…' : 'Save Changes'}</span>
//                 </motion.button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </section>

//         {/* ──────── Right Sidebar ──────── */}
//         <aside className="pf-sidebar">
//           {/* Promo card */}
//           <motion.div
//             className="pf-promo-card"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             whileHover={{ scale: 1.025 }}
//           >
//             <motion.div
//               className="pf-promo-emoji"
//               animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
//               transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
//             >
//               ☕
//             </motion.div>
//             <p className="pf-promo-title">Complete Your Profile</p>
//             <p className="pf-promo-sub">
//               Be a part of Rasi Bakery's sweet journey unlock exclusive offers crafted just for you
//             </p>

//             {!formData.email && (
//               <motion.button
//                 className="pf-promo-cta"
//                 onClick={() => {
//                   setActiveTab('info');
//                   setIsEditing(true);
//                 }}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 Add Email
//               </motion.button>
//             )}
//           </motion.div>
//         </aside>
//       </div>

//       {/* ════════════ ADDRESS MODAL ════════════ */}
//       <AnimatePresence>
//         {showAddressModal && (
//           <motion.div
//             className="pf-modal-overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={closeAddressModal}
//           >
//             <motion.div
//               className="pf-modal"
//               onClick={e => e.stopPropagation()}
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//             >
//               {/* Header */}
//               <div className="pf-modal-header">
//                 <h2 className="pf-modal-title">
//                   {currentAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
//                 </h2>
//                 <motion.button
//                   className="pf-modal-close"
//                   onClick={closeAddressModal}
//                   whileHover={{ rotate: 90 }}
//                   whileTap={{ scale: 0.9 }}
//                 >
//                   <X size={18} />
//                 </motion.button>
//               </div>

//               {/* Body */}
//               <div className="pf-modal-body">
//                 <div className="pf-addr-form-grid">
//                   {[
//                     { label: 'Street / Door No', field: 'street' as const },
//                     { label: 'City', field: 'city' as const },
//                     { label: 'State', field: 'state' as const },
//                     { label: 'Zip Code', field: 'zipCode' as const },
//                   ].map(({ label, field }) => (
//                     <div key={field} className="pf-addr-form-field">
//                       <label className="pf-addr-form-label">{label}</label>
//                       <input
//                         className={`pf-addr-form-input ${
//                           formErrors[field] ? 'pf-addr-form-input--error' : ''
//                         }`}
//                         placeholder={label}
//                         value={tempAddress[field]}
//                         onChange={e => handleAddressInputChange(field, e.target.value)}
//                       />
//                       {formErrors[field] && (
//                         <motion.div
//                           className="pf-addr-form-error"
//                           initial={{ opacity: 0, y: -4 }}
//                           animate={{ opacity: 1, y: 0 }}
//                         >
//                           <AlertCircle size={12} />
//                           {formErrors[field]}
//                         </motion.div>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Default checkbox */}
//                 <div className="pf-addr-form-options">
//                   <label className="pf-default-checkbox">
//                     <input
//                       type="checkbox"
//                       checked={tempAddress.isDefault}
//                       onChange={e =>
//                         handleAddressInputChange('isDefault', e.target.checked)
//                       }
//                     />
//                     <span className="pf-default-checkbox-label">Set as default address</span>
//                   </label>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="pf-modal-footer">
//                 <button className="pf-modal-btn pf-modal-btn-cancel" onClick={closeAddressModal}>
//                   Cancel
//                 </button>
//                 <button
//                   className="pf-modal-btn pf-modal-btn-save"
//                   onClick={handleSaveAddress}
//                   disabled={Object.keys(formErrors).length > 0}
//                 >
//                   {currentAddressIndex !== null ? 'Update' : 'Save'} Address
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
//     </div>
//   );
// };

// export default Profile;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin,
  LogOut, Save, Loader2, Plus,
  Check, Trash2, Home as HomeIcon, Edit3, X,
  Shield, AlertCircle, Bell
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import Toast from '../../components/Toast/Toast';
import './Profile.css';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface AddressError {
  [key: string]: string;
}

interface FormData {
  name: string;
  email: string;
  mobile: string;
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { customer, isLoggedIn, logout, updateCustomer } = useCustomerAuth();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'address'>('address'); // Matches screenshot default view

  const [formData, setFormData] = useState<FormData>({ name: '', email: '', mobile: '' });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<AddressError>({});
  const [tempAddress, setTempAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });

  /* ── Data Fetching ── */
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/profile/${customer?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = res.data.data;
        setFormData({ name: data.name, email: data.email || '', mobile: data.phoneno });
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isLoggedIn, customer?.id, navigate]);

  const validateAddress = (addr: Address): AddressError => {
    const errors: AddressError = {};
    if (!addr.street.trim()) errors.street = 'Street address is required';
    if (!addr.city.trim()) errors.city = 'City is required';
    if (!addr.state.trim()) errors.state = 'State is required';
    if (!addr.zipCode.trim()) errors.zipCode = 'Zip code is required';
    return errors;
  };

  /* ── Address Handlers ── */
  const openAddressModal = (index?: number) => {
    if (index !== undefined) {
      setCurrentAddressIndex(index);
      setTempAddress({ ...addresses[index] });
    } else {
      setCurrentAddressIndex(null);
      setTempAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: addresses.length === 0,
      });
    }
    setFormErrors({});
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setFormErrors({});
  };

  const handleAddressInputChange = (field: keyof Address, value: string | boolean) => {
    setTempAddress(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  const handleSaveAddress = () => {
    const errors = validateAddress(tempAddress);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (currentAddressIndex !== null) {
      let updated = [...addresses];
      updated[currentAddressIndex] = tempAddress;
      if (tempAddress.isDefault) {
        updated = updated.map((addr, i) => ({ ...addr, isDefault: i === currentAddressIndex }));
      }
      setAddresses(updated);
    } else {
      let updatedAddresses = [...addresses, tempAddress];
      if (tempAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((addr, i) => ({ ...addr, isDefault: i === updatedAddresses.length - 1 }));
      }
      setAddresses(updatedAddresses);
    }

    closeAddressModal();
    setToastMessage('✅ Address saved successfully');
    setShowToast(true);
  };

  const handleDeleteAddress = (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    if (addresses[index].isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    setToastMessage('✅ Address deleted');
    setShowToast(true);
  };

  const setDefaultAddress = (index: number) => {
    const updated = addresses.map((addr, i) => ({ ...addr, isDefault: i === index }));
    setAddresses(updated);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await axios.put(
        `http://localhost:4000/api/v1/profile/${customer?.id}`,
        {
          name: formData.name,
          email: formData.email,
          phoneno: formData.mobile,
          addresses,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      updateCustomer(formData);
      setToastMessage('✅ Profile Updated Successfully');
      setShowToast(true);
      setIsEditing(false);
    } catch {
      setToastMessage('❌ Update Failed. Please try again.');
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rb-loading-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 size={40} className="rb-spinner" />
        </motion.div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="rb-profile-page">
      {/* ── Top App Brand Header ── */}
  
      <main className="rb-main-layout">
        <div className="rb-responsive-container">
          
          <div className="rb-right-panel">
          {/* ── Profile Section Card ── */}
          <section className="rb-profile-card">
            <div className="rb-card-header-row">
              <h2 className="rb-section-title">Profile</h2>
              <button className="rb-icon-notification-btn">
                <Bell size={20} />
              </button>
            </div>

            <div className="rb-avatar-wrapper">
              <div className="rb-avatar-inner">
                {/* <img src={AVATAR_URL} alt="User Profile" className="rb-avatar-img" /> */}
                
                <button className="rb-avatar-edit-badge" onClick={() => { setActiveTab('info'); setIsEditing(true); }}>
                  <Edit3 size={14} />
                </button>
              </div>
            </div>

            <div className="rb-user-meta-info">
              <h1 className="rb-user-fullname">{formData.name}</h1>
              <p className="rb-user-phone">{formData.mobile}</p>
            </div>

            {/* ── Stats Metric Row ── */}
            <div className="rb-metrics-row">
              <div className="rb-metric-item">
                <span className="rb-metric-value">{addresses.length}</span>
                <span className="rb-metric-label">ADDRESSES</span>
              </div>
              <div className="rb-divider"></div>
              <div className="rb-metric-item">
                <span className="rb-metric-value">
                  <Shield size={16} className="rb-verified-badge-icon" />
                </span>
                <span className="rb-metric-label">VERIFIED</span>
              </div>
              <div className="rb-divider"></div>
              <div className="rb-metric-item">
                <span className="rb-metric-value">★</span>
                <span className="rb-metric-label">MEMBER</span>
              </div>
            </div>
          </section>

          {/* ── Section Selection Toggle Tabs ── */}
          {/* <nav className="rb-toggle-tab-nav">
            <button 
              className={`rb-toggle-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <User size={18} />
              <span>Personal Info</span>
            </button>
            <button 
              className={`rb-toggle-tab-btn ${activeTab === 'address' ? 'active' : ''}`}
              onClick={() => setActiveTab('address')}
            >
              <MapPin size={18} />
              <span>Addresses</span>
            </button>
          </nav> */}
          </div>

<div className="rb-left-panel">

     <nav className="rb-toggle-tab-nav">
            <button 
              className={`rb-toggle-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <User size={18} />
              <span>Personal Info</span>
            </button>
            <button 
              className={`rb-toggle-tab-btn ${activeTab === 'address' ? 'active' : ''}`}
              onClick={() => setActiveTab('address')}
            >
              <MapPin size={18} />
              <span>Addresses</span>
            </button>
          </nav>
          {/* ── Sub Container Display Dynamic Context ── */}
          <section className="rb-content-body-card">
            <AnimatePresence mode="wait">
              
              {/* DISPLAY PERSONAL INFORMATION */}
              {activeTab === 'info' && (
                <motion.div key="info-section" variants={fadeIn} initial="hidden" animate="visible" exit="hidden" className="rb-pane-wrapper">
                  <div className="rb-pane-header">
                    <h3>Personal Information</h3>
                    {!isEditing && (
                      <button className="rb-inline-action-btn" onClick={() => setIsEditing(true)}>
                        <Edit3 size={14} /> Edit
                      </button>
                    )}
                  </div>

                  {!isEditing ? (
                    <div className="rb-details-stack">
                      <div className="rb-detail-item">
                        <Mail size={16} />
                        <div>
                          <label>Email Address</label>
                          <p>{formData.email || 'No email attached yet'}</p>
                        </div>
                      </div>
                      <div className="rb-detail-item">
                        <Phone size={16} />
                        <div>
                          <label>Mobile Number</label>
                          <p>{formData.mobile || 'Not available'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rb-form-fields-stack">
                      <div className="rb-input-group">
                        <label>Full Name</label>
                        <input 
                          type="text" 
                          value={formData.name} 
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="rb-input-group">
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="rb-input-group locked">
                        <label>Mobile Number (Locked)</label>
                        <input type="text" value={formData.mobile} disabled />
                      </div>
                      
                      <div className="rb-inline-form-actions">
                        <button className="rb-btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button className="rb-btn-primary" onClick={handleSave} disabled={isSaving}>
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* DISPLAY ADDRESS PLATFORM */}
              {activeTab === 'address' && (
                <motion.div key="address-section" variants={fadeIn} initial="hidden" animate="visible" exit="hidden" className="rb-pane-wrapper">
                  <div className="rb-pane-header">
                    <h3>Delivery Addresses</h3>
                    <button className="rb-inline-add-btn" onClick={() => openAddressModal()}>
                      <Plus size={16} /> <span>Add New</span>
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="rb-empty-address-container">
                      <div className="rb-location-circle-icon">
                        <MapPin size={32} />
                      </div>
                      <h3>No addresses yet</h3>
                      <p>Add a delivery address for faster checkout</p>
                      <button className="rb-master-add-btn" onClick={() => openAddressModal()}>
                        <Plus size={16} /> Add Address
                      </button>
                    </div>
                  ) : (
                    <div className="rb-addresses-grid-list">
                      {addresses.map((addr, index) => (
                        <div key={index} className={`rb-address-item-card ${addr.isDefault ? 'default-active' : ''}`}>
                          <div className="rb-address-card-body">
                            <HomeIcon size={18} className="rb-home-icon-indicator" />
                            <div className="rb-address-details-text">
                              <p>{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                              {addr.isDefault && <span className="rb-primary-pill-badge">Primary</span>}
                            </div>
                          </div>
                          
                          <div className="rb-address-card-actions">
                            <button className="rb-action-icon-trigger" onClick={() => openAddressModal(index)}>
                              <Edit3 size={14} />
                            </button>
                            {!addr.isDefault && (
                              <button className="rb-text-action-trigger" onClick={() => setDefaultAddress(index)}>
                                Set Default
                              </button>
                            )}
                            <button className="rb-action-icon-trigger delete" onClick={() => handleDeleteAddress(index)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Dynamic Bottom Profile Save trigger view when address modifications took place */}
                  {/* {addresses.length > 0 && (
                    <div className="rb-save-profile-prompt">
                      <p>Remember to finalize updates by committing profile structural modifications.</p>
                      <button className="rb-btn-primary full-width" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving Profile Configuration...' : 'Commit & Save All Profile Updates'}
                      </button>
                    </div>
                  )} */}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ── Utilities Action Bar (Logout) ── */}
          <footer className="rb-utility-footer">
            <button className="rb-logout-action-row-btn" onClick={logout}>
              <LogOut size={18} />
              <span>Sign Out from Account</span>
            </button>
          </footer>

          </div>

        </div>
      </main>

      {/* ── RENDER COMPONENT ADDRESS MODAL DIALOGUE ── */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="rb-modal-overlay-backdrop" onClick={closeAddressModal}>
            <motion.div 
              className="rb-modal-window-dialog" 
              onClick={e => e.stopPropagation()}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
            >
              <div className="rb-modal-top-heading">
                <h3>{currentAddressIndex !== null ? 'Edit Address' : 'Add New Address'}</h3>
                <button className="rb-modal-close-trigger" onClick={closeAddressModal}>
                  <X size={20} />
                </button>
              </div>

              <div className="rb-modal-inputs-form">
                <div className="rb-modal-input-field">
                  <label>Street / Door No</label>
                  <input 
                    type="text" 
                    value={tempAddress.street} 
                    onChange={e => handleAddressInputChange('street', e.target.value)}
                    className={formErrors.street ? 'error-border' : ''}
                  />
                  {formErrors.street && <span className="error-hint"><AlertCircle size={12}/>{formErrors.street}</span>}
                </div>

                <div className="rb-modal-input-field">
                  <label>City</label>
                  <input 
                    type="text" 
                    value={tempAddress.city} 
                    onChange={e => handleAddressInputChange('city', e.target.value)}
                    className={formErrors.city ? 'error-border' : ''}
                  />
                  {formErrors.city && <span className="error-hint"><AlertCircle size={12}/>{formErrors.city}</span>}
                </div>

                <div className="rb-modal-form-row">
                  <div className="rb-modal-input-field">
                    <label>State</label>
                    <input 
                      type="text" 
                      value={tempAddress.state} 
                      onChange={e => handleAddressInputChange('state', e.target.value)}
                      className={formErrors.state ? 'error-border' : ''}
                    />
                    {formErrors.state && <span className="error-hint"><AlertCircle size={12}/>{formErrors.state}</span>}
                  </div>

                  {/* <div className="rb-modal-input-field">
                    <label>Zip Code</label>
                    <input 
                      type="text" 
                      value={tempAddress.zipCode} 
                      onChange={e => handleAddressInputChange('zipCode', e.target.value)}
                      className={formErrors.zipCode ? 'error-border' : ''}
                    />
                    {formErrors.zipCode && <span className="error-hint"><AlertCircle size={12}/>{formErrors.zipCode}</span>}
                  </div> */}
                </div>
                    <div className="rb-modal-input-field">
                    <label>Zip Code</label>
                    <input 
                      type="text" 
                      value={tempAddress.zipCode} 
                      onChange={e => handleAddressInputChange('zipCode', e.target.value)}
                      className={formErrors.zipCode ? 'error-border' : ''}
                    />
                    {formErrors.zipCode && <span className="error-hint"><AlertCircle size={12}/>{formErrors.zipCode}</span>}
                  </div>

                <div className="rb-checkbox-option-wrapper">
                  <input 
                    type="checkbox" 
                    id="isDefaultCheckbox"
                    checked={tempAddress.isDefault} 
                    onChange={e => handleAddressInputChange('isDefault', e.target.checked)}
                  />
                  <label htmlFor="isDefaultCheckbox">Set as primary default address</label>
                </div>
              </div>

              <div className="rb-modal-actions-footer">
                <button className="rb-btn-secondary" onClick={closeAddressModal}>Cancel</button>
                <button className="rb-btn-primary" onClick={handleSaveAddress}>
                  {currentAddressIndex !== null ? 'Update Location' : 'Save Address'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default Profile;
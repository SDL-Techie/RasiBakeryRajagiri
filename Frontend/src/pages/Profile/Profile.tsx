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

  // const handleSaveAddress = () => {
  //   const errors = validateAddress(tempAddress);
  //   if (Object.keys(errors).length > 0) {
  //     setFormErrors(errors);
  //     return;
  //   }

  //   if (currentAddressIndex !== null) {
  //     let updated = [...addresses];
  //     updated[currentAddressIndex] = tempAddress;
  //     if (tempAddress.isDefault) {
  //       updated = updated.map((addr, i) => ({ ...addr, isDefault: i === currentAddressIndex }));
  //     }
  //     setAddresses(updated);
  //   } else {
  //     let updatedAddresses = [...addresses, tempAddress];
  //     if (tempAddress.isDefault) {
  //       updatedAddresses = updatedAddresses.map((addr, i) => ({ ...addr, isDefault: i === updatedAddresses.length - 1 }));
  //     }
  //     setAddresses(updatedAddresses);
  //   }

  //   closeAddressModal();
  //   setToastMessage('✅ Address saved successfully');
  //   setShowToast(true);
  // };

  const handleSaveAddress = async () => {
  const errors = validateAddress(tempAddress);
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  let updatedAddresses: Address[];

  if (currentAddressIndex !== null) {
    updatedAddresses = [...addresses];
    updatedAddresses[currentAddressIndex] = tempAddress;
    if (tempAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((addr, i) => ({ 
        ...addr, 
        isDefault: i === currentAddressIndex 
      }));
    }
  } else {
    updatedAddresses = [...addresses, tempAddress];
    if (tempAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((addr, i) => ({ 
        ...addr, 
        isDefault: i === updatedAddresses.length - 1 
      }));
    }
  }

  try {
    // Save directly to backend
    await axios.put(
      `http://localhost:4000/api/v1/profile/${customer?.id}`,
      {
        name: formData.name,
        email: formData.email,
        addresses: updatedAddresses,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );

    setAddresses(updatedAddresses);
    closeAddressModal();
    setToastMessage('✅ Address saved successfully');
    setShowToast(true);
  } catch (error) {
    setToastMessage('❌ Failed to save address');
    setShowToast(true);
  }
};

  // const handleDeleteAddress = (index: number) => {
  //   const updated = addresses.filter((_, i) => i !== index);
  //   if (addresses[index].isDefault && updated.length > 0) {
  //     updated[0].isDefault = true;
  //   }
  //   setAddresses(updated);
  //   setToastMessage('✅ Address deleted');
  //   setShowToast(true);
  // };


  const handleDeleteAddress = async (index: number) => {
  const updated = addresses.filter((_, i) => i !== index);
  
  // If deleted address was default, promote the first remaining one
  if (addresses[index].isDefault && updated.length > 0) {
    updated[0].isDefault = true;
  }

  try {
    await axios.put(
      `http://localhost:4000/api/v1/profile/${customer?.id}`,
      {
        name: formData.name,
        email: formData.email,
        addresses: updated,        // ✅ Send the filtered array to DB
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );

    setAddresses(updated);        // ✅ Update UI only after DB confirms
    setToastMessage('✅ Address deleted');
    setShowToast(true);
  } catch (error) {
    setToastMessage('❌ Failed to delete address');
    setShowToast(true);
  }
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
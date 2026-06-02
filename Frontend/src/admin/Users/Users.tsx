import React, { useState, useEffect } from 'react';
import { UserCheck, Loader2, User, Hash, ShieldAlert, Download } from 'lucide-react';
import axios from 'axios';
import * as XLSX from "xlsx";
import { toast, Toaster } from 'react-hot-toast';
import "./Users.css";

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/getalluser",          {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

      if (res.data.success) {
        const cleanUserDirectory = res.data.data.filter((u: any) => 
          u.role?.toLowerCase() !== 'retailer'
        );
        setUsers(cleanUserDirectory);
      }
    } catch (error) {
      console.error("Fetch directory grid runtime error:", error);
      toast.error("Failed to load user directories correctly.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleExportToExcel = () => {
  try {
    // const excelData = users.map((user, index) => ({
    //   "S.No": index + 1,
    //   "User ID": user._id,
    //   "Name": user.name || "",
    //   "Email": user.email || "no email",
    //   "Phone Number": user.phoneno || "",
    //   "Role": user.role || "customer",
    //   "Retailer Code": user.retailerCode || "N/A",
    //   "Retailer Verified": user.isRetailerVerified ? "Yes" : "No",
    //   "Total Purchases": user.totalPurchase || 0,
    //   "Current Points": user.currentPoints || 0,

    // "Street": address.street || "",
    // "City": address.city || "",
    // "State": address.state || "",
    // "Pincode": address.zipCode || "",
    // "Default Address": address.isDefault ? "Yes" : "No",

    //   "Created Date": user.createdAt
    //     ? new Date(user.createdAt).toLocaleString()
    //     : "",
    //   "Updated Date": user.updatedAt
    //     ? new Date(user.updatedAt).toLocaleString()
    //     : ""
    // }));

    const sheetData = users.map((user) => {
  const address = user.addresses?.[0] || {};

  return {
    "User ID": user._id,
    "Name": user.name || "",
    "Phone": user.phoneno || "",
    "Email": user.email || "",
    "Role": user.role || "customer",
    "Retailer Code": user.retailerCode || "N/A",
    "Retailer Verified": user.isRetailerVerified ? "Yes" : "No",
    "Total Purchases": user.totalPurchase || 0,
    "Current Points": user.currentPoints || 0,

    // Address fields
    "Street": address.street || "N/A",
    "City": address.city || "N/A",
    "State": address.state || "N/A",
    "Pincode": address.zipCode || "N/A",
    "Default Address": address.isDefault ? "Yes" : "No",

    "Created At": user.createdAt
      ? new Date(user.createdAt).toLocaleString()
      : "",
  };
});

    const worksheet = XLSX.utils.json_to_sheet(sheetData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Users"
    );

    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 28 },
      { wch: 25 },
      { wch: 30 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
      { wch: 25 }
    ];

    XLSX.writeFile(
      workbook,
      `Users_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );

    toast.success("Excel exported successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to export Excel");
  }
};

  const handleRoleChange = async (userId: string, targetUserPhone: string, newRole: string) => {
    if (targetUserPhone === "8903652269") {
      toast.error("The root Super Admin role configuration cannot be changed.");
      return;
    }

    const processToast = toast.loading("Updating access permissions...");
    try {
      const res = await axios.put(`http://localhost:4000/api/v1/update-role/${userId}`, { role: newRole }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
      if (res.data.success) {
        toast.success("Privileges shifted securely", { id: processToast });
        
        // Optimistic UI state structural adjustment mapping
        setUsers(prevUsers => 
          prevUsers.map(u => u._id === userId ? { ...u, role: newRole } : u)
        );
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Internal operation role adjustment error.";
      toast.error(errMsg, { id: processToast });
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneno?.includes(searchTerm)
  );

const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;

const currentUsers = filteredUsers.slice(
  indexOfFirstUser,
  indexOfLastUser
);

  if (loading) return (
    <div className="rasi-loading-state">
      <Loader2 className="spinner" size={40} />
      <p>Fetching User Database Directory...</p>
    </div>
  );

  return (
    <div className="rasi-users-container">
      <Toaster position="top-right" />
      <header className="rasi-users-header">
        <div className="header-info">
          <h1>User & Staff Directory</h1>
          <p className="subtitle">Manage account access designations and view workspace permissions</p>
        </div>
        <div className="header-actions">
            <span className="count-pill">{filteredUsers.length} Active Records</span>
            <div className="rasi-search-wrapper">
                {/* <Search size={18} className="search-icon" /> */}
                <input 
                    type="text" 
                    placeholder="Search name, email or phone..." 
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    onChange={(e) => {
  setSearchTerm(e.target.value);
  setCurrentPage(1);
}}
                    value={searchTerm}
                />
            </div>

            <button
  className="export-btn"
  onClick={handleExportToExcel}
>
  <Download size={16} />
  Export Excel
</button>

        </div>
      </header>

      <div className="rasi-table-wrapper">
        <div className="table-scroll">
          <table className="rasi-users-table">
            <thead>
              <tr>
                <th><Hash size={14}/> <span className="header-text">ID</span></th>
                <th><User size={14}/> <span className="header-text">User Identity</span></th>
                <th><span className="header-text">Contact Information</span></th>
                <th><span className="header-text">Total Purchases</span></th>
                <th><span className="header-text">Current Points</span></th>
                <th><span className="header-text">Privilege Level</span></th>
                {/* <th className="text-center"><span className="header-text">Management Action</span></th> */}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="no-data">No qualifying user directory items found.</td></tr>
              ) : currentUsers.map((user) => (
                <tr key={user._id}>
                  <td data-label="ID" className="id-cell">
                      <span className="id-badge">{user._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td data-label="User Identity">
                    <div className="customer-profile">
                      <span className="customer-name">{user.name}</span>
                    </div>
                  </td>
                  <td data-label="Contact Details">
                    <div className="contact-info">
                      <span className="email-row"><span className="contact-text">{user.email || 'No email registered'}</span></span>
                      <span className="phone-row"><span className="contact-text">{user.phoneno || 'N/A'}</span></span>
                    </div>
                  </td>
                    {/* <td data-label="Address">
                    <div className="contact-info">
                      <span className="email-row"><span className="contact-text">{user.addresses?.street || 'No address registered'}</span></span>
                    </div>
                  </td> */}
                    <td data-label="Total Purchases">
                    <div className="contact-info">
                      <span className="email-row"><span className="contact-text">₹{user.totalPurchase}</span></span>
                    </div>
                  </td>
                    <td data-label="Current Points">
                    <div className="contact-info">
                      <span className="email-row"><span className="contact-text">{user.currentPoints}</span></span>
                    </div>
                  </td>
                  <td data-label="Privilege Level">
                    <span className={`role-pill ${user.role || 'customer'}`}>
                      {user.role === 'admin' ? <ShieldAlert size={12} /> : <UserCheck size={12} />} 
                      <span className="badge-text">
                        {user.role || 'customer'}
                      </span>
                    </span>
                  </td>
                  {/* <td data-label="Management Action" className="text-center dynamic-action-td">
                    {user.phoneno === "8903652269" ? (
                      <span className="super-admin-lock">System Protected</span>
                    ) : (
                      <div className="select-dropdown-wrapper">
                        <select
                          className="role-select-dropdown"
                          value={user.role || 'customer'}
                          onChange={(e) => handleRoleChange(user._id, user.phoneno, e.target.value)}
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-container">
  <button
    className="pagination-btn"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => prev - 1)}
  >
    Previous
  </button>

  <span className="pagination-info">
    Page {currentPage} of {totalPages || 1}
  </span>

  <button
    className="pagination-btn"
    disabled={currentPage === totalPages || totalPages === 0}
    onClick={() => setCurrentPage((prev) => prev + 1)}
  >
    Next
  </button>
</div>
        </div>
      </div>
    </div>
  );
};

export default Users;


// import React, { useState, useEffect, useRef } from 'react';
// import {
//   UserCheck, Loader2, User, Hash, ShieldAlert, Download,
//   Plus, Eye, EyeOff, X, MapPin, Phone, Mail, Shield,
//   Lock, Home, Star, CheckCircle, UserPlus,
//   AlertCircle, Key
// } from 'lucide-react';
// import axios from 'axios';
// import * as XLSX from "xlsx";
// import { toast, Toaster } from 'react-hot-toast';
// import "./Users.css";

// interface Address {
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   isDefault: boolean;
// }

// interface UserRecord {
//   _id: string;
//   name: string;
//   phoneno: string;
//   email?: string;
//   role: string;
//   retailerCode?: string;
//   isRetailerVerified?: boolean;
//   totalPurchase?: number;
//   currentPoints?: number;
//   addresses?: Address[];
//   createdAt?: string;
// }

// const ADMIN_PASSCODE = "RASI-1995";

// /* ══════════════════════════════════════════════════════
//    ADD CREDENTIALS MODAL
// ══════════════════════════════════════════════════════ */
// const AddCredentialsModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
//   const [form, setForm] = useState({ name: '', phoneno: '', email: '', password: '', role: 'customer' });
//   const [showPass, setShowPass] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const validate = () => {
//     const e: Record<string, string> = {};
//     if (!form.name.trim()) e.name = 'Name is required';
//     if (!form.phoneno.trim() || !/^\d{10}$/.test(form.phoneno)) e.phoneno = 'Enter valid 10-digit phone';
//     if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
//     return e;
//   };

//   const handleSubmit = async () => {
//     const e = validate();
//     if (Object.keys(e).length) { setErrors(e); return; }
//     try {
//       setSaving(true);
//       await axios.post("http://localhost:4000/api/v1/register", {
//         name: form.name,
//         phoneno: form.phoneno,
//         email: form.email,
//         password: form.password,
//       }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
//       toast.success(`${form.role === 'admin' ? 'Admin' : 'User'} created successfully!`);
//       setForm({ name: '', phoneno: '', email: '', password: '', role: 'customer' });
//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to create user");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="rasi-overlay" onClick={onClose}>
//       <div className="rasi-modal-box cred-modal" onClick={e => e.stopPropagation()}>
//         <div className="rasi-modal-hdr">
//           <div className="rasi-modal-hdr-left">
//             <div className="rasi-modal-icon-wrap">
//               <UserPlus size={18} />
//             </div>
//             <div>
//               <h2 className="rasi-modal-title">Add Credentials</h2>
//               <p className="rasi-modal-sub">Create a new user or admin account</p>
//             </div>
//           </div>
//           <button className="rasi-modal-close" onClick={onClose}><X size={18} /></button>
//         </div>

//         <div className="cred-role-toggle">
//           <button
//             className={`cred-role-btn ${form.role === 'customer' ? 'active-user' : ''}`}
//             onClick={() => setForm(f => ({ ...f, role: 'customer' }))}
//           >
//             <User size={14} /> User
//           </button>
//           <button
//             className={`cred-role-btn ${form.role === 'admin' ? 'active-admin' : ''}`}
//             onClick={() => setForm(f => ({ ...f, role: 'admin' }))}
//           >
//             <ShieldAlert size={14} /> Admin
//           </button>
//         </div>

//         <div className="cred-fields">
//           <div className="cred-field">
//             <label>Full Name <span className="req">*</span></label>
//             <input
//               type="text"
//               placeholder="e.g. Rajesh Kumar"
//               value={form.name}
//               onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }}
//               className={errors.name ? 'err' : ''}
//             />
//             {errors.name && <span className="cred-err"><AlertCircle size={11} /> {errors.name}</span>}
//           </div>

//           <div className="cred-field">
//             <label>Phone Number <span className="req">*</span></label>
//             <input
//               type="text"
//               maxLength={10}
//               placeholder="10-digit mobile"
//               value={form.phoneno}
//               onChange={e => { setForm(f => ({ ...f, phoneno: e.target.value })); setErrors(er => ({ ...er, phoneno: '' })); }}
//               className={errors.phoneno ? 'err' : ''}
//             />
//             {errors.phoneno && <span className="cred-err"><AlertCircle size={11} /> {errors.phoneno}</span>}
//           </div>

//           <div className="cred-field">
//             <label>Email <span className="optional">(optional)</span></label>
//             <input
//               type="email"
//               placeholder="email@example.com"
//               value={form.email}
//               onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
//             />
//           </div>

//           <div className="cred-field">
//             <label>Password <span className="req">*</span></label>
//             <div className="cred-pass-wrap">
//               <input
//                 type={showPass ? 'text' : 'password'}
//                 placeholder="Min 6 characters"
//                 value={form.password}
//                 onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
//                 className={errors.password ? 'err' : ''}
//               />
//               <button className="pass-eye" onClick={() => setShowPass(s => !s)}>
//                 {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
//               </button>
//             </div>
//             {errors.password && <span className="cred-err"><AlertCircle size={11} /> {errors.password}</span>}
//           </div>
//         </div>

//         <div className="rasi-modal-footer">
//           <button className="rasi-btn-ghost" onClick={onClose}>Cancel</button>
//           <button className="rasi-btn-primary" onClick={handleSubmit} disabled={saving}>
//             {saving ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}
//             {saving ? 'Creating...' : `Create ${form.role === 'admin' ? 'Admin' : 'User'}`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════
//    ADMIN PASSCODE GATE
// ══════════════════════════════════════════════════════ */
// const PasscodeGate: React.FC<{ onUnlock: () => void; onClose: () => void }> = ({ onUnlock, onClose }) => {
//   const [code, setCode] = useState('');
//   const [shake, setShake] = useState(false);
//   const [showCode, setShowCode] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => { inputRef.current?.focus(); }, []);

//   const handleSubmit = () => {
//     if (code === ADMIN_PASSCODE) {
//       onUnlock();
//     } else {
//       setShake(true);
//       setCode('');
//       toast.error("Incorrect passcode");
//       setTimeout(() => setShake(false), 600);
//     }
//   };

//   return (
//     <div className="rasi-overlay" onClick={onClose}>
//       <div className={`rasi-modal-box passcode-modal ${shake ? 'shake' : ''}`} onClick={e => e.stopPropagation()}>
//         <div className="passcode-lock-icon">
//           <Lock size={32} />
//         </div>
//         <h2 className="passcode-title">Admin Access Required</h2>
//         <p className="passcode-sub">Enter the admin passcode to view privileged accounts</p>

//         <div className="cred-pass-wrap passcode-input-wrap">
//           <input
//             ref={inputRef}
//             type={showCode ? 'text' : 'password'}
//             placeholder="Enter passcode..."
//             value={code}
//             onChange={e => setCode(e.target.value)}
//             onKeyDown={e => e.key === 'Enter' && handleSubmit()}
//             className="passcode-input"
//           />
//           <button className="pass-eye" onClick={() => setShowCode(s => !s)}>
//             {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
//           </button>
//         </div>

//         <div className="rasi-modal-footer" style={{ marginTop: '1.5rem' }}>
//           <button className="rasi-btn-ghost" onClick={onClose}>Cancel</button>
//           <button className="rasi-btn-danger" onClick={handleSubmit}>
//             <Key size={14} /> Unlock Admin View
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════
//    USER DETAIL MODAL
// ══════════════════════════════════════════════════════ */
// const UserDetailModal: React.FC<{ user: UserRecord; onClose: () => void }> = ({ user, onClose }) => {
//   return (
//     <div className="rasi-overlay" onClick={onClose}>
//       <div className="rasi-modal-box detail-modal" onClick={e => e.stopPropagation()}>
//         <div className="rasi-modal-hdr">
//           <div className="rasi-modal-hdr-left">
//             <div className={`detail-avatar ${user.role}`}>
//               {user.name?.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <h2 className="rasi-modal-title">{user.name}</h2>
//               <span className={`role-pill ${user.role}`} style={{ fontSize: '0.7rem' }}>
//                 {user.role === 'admin' ? <ShieldAlert size={11} /> : <UserCheck size={11} />}
//                 {user.role}
//               </span>
//             </div>
//           </div>
//           <button className="rasi-modal-close" onClick={onClose}><X size={18} /></button>
//         </div>

//         <div className="detail-section">
//           <h4 className="detail-section-title">Contact Information</h4>
//           <div className="detail-info-grid">
//             <div className="detail-info-item">
//               <Phone size={14} className="detail-icon" />
//               <div>
//                 <label>Phone</label>
//                 <p>{user.phoneno || '—'}</p>
//               </div>
//             </div>
//             <div className="detail-info-item">
//               <Mail size={14} className="detail-icon" />
//               <div>
//                 <label>Email</label>
//                 <p>{user.email || 'No email registered'}</p>
//               </div>
//             </div>
//             <div className="detail-info-item">
//               <Star size={14} className="detail-icon" />
//               <div>
//                 <label>Loyalty Points</label>
//                 <p>{user.currentPoints ?? 0} pts</p>
//               </div>
//             </div>
//             <div className="detail-info-item">
//               <Shield size={14} className="detail-icon" />
//               <div>
//                 <label>Total Purchases</label>
//                 <p>₹{user.totalPurchase ?? 0}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="detail-section">
//           <h4 className="detail-section-title">
//             <MapPin size={14} /> Saved Addresses
//             <span className="addr-count-badge">{user.addresses?.length ?? 0}</span>
//           </h4>

//           {!user.addresses || user.addresses.length === 0 ? (
//             <div className="detail-empty-addr">
//               <MapPin size={22} />
//               <p>No addresses saved</p>
//             </div>
//           ) : (
//             <div className="detail-addr-list">
//               {user.addresses.map((addr, i) => (
//                 <div key={i} className={`detail-addr-card ${addr.isDefault ? 'is-default' : ''}`}>
//                   <div className="detail-addr-top">
//                     <Home size={14} />
//                     <span className="detail-addr-label">Address {i + 1}</span>
//                     {addr.isDefault && (
//                       <span className="default-tag">
//                         <CheckCircle size={10} /> Primary
//                       </span>
//                     )}
//                   </div>
//                   <p className="detail-addr-text">
//                     {addr.street && `${addr.street}, `}
//                     {addr.city && `${addr.city}, `}
//                     {addr.state && `${addr.state}`}
//                     {addr.zipCode && ` - ${addr.zipCode}`}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="rasi-modal-footer">
//           <span className="detail-joined">
//             Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
//           </span>
//           <button className="rasi-btn-ghost" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════
//    MAIN USERS COMPONENT
// ══════════════════════════════════════════════════════ */
// const Users: React.FC = () => {
//   const [allUsers, setAllUsers] = useState<UserRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
//   const usersPerPage = 10;

//   const [showAddCreds, setShowAddCreds] = useState(false);
//   const [showPasscodeGate, setShowPasscodeGate] = useState(false);
//   const [adminUnlocked, setAdminUnlocked] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:4000/api/v1/getalluser", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       });
//       if (res.data.success) setAllUsers(res.data.data);
//     } catch {
//       toast.error("Failed to load user directories.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   const handleTabSwitch = (tab: 'user' | 'admin') => {
//     if (tab === 'admin' && !adminUnlocked) {
//       setShowPasscodeGate(true);
//       return;
//     }
//     setActiveTab(tab);
//     setCurrentPage(1);
//     setSearchTerm('');
//   };

//   const handleAdminUnlock = () => {
//     setAdminUnlocked(true);
//     setShowPasscodeGate(false);
//     setActiveTab('admin');
//     setCurrentPage(1);
//     setSearchTerm('');
//     toast.success("Admin view unlocked");
//   };

//   const tabFiltered = allUsers.filter(u => {
//     if (activeTab === 'user') return u.role?.toLowerCase() !== 'admin' && u.role?.toLowerCase() !== 'retailer';
//     if (activeTab === 'admin') return u.role?.toLowerCase() === 'admin';
//     return true;
//   });

//   const filteredUsers = tabFiltered.filter(u =>
//     u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.phoneno?.includes(searchTerm)
//   );

//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
//   const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

//   const handleExportToExcel = () => {
//     try {
//       const sheetData = filteredUsers.map(user => {
//         const address = user.addresses?.[0] || {} as Address;
//         return {
//           "User ID": user._id,
//           "Name": user.name || "",
//           "Phone": user.phoneno || "",
//           "Email": user.email || "",
//           "Role": user.role || "customer",
//           "Total Purchases": user.totalPurchase || 0,
//           "Current Points": user.currentPoints || 0,
//           "Street": (address as Address).street || "N/A",
//           "City": (address as Address).city || "N/A",
//           "State": (address as Address).state || "N/A",
//           "Pincode": (address as Address).zipCode || "N/A",
//           "Created At": user.createdAt ? new Date(user.createdAt).toLocaleString() : "",
//         };
//       });
//       const ws = XLSX.utils.json_to_sheet(sheetData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, activeTab === 'admin' ? 'Admins' : 'Users');
//       ws["!cols"] = Array(12).fill({ wch: 20 });
//       XLSX.writeFile(wb, `${activeTab === 'admin' ? 'Admins' : 'Users'}_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
//       toast.success("Excel exported successfully");
//     } catch {
//       toast.error("Failed to export Excel");
//     }
//   };

//   if (loading) return (
//     <div className="rasi-loading-state">
//       <Loader2 className="spinner" size={40} />
//       <p>Fetching User Database Directory...</p>
//     </div>
//   );

//   return (
//     <div className="rasi-users-container">
//       <Toaster position="top-right" />

//       <header className="rasi-users-header">
//         <div className="header-info">
//           <h1>User & Staff Directory</h1>
//           <p className="subtitle">Manage account access designations and view workspace permissions</p>
//         </div>
//         <div className="header-actions">
//           <span className="count-pill">{filteredUsers.length} Records</span>
//           <div className="rasi-search-wrapper">
//             <input
//               type="text"
//               placeholder="Search name, email or phone..."
//               value={searchTerm}
//               onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//             />
//           </div>
//           <button className="export-btn" onClick={handleExportToExcel}>
//             <Download size={16} /> Export Excel
//           </button>
//           <button className="add-creds-btn" onClick={() => setShowAddCreds(true)}>
//             <Plus size={16} /> Add Credentials
//           </button>
//         </div>
//       </header>

//       {/* Tab Bar */}
//       <div className="rasi-tab-bar">
//         <button
//           className={`rasi-tab-btn ${activeTab === 'user' ? 'active' : ''}`}
//           onClick={() => handleTabSwitch('user')}
//         >
//           <User size={15} /> Users
//           <span className="tab-count">
//             {allUsers.filter(u => u.role?.toLowerCase() !== 'admin' && u.role?.toLowerCase() !== 'retailer').length}
//           </span>
//         </button>
//         <button
//           className={`rasi-tab-btn ${activeTab === 'admin' ? 'active admin-tab' : ''}`}
//           onClick={() => handleTabSwitch('admin')}
//         >
//           <ShieldAlert size={15} /> Admin
//           {!adminUnlocked
//             ? <Lock size={12} className="tab-lock-icon" />
//             : <span className="tab-count admin">{allUsers.filter(u => u.role?.toLowerCase() === 'admin').length}</span>
//           }
//         </button>
//       </div>

//       {/* Table */}
//       <div className="rasi-table-wrapper">
//         <div className="table-scroll">
//           <table className="rasi-users-table">
//             <thead>
//               <tr>
//                 <th><Hash size={14} /><span className="header-text">ID</span></th>
//                 <th><User size={14} /><span className="header-text">User Identity</span></th>
//                 <th><span className="header-text">Contact Information</span></th>
//                 <th><span className="header-text">Total Purchases</span></th>
//                 <th><span className="header-text">Current Points</span></th>
//                 <th><span className="header-text">Privilege Level</span></th>
//                 <th><span className="header-text">Details</span></th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentUsers.length === 0 ? (
//                 <tr><td colSpan={7} className="no-data">No records found.</td></tr>
//               ) : currentUsers.map(user => (
//                 <tr key={user._id}>
//                   <td data-label="ID"><span className="id-badge">{user._id.slice(-6).toUpperCase()}</span></td>
//                   <td data-label="User Identity"><span className="customer-name">{user.name}</span></td>
//                   <td data-label="Contact Details">
//                     <div className="contact-info">
//                       <span className="email-row">{user.email || 'No email'}</span>
//                       <span className="phone-row">{user.phoneno || 'N/A'}</span>
//                     </div>
//                   </td>
//                   <td data-label="Total Purchases">₹{user.totalPurchase ?? 0}</td>
//                   <td data-label="Current Points">{user.currentPoints ?? 0}</td>
//                   <td data-label="Privilege Level">
//                     <span className={`role-pill ${user.role || 'customer'}`}>
//                       {user.role === 'admin' ? <ShieldAlert size={12} /> : <UserCheck size={12} />}
//                       <span className="badge-text">{user.role || 'customer'}</span>
//                     </span>
//                   </td>
//                   <td data-label="Details">
//                     <button className="eye-btn" onClick={() => setSelectedUser(user)} title="View full details">
//                       <Eye size={15} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="pagination-container">
//             <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
//             <span className="pagination-info">Page {currentPage} of {totalPages || 1}</span>
//             <button className="pagination-btn" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
//           </div>
//         </div>
//       </div>

//       {showAddCreds && <AddCredentialsModal onClose={() => setShowAddCreds(false)} onSuccess={fetchUsers} />}
//       {showPasscodeGate && <PasscodeGate onUnlock={handleAdminUnlock} onClose={() => setShowPasscodeGate(false)} />}
//       {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
//     </div>
//   );
// };

// export default Users;
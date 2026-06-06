import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Loader2, 
  User, 
  Hash, 
  ShieldAlert, 
  Download, 
  Plus, 
  X, 
  Eye,
  EyeOff,
  Lock,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from "xlsx";
import { toast, Toaster } from 'react-hot-toast';
import "./Users.css";

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'users' | 'admins'>('users');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminAccessGranted, setAdminAccessGranted] = useState(false);
  const [adminPasscodeError, setAdminPasscodeError] = useState('');
  
  // Modals
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPasscode, setShowPasscode] = useState(false);
  
  // Form states
  const [credentialForm, setCredentialForm] = useState({
    name: '',
    phoneno: '',
    password: '',
    role: 'customer'
  });
  const [credentialLoading, setCredentialLoading] = useState(false);
  
  const usersPerPage = 10;

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/users-list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/admins-list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.data.success) {
        setAdmins(res.data.data);
      }
    } catch (error) {
      console.error("Fetch admins error:", error);
      toast.error("Failed to load admins");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Tab Change
  const handleTabChange = (tab: 'users' | 'admins') => {
    if (tab === 'admins' && !adminAccessGranted) {
      setActiveTab('admins');
      // Passcode prompt will show via modal
    } else {
      setActiveTab(tab);
      fetchAdmins();
    }
    setCurrentPage(1);
  };

  // Handle Admin Passcode
  const handleAdminPasscode = () => {
    if (adminPasscode === 'RASI-1995') {
      setAdminAccessGranted(true);
      setAdminPasscodeError('');
      fetchAdmins();
      setAdminPasscode('');
    } else {
      setAdminPasscodeError('Invalid passcode. Access denied.');
      setAdminPasscode('');
    }
  };

  // Create Credential
  const handleCreateCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentialForm.name || !credentialForm.phoneno || !credentialForm.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (credentialForm.phoneno.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    setCredentialLoading(true);
    const toastId = toast.loading("Creating credential...");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/create-credential",
        {
          name: credentialForm.name,
          phoneno: credentialForm.phoneno,
          password: credentialForm.password,
          role: credentialForm.role
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setShowCredentialModal(false);
        setCredentialForm({ name: '', phoneno: '', password: '', role: 'customer' });
        
        // Refresh data
        if (credentialForm.role === 'customer') {
          fetchUsers();
        } else {
          fetchAdmins();
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create credential";
      toast.error(message, { id: toastId });
    } finally {
      setCredentialLoading(false);
    }
  };

  // Get User Details
  const handleViewDetails = async (userId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/user-details/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (res.data.success) {
        setSelectedUser(res.data.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };

  // Export to Excel
  const handleExportToExcel = () => {
    try {
      const dataToExport = activeTab === 'users' ? users : admins;

      const sheetData = dataToExport.map((item) => {
        const address = item.addresses?.[0] || {};
        return {
          "ID": item._id,
          "Name": item.name || "",
          "Phone": item.phoneno || "",
          "Email": item.email || "",
          "Role": item.role || "N/A",
          "Total Purchases": item.totalPurchase || 0,
          "Current Points": item.currentPoints || 0,
          "Street": address.street || "N/A",
          "City": address.city || "N/A",
          "State": address.state || "N/A",
          "Pincode": address.zipCode || "N/A",
          "Created At": item.createdAt ? new Date(item.createdAt).toLocaleString() : "",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, activeTab === 'users' ? "Users" : "Admins");

      worksheet["!cols"] = [
        { wch: 25 },
        { wch: 20 },
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 18 },
        { wch: 18 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 20 }
      ];

      XLSX.writeFile(
        workbook,
        `${activeTab === 'users' ? 'Users' : 'Admins'}_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      toast.success("Excel exported successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export Excel");
    }
  };

  // Filtering and Pagination
  const dataToDisplay = activeTab === 'users' ? users : admins;
  const filteredData = dataToDisplay.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phoneno?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredData.length / usersPerPage);
  const indexOfLastItem = currentPage * usersPerPage;
  const indexOfFirstItem = indexOfLastItem - usersPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return (
    <div className="rasi-loading-state">
      <Loader2 className="spinner" size={40} />
      <p>Fetching User Database Directory...</p>
    </div>
  );

  return (
    <div className="rasi-users-container">
      <Toaster position="top-right" />

      {/* Admin Passcode Modal */}
      {activeTab === 'admins' && !adminAccessGranted && (
        <div className="modal-overlay active">
          <div className="modal-content passcode-modal">
            <div className="modal-header">
              <Lock size={24} />
              <h3>Admin Access Required</h3>
            </div>
            <p className="modal-subtitle">Enter passcode to access admin panel</p>
            {/* <input
              type="password"
              placeholder="Enter passcode"
              value={adminPasscode}
              onChange={(e) => {
                setAdminPasscode(e.target.value);
                setAdminPasscodeError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminPasscode()}
              className="passcode-input"
            /> */}

            <div className="passcode-input-wrapper">
  <input
    type={showPasscode ? "text" : "password"}
    placeholder="Enter passcode"
    value={adminPasscode}
    onChange={(e) => {
      setAdminPasscode(e.target.value);
      setAdminPasscodeError('');
    }}
    onKeyDown={(e) =>
      e.key === 'Enter' && handleAdminPasscode()
    }
    className="passcode-input"
  />

  <button
    type="button"
    className="toggle-password"
    onClick={() => setShowPasscode(!showPasscode)}
  >
    {showPasscode ? (
      <EyeOff size={18} />
    ) : (
      <Eye size={18} />
    )}
  </button>
</div>
            {adminPasscodeError && (
              <div className="error-message">
                <AlertCircle size={16} />
                {adminPasscodeError}
              </div>
            )}
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setActiveTab('users');
                  setAdminPasscode('');
                  setAdminPasscodeError('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleAdminPasscode}
                disabled={!adminPasscode}
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credential Creation Modal */}
      {showCredentialModal && (
        <div className="modal-overlay active">
          <div className="modal-content credential-modal">
            <button
              className="modal-close"
              onClick={() => setShowCredentialModal(false)}
            >
              <X size={24} />
            </button>

            <div className="modal-header">
              <Plus size={24} />
              <h3>Add New Credential</h3>
            </div>

            <form onSubmit={handleCreateCredential} className="credential-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={credentialForm.name}
                  onChange={(e) => setCredentialForm({ ...credentialForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="10-digit phone number"
                  maxLength={10}
                  value={credentialForm.phoneno}
                  onChange={(e) => setCredentialForm({ ...credentialForm, phoneno: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={credentialForm.password}
                  onChange={(e) => setCredentialForm({ ...credentialForm, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  value={credentialForm.role}
                  onChange={(e) => setCredentialForm({ ...credentialForm, role: e.target.value })}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCredentialModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={credentialLoading}
                >
                  {credentialLoading ? 'Creating...' : 'Create Credential'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetailModal && selectedUser && (
        <div className="modal-overlay active">
          <div className="modal-content detail-modal">
            <button
              className="modal-close"
              onClick={() => setShowDetailModal(false)}
            >
              <X size={24} />
            </button>

            <div className="modal-header">
              <User size={24} />
              <h3>User Details</h3>
            </div>

            <div className="detail-content">
              <div className="detail-row">
                <span className="detail-label">ID</span>
                <span className="detail-value">{selectedUser._id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Name</span>
                <span className="detail-value">{selectedUser.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{selectedUser.phoneno}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span className="detail-value">{selectedUser.email || 'Not provided'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role</span>
                <span className={`detail-value role-badge ${selectedUser.role}`}>
                  {selectedUser.role}
                </span>
              </div>
              {selectedUser.totalPurchase && (
                <div className="detail-row">
                  <span className="detail-label">Total Purchases</span>
                  <span className="detail-value">₹{selectedUser.totalPurchase}</span>
                </div>
              )}
              {selectedUser.currentPoints !== undefined && (
                <div className="detail-row">
                  <span className="detail-label">Current Points</span>
                  <span className="detail-value">{selectedUser.currentPoints}</span>
                </div>
              )}
              {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">
                    {selectedUser.addresses[0].street}, {selectedUser.addresses[0].city}, {selectedUser.addresses[0].state} - {selectedUser.addresses[0].zipCode}
                  </span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Created At</span>
                <span className="detail-value">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="rasi-users-header">
        <div className="header-info">
          <h1>{activeTab === 'users' ? 'User Directory' : 'Admin Panel'}</h1>
          <p className="subtitle">
            {activeTab === 'users' 
              ? 'Manage and view all registered users' 
              : 'Manage and view all admin accounts'}
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn-add-credential"
            onClick={() => setShowCredentialModal(true)}
          >
            <Plus size={18} />
            Add Credential
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabChange('users')}
        >
          <User size={16} />
          Users ({users.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => handleTabChange('admins')}
        >
          <ShieldAlert size={16} />
          Admins ({admins.length})
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
          <span className="count-badge">{filteredData.length} records</span>
        </div>
        <button
          className="btn-export"
          onClick={handleExportToExcel}
        >
          <Download size={16} />
          Export Excel
        </button>
      </div>

      {/* Table */}
      <div className="rasi-table-wrapper">
        <div className="table-scroll">
          <table className="rasi-users-table">
            <thead>
              <tr>
                <th><Hash size={14} /> ID</th>
                <th><User size={14} /> Name</th>
                <th>Contact</th>
                {activeTab === 'users' && (
                  <>
                    <th>Total Purchases</th>
                    <th>Points</th>
                  </>
                )}
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'users' ? 7 : 6} className="no-data">
                    No {activeTab === 'users' ? 'users' : 'admins'} found
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item._id}>
                    <td data-label="ID">
                      <span className="id-badge">{item._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td data-label="Name" className="name-cell">
                      {item.name}
                    </td>
                    <td data-label="Contact" className="contact-cell">
                      <div className="contact-stack">
                        <span>{item.email || 'No email'}</span>
                        <span className="secondary">{item.phoneno}</span>
                      </div>
                    </td>
                    {activeTab === 'users' && (
                      <>
                        <td data-label="Total Purchases">
                          ₹{item.totalPurchase || 0}
                        </td>
                        <td data-label="Points">
                          {item.currentPoints || 0}
                        </td>
                      </>
                    )}
                    <td data-label="Role">
                      <span className={`role-pill ${item.role}`}>
                        {item.role === 'admin' ? <ShieldAlert size={12} /> : <UserCheck size={12} />}
                        {item.role}
                      </span>
                    </td>
                    <td data-label="Action" className="action-cell">
                      <button
                        className="btn-view-details"
                        onClick={() => handleViewDetails(item._id)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;
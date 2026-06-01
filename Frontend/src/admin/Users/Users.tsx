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
                <th className="text-center"><span className="header-text">Management Action</span></th>
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
                  <td data-label="Management Action" className="text-center dynamic-action-td">
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
                  </td>
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
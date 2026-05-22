import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Loader2, Mail, Phone, Calendar, User, Hash } from 'lucide-react';
import axios from 'axios';
import "./Users.css";

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/getalluser");
      console.log(res)
      if (res.data.success) {
        // FILTER: Only show customers
        const customerOnly = res.data.data.filter((u: any) => 
            u.role?.toLowerCase() === 'customer' || !u.role
        );
        setUsers(customerOnly);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="rasi-loading-state">
      <Loader2 className="spinner" size={40} />
      <p>Fetching Customer Database...</p>
    </div>
  );

  return (
    <div className="rasi-users-container">
      <header className="rasi-users-header">
        <div className="header-info">
          <h1>Customer Directory</h1>
          <p className="subtitle">Manage and view your bakery's registered customers</p>
        </div>
        <div className="header-actions">
            <span className="count-pill">{filteredUsers.length} Customers</span>
            <div className="rasi-search-wrapper">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
            </div>
        </div>
      </header>

      <div className="rasi-table-wrapper">
        <div className="table-scroll">
          <table className="rasi-users-table">
            <thead>
              <tr>
                <th><Hash size={14}/> <span className="header-text">ID</span></th>
                <th><User size={14}/> <span className="header-text">Customer</span></th>
                <th><span className="header-text">Contact Details</span></th>
                <th><span className="header-text">Joined Date</span></th>
                <th className="text-center"><span className="header-text">Status</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="no-data">No customers found matching your criteria.</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td data-label="ID" className="id-cell">
                      <span className="id-badge">{user._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td data-label="Customer">
                    <div className="customer-profile">
                      <span className="customer-name">{user.name}</span>
                    </div>
                  </td>
                  <td data-label="Contact">
                    <div className="contact-info">
                      <span className="email-row"><Mail size={12} /> <span className="contact-text">{user.email}</span></span>
                      <span className="phone-row"><Phone size={12} /> <span className="contact-text">{user.phoneno || 'N/A'}</span></span>
                    </div>
                  </td>
                  <td data-label="Joined">
                    <div className="date-row">
                      <Calendar size={12} />
                      <span className="date-text">{new Date(user.createdAt).toLocaleDateString('en-IN', { 
                        day: '2-digit', month: 'short', year: 'numeric' 
                      })}</span>
                    </div>
                  </td>
                  <td data-label="Status" className="text-center">
                    <span className="status-badge">
                      <UserCheck size={12} /> <span className="badge-text">Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
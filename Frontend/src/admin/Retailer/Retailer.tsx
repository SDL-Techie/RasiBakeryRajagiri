import React, { useState, useEffect } from 'react';
import { 
  User, Key, Copy, Loader2, Ticket, CheckCircle2, 
  AlertCircle, Search, Mail, Phone, Calendar, Hash, Plus, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './Retailer.css';

const Retailer: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [accessCodes, setAccessCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'registered' | 'codes'>('registered');

  // Form States
  const [assignedTo, setAssignedTo] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = "http://localhost:4000/api/v1";

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Users & Filter Retailers
      const userRes = await axios.get(`${API_BASE}/getalluser`);
      if (userRes.data.success) {
        const retailers = userRes.data.data.filter((u: any) => u.role?.toLowerCase() === 'retailer');
        setUsers(retailers);
      }

      // 2. Fetch Access Codes
      const codesRes = await axios.get(`${API_BASE}/allcodes`);
      if (codesRes.data.success) {
        setAccessCodes(codesRes.data.data);
      }
    } catch (error) {
      toast.error("Failed to sync with database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/createretailercode`, { assignedTo, code: manualCode });
      if (res.data.success) {
        toast.success("Access Code Generated");
        setAssignedTo(''); setManualCode(''); setShowForm(false);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Generation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code Copied: " + text);
  };

  const filteredData = view === 'registered' 
    ? users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    : accessCodes.filter(c => c.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return (
    <div className="rasi-loading-state">
      <Loader2 className="spinner" size={40} />
      <p>Syncing Retailer Network...</p>
    </div>
  );

  return (
    <div className="rasi-retailer-container">
      <Toaster position="top-right" />
      
      <header className="rasi-retailer-header">
        <div className="header-info">
          <h1>Retailer Management</h1>
          <div className="tab-group">
            <button className={view === 'registered' ? 'active' : ''} onClick={() => setView('registered')}>Registered</button>
            <button className={view === 'codes' ? 'active' : ''} onClick={() => setView('codes')}>Code Inventory</button>
          </div>
        </div>

        <div className="header-actions">
          <div className="rasi-search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder={`Search ${view}...`} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <button className="generate-btn" onClick={() => setShowForm(true)}>
            <Plus size={18} /> <span className="btn-label">Generate Code</span>
          </button>
        </div>
      </header>

      {/* Slide-down Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="generation-form-card" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div className="form-inner">
               <div className="form-header">
                  <h3><Ticket size={18}/> New Access Code</h3>
                  <X size={20} className="close-form" onClick={() => setShowForm(false)}/>
               </div>
               <form onSubmit={handleCreateCode} className="retailer-inline-form">
                  <div className="input-field">
                    <User size={16} />
                    <input type="text" placeholder="Recipient (e.g. Metro Sweets)" required value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
                  </div>
                  <div className="input-field">
                    <Key size={16} />
                    <input type="text" placeholder="Unique Code" required value={manualCode} onChange={(e) => setManualCode(e.target.value.toUpperCase())} />
                  </div>
                  <button type="submit" disabled={submitting} className="form-submit-btn">
                    {submitting ? <Loader2 className="spinner" size={16} /> : "Save Code"}
                  </button>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Table */}
      <div className="rasi-table-wrapper rasi-desktop-table">
        <table className="rasi-retailer-table">
          <thead>
            {view === 'registered' ? (
              <tr>
                <th><Hash size={14}/> ID</th>
                <th>Retailer / Shop</th>
                <th>Contact info</th>
                <th>Reg. Date</th>
                <th className="text-center">Status</th>
              </tr>
            ) : (
              <tr>
                <th>Recipient</th>
                <th>Access Code</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            )}
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr><td colSpan={5} className="no-data">No records found.</td></tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item._id}>
                  {view === 'registered' ? (
                    <>
                      <td className="id-cell"><span>{item._id.slice(-6).toUpperCase()}</span></td>
                      <td>
                        <div className="profile-box">
                          <span className="main-name">{item.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="contact-stack">
                           <span><Mail size={12}/> {item.email}</span>
                           <span><Phone size={12}/> {item.phoneno || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="date-row"><Calendar size={12}/> {new Date(item.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="text-center">
                        <span className="badge-active">Verified Retailer</span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="main-name">{item.assignedTo}</td>
                      <td><code className="code-pill">{item.code}</code></td>
                      <td>
                        {item.isUsed ? 
                          <span className="status-tag used"><CheckCircle2 size={12}/> Redeemed</span> : 
                          <span className="status-tag available"><AlertCircle size={12}/> Available</span>
                        }
                      </td>
                      <td className="text-center">
                        <button className="copy-action" onClick={() => copyToClipboard(item.code)}><Copy size={16}/></button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="rasi-mobile-cards">
        {filteredData.length === 0 ? (
          <div className="no-data-card">No records found.</div>
        ) : (
          filteredData.map((item) => (
            <div className="rasi-card" key={item._id}>
              {view === 'registered' ? (
                <>
                  <div className="card-top">
                    <span className="main-name">{item.name}</span>
                    <span className="badge-active">Verified</span>
                  </div>
                  <div className="card-row"><Mail size={13}/> {item.email}</div>
                  <div className="card-row"><Phone size={13}/> {item.phoneno || 'N/A'}</div>
                  <div className="card-footer">
                    <span className="id-badge">#{item._id.slice(-6).toUpperCase()}</span>
                    <div className="card-row"><Calendar size={13}/> {new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="card-top">
                    <span className="main-name">{item.assignedTo}</span>
                    {item.isUsed ? 
                      <span className="status-tag used"><CheckCircle2 size={12}/> Redeemed</span> : 
                      <span className="status-tag available"><AlertCircle size={12}/> Available</span>
                    }
                  </div>
                  <div className="card-code-row">
                    <code className="code-pill">{item.code}</code>
                    <button className="copy-action" onClick={() => copyToClipboard(item.code)}><Copy size={16}/></button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Retailer;
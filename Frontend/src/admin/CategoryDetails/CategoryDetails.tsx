import React, { useState, useEffect } from 'react';
import { Loader2, Search, Trash2, Layers, AlertCircle, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import './CategoryDetail.css';
import { motion, AnimatePresence } from 'framer-motion';


const API_URL = "http://localhost:4000/api/v1/category";

interface Category {
  _id: string;
  name: string;
  image: string;
  status: string;
  createdAt: string;
}

const CategoryDetails: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch categories");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Inside CategoryDetails component...

const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

const confirmDelete = async () => {
  if (!deleteTarget) return;

  try {
    const response = await axios.delete(`${API_URL}/delete/${deleteTarget.id}`);
    if (response.data.success) {
      setCategories((prev) => prev.filter((cat) => cat._id !== deleteTarget.id));
      setDeleteTarget(null); // Close modal
    }
  } catch (err: any) {
    alert(err.response?.data?.message || "Delete failed");
  }
};

  return (
    <div className="rasi-products-container">
      {/* Header Section */}
      <div className="rasi-products-header">
        <div className="header-info">
          <h1>Category Management</h1>
          <p className="subtitle">Organize and manage your bakery product types</p>
        </div>
        
        <div className="header-actions">
          <div className="count-pill">
            <Layers size={16} />
            {categories.length} Total Categories
          </div>
          <div className="rasi-search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search category name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="refresh-icon-btn" onClick={fetchCategories} title="Refresh Data">
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="rasi-table-wrapper">
        <table className="rasi-products-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Category Name</th>
              <th className="hide-on-mobile">Internal ID</th>
              <th>Status</th>
              <th className="hide-on-mobile">Added Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="table-loader-cell">
                  <Loader2 className="animate-spin" /> 
                  <span>Fetching Bakery Categories...</span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="table-error-cell">
                  <AlertCircle size={20} /> {error}
                </td>
              </tr>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <tr key={cat._id}>
                  <td data-label="Preview">
                    <div className="product-profile">
                      <img src={cat.image} alt={cat.name} className="product-img-small" />
                    </div>
                  </td>
                  <td data-label="Category Name">
                    <span className="product-name">{cat.name}</span>
                  </td>
                  <td data-label="ID" className="hide-on-mobile">
                    <code className="id-code">#CAT-{cat._id.slice(-5).toUpperCase()}</code>
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge ${cat.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                      {cat.status || 'Active'}
                    </span>
                  </td>
                  <td data-label="Added Date" className="hide-on-mobile">
                    {new Date(cat.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td data-label="Actions">
                    <button 
                    onClick={() => setDeleteTarget({ id: cat._id, name: cat.name })}
                    className="rasi-btn-delete" title="Delete Category">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-table-cell">No categories found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* --- DELETE CONFIRMATION MODAL --- */}
<AnimatePresence>
  {deleteTarget && (
    <div className="modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="rasi-delete-modal"
      >
        <div className="modal-icon">
          <AlertCircle size={40} color="#ef4444" />
        </div>
        <h3>Delete Category?</h3>
        <p>Are you sure you want to remove <strong>{deleteTarget.name}</strong>? This action cannot be undone.</p>
        
        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={confirmDelete}>
            Yes, Delete
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </div>
  );
};

export default CategoryDetails;
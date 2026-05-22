import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Loader2, ChevronLeft, ChevronRight, Package, Layers, Tag, Edit3, X, Save } from 'lucide-react';
import axios from 'axios';
import './ProductDetails.css';

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  category: Category | null;
  price: string;
  wholesaleprice: string;
  oldprice?: string;
  description?: string;
  productimage: string;
  status: string;
}

const ProductDetails: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Update State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const BASE_URL = "http://localhost:4000/api/v1";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      //console.log(response)
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // ✅ Handle Final Update Submission
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setUpdatingId(editingProduct._id);
    try {
      const response = await axios.put(`${BASE_URL}/product/${editingProduct._id}`, editingProduct);
      if (response.data.success) {
        setProducts(products.map(p => p._id === editingProduct._id ? response.data.data : p));
        setShowEditModal(false);
        setEditingProduct(null);
      }
    } catch (error) {
      alert("Update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      setUpdatingId(productId);
      const response = await axios.put(`${BASE_URL}/product/${productId}`, { status: newStatus });
      if (response.data.success) {
        setProducts(products.map(p => p._id === productId ? { ...p, status: newStatus } : p));
      }
    } catch (error) {
      alert("Status update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="rasi-products-container">
      <div className="rasi-products-header">
        <div className="header-info">
          <h1>Inventory Management</h1>
          <p className="subtitle">Update bakery product details and pricing</p>
        </div>
        
        <div className="header-actions">
          <div className="count-pill">
            <Package size={14} />
            <span>{filteredProducts.length} Items</span>
          </div>
          <div className="rasi-search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
      </div>
      
      <div className="rasi-table-wrapper">
        {loading ? (
          <div className="rasi-loading-state">
            <Loader2 className="spinner" size={40} />
            <span>Syncing Database...</span>
          </div>
        ) : (
          <>
            <table className="rasi-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="hide-on-mobile">Category</th>
                  <th>Retail Price</th>
                  <th className="hide-on-mobile">Wholesale</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-profile">
                        <img src={p.productimage || '/placeholder.png'} alt={p.name} className="product-img-small" />
                        <div className="product-meta">
                          <span className="product-name">{p.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="hide-on-mobile">
                      <span className="category-tag">{p.category?.name || 'General'}</span>
                    </td>
                    <td><span className="price-text">₹{p.price}</span></td>
                    <td className="hide-on-mobile price-text secondary">₹{p.wholesaleprice}</td>
                    <td>
                      <select 
                        value={p.status} 
                        onChange={(e) => handleStatusChange(p._id, e.target.value)}
                        className={`status-select-custom ${p.status.toLowerCase().replace(/\s/g, '-')}`}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </td>
                    <td>
                      <button className="rasi-btn-edit" onClick={() => { setEditingProduct(p); setShowEditModal(true); }}>
                        <Edit3 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


  <div className="pagination-wrapper">
  <button
    className="pagination-btn"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(prev => prev - 1)}
  >
    <ChevronLeft size={18} />
  </button>

  <span className="pagination-text">
    Page {currentPage} of {totalPages}
  </span>

  <button
    className="pagination-btn"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(prev => prev + 1)}
  >
    <ChevronRight size={18} />
  </button>
</div>
            
            {/* ... Keep your Pagination Logic ... */}
          </>
        )}
      </div>

      {/* ✅ Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="rasi-modal-overlay">
          <div className="rasi-edit-modal">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button onClick={() => setShowEditModal(false)}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="rasi-edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name</label>
                  <input 
                    type="text" 
                    value={editingProduct.name} 
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Retail Price (₹)</label>
                    <input 
                      type="number" 
                      value={editingProduct.price} 
                      onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Wholesale (₹)</label>
                    <input 
                      type="number" 
                      value={editingProduct.wholesaleprice} 
                      onChange={(e) => setEditingProduct({...editingProduct, wholesaleprice: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    rows={3}
                    value={editingProduct.description} 
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={updatingId !== null}>
                  {updatingId ? <Loader2 size={18} className="spinner" /> : <><Save size={18}/> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
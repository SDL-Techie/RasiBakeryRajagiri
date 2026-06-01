import React, { useState, useEffect } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight, Package, Edit3, X, Save } from 'lucide-react';
import axios from 'axios';
import './ProductDetails.css';
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  image?: string;
  status?: string;
  createdAt?: string;
}

interface Product {
  _id: string;
  name: string;
  category: Category | string | null; // Can be a populated object or an ID string
  price: string;
  wholesaleprice: string;
  oldprice?: string;
  description?: string;
  productimage: string;
  status: string;
}

const ProductDetails: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Added categories state
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

  // Concurrent fetch for products and category data dropdown options
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${BASE_URL}/products`),
        axios.get(`${BASE_URL}/category`)
      ]);

      if (productsRes.data.success) {
        setProducts(productsRes.data.data);
      }
      if (categoriesRes.data.success) {
        // Filter out inactive categories if preferred, or keep all
        setCategories(categoriesRes.data.data);
      }
    } catch (error) {
      console.error("Error syncing dashboard inventory metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchInitialData(); 
  }, []);


  const handleExportToExcel = () => {
  if (filteredProducts.length === 0) {
    alert("No products available to export");
    return;
  }

  const sheetData = filteredProducts.map((product) => ({
    "Product Name": product.name,
    "Category": getCategoryName(product.category),
    "Retail Price": product.price,
    "Wholesale Price": product.wholesaleprice,
    "Old Price": product.oldprice || "",
    "Description": product.description || "",
    "Status": product.status,
    "Image URL": product.productimage || ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(sheetData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Products"
  );

  worksheet["!cols"] = [
    { wch: 30 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 50 },
    { wch: 15 },
    { wch: 50 }
  ];

  XLSX.writeFile(
    workbook,
    `Products_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};

  // Safe helper utility to display the category name reliably on the table rows
  const getCategoryName = (categoryField: Category | string | null): string => {
    if (!categoryField) return 'General';
    if (typeof categoryField === 'object') {
      return categoryField.name || 'General';
    }
    // Fallback look-up lookup match if state holds a flat ID string reference
    const matchedCat = categories.find(c => c._id === categoryField);
    return matchedCat ? matchedCat.name : 'General';
  };

  // Safe helper utility to get the category ID for value matching inside select elements
  const getCategoryId = (categoryField: Category | string | null): string => {
    if (!categoryField) return '';
    return typeof categoryField === 'object' ? categoryField._id : categoryField;
  };

  // ✅ Handle Final Update Submission
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setUpdatingId(editingProduct._id);
    try {
      // Ensure we send down the category payload correctly structured (as an ID string string reference)
      const payload = {
        ...editingProduct,
        category: getCategoryId(editingProduct.category) || null
      };

      const response = await axios.put(`${BASE_URL}/product/${editingProduct._id}`, payload , {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
      
      if (response.data.success) {
        // Map back update directly inline or re-trigger fetchInitialData() for structural consistency
        setProducts(products.map(p => p._id === editingProduct._id ? response.data.data : p));
        setShowEditModal(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error(error);
      alert("Update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      setUpdatingId(productId);
      const response = await axios.put(`${BASE_URL}/product/${productId}`, { status: newStatus }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
      if (response.data.success) {
        setProducts(products.map(p => p._id === productId ? { ...p, status: newStatus } : p));
      }
    } catch (error) {
      alert("Status update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const pName = p.name.toLowerCase();
    const catName = getCategoryName(p.category).toLowerCase();
    const query = searchTerm.toLowerCase();
    return pName.includes(query) || catName.includes(query);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  return (
    <div className="rasi-products-container">
      <div className="rasi-products-header">
        <div className="header-info">
          <h1>Product Management</h1>
          <p className="subtitle">Update bakery product details and pricing</p>
        </div>
        
        <div className="header-actions">
          <div className="count-pill">
            <Package size={14} />
            <span>{filteredProducts.length} Items</span>
          </div>
          <button
  className="export-btn"
  onClick={handleExportToExcel}
>
  <Download size={16} />
  Export
</button>
          <div className="rasi-search-wrapper">
            {/* <Search size={18} /> */}
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
                  <th>Price</th>
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
                      <span className="category-tag">{getCategoryName(p.category)}</span>
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
          </>
        )}
      </div>

      {/* ✅ Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="rasi-modal-overlay">
          <div className="rasi-edit-modal">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button style={{color: 'white', border: 'none', cursor: 'pointer'}} onClick={() => setShowEditModal(false)}><X size={20}/></button>
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

                {/* ✅ Category Dropdown Selector Section Added */}
                <div className="form-group">
                  <label>Product Category</label>
                  <select
                    className="modal-category-select"
                    value={getCategoryId(editingProduct.category)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                      marginTop: '4px',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="">Select a Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
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
                    value={editingProduct.description || ''} 
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
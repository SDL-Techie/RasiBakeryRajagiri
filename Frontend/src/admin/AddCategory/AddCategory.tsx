import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader2, Image as ImageIcon, CheckCircle2, AlertCircle, X } from 'lucide-react';
import axios from "axios";
import './AddCategory.css';

const API_URL = "http://localhost:4000/api/v1/category";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dyggibpsi/image/upload";
const UPLOAD_PRESET = "Rajagiri Rasi Bakery";

interface CategoryFormData {
  name: string;
  image: File | null;
}

const AddCategory: React.FC = () => {
  const [formData, setFormData] = useState<CategoryFormData>({ name: '', image: null });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle image preview
  useEffect(() => {
    if (!formData.image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(formData.image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Please enter category name' });
      return;
    }
    if (!formData.image) {
      setMessage({ type: 'error', text: 'Please upload a category image' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. Upload to Cloudinary
      const cloudData = new FormData();
      cloudData.append("file", formData.image);
      cloudData.append("upload_preset", UPLOAD_PRESET);

      const cloudRes = await axios.post(CLOUDINARY_URL, cloudData);
      const imageUrl = cloudRes.data.secure_url;

      // 2. Send to Node.js API
      const response = await axios.post(API_URL, {
        name: formData.name.trim(),
        image: imageUrl,
        status: 'Active'
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Category created successfully!' });
        setFormData({ name: '', image: null });
      }

      setTimeout(() => setMessage(null), 4000);
    } catch (error: any) {
      console.error('Error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Connection failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
    setPreview(null);
  };

  return (
    <div className="rasi-add-category-container">
      <div className="rasi-ac-header">
        <div className="rasi-ac-header-content">
          <h1><ImageIcon size={28} /> New Category</h1>
          <p>Create a new collection for your bakery catalog</p>
        </div>
      </div>

      <div className="rasi-ac-glass-form">
        {message && (
          <div className={`rasi-ac-alert ${message.type === 'success' ? 'rasi-success' : 'rasi-error'}`}>
            <div className="rasi-ac-alert-content">
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{message.text}</span>
            </div>
            <button 
              className="rasi-ac-alert-close"
              onClick={() => setMessage(null)}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rasi-ac-grid">
          {/* Left Section: Details */}
          <div className="rasi-ac-section">
            <h3>Basic Information</h3>
            <div className="rasi-ac-input-group">
              <label htmlFor="cat-name">Category Title</label>
              <input 
                type="text" 
                id="cat-name"
                placeholder="e.g. Handmade Cookies" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                disabled={loading}
                className="rasi-ac-input"
              />
            </div>
            
            <div className="rasi-ac-info-box">
              <p>Ensuring clear category names helps customers navigate your bakery products more efficiently.</p>
            </div>
          </div>

          {/* Right Section: Media */}
          <div className="rasi-ac-section">
            <h3>Visual Identity</h3>
            <div className="rasi-ac-input-group">
              <label>Category Icon/Image</label>
              <div className="rasi-ac-upload-zone">
                {preview ? (
                  <div className="rasi-ac-img-preview-wrapper">
                    <img src={preview} alt="Preview" className="rasi-ac-img-preview" />
                    <button
                      type="button"
                      className="rasi-ac-remove-btn"
                      onClick={handleRemoveImage}
                      disabled={loading}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="rasi-ac-upload-placeholder">
                    <Upload size={32} strokeWidth={1.5} />
                    <p>Click or drag image to upload</p>
                    <span>Supports JPG, PNG (Max 2MB)</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, image: e.target.files ? e.target.files[0] : null})} 
                  disabled={loading}
                  className="rasi-ac-file-input"
                />
              </div>
            </div>

            <button type="submit" className="rasi-ac-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={20} className="rasi-ac-spin" /> Finalizing...
                </>
              ) : (
                <>
                  <Save size={20} /> Create Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
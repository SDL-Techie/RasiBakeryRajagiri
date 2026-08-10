import React, { useState, useEffect } from 'react';
import { 
    Upload, Save, Loader2, CheckCircle2, AlertCircle, 
    FileSpreadsheet, PackagePlus, Info, IndianRupee, Image as ImageIcon 
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './AddProduct.css';

const BASE_URL = "http://localhost:4000/api/v1";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dyggibpsi/image/upload";
const UPLOAD_PRESET = "Rajagiri Rasi Bakery";
const DEFAULT_IMAGE =
  "https://i.pinimg.com/736x/e4/58/cf/e458cf4771adc487f8ae39bc248270b6.jpg";

interface Category { _id: string; name: string; }

const AddProduct: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '', category: '', price: '', wholesalePrice: '',
        oldPrice: '', description: '', ingredients: '', status: 'Active',
        weight: '', image: null as File | null
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingCats, setFetchingCats] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/category`);
                if (response.data.success) setCategories(response.data.data);
            } catch (err) { console.error(err); }
            finally { setFetchingCats(false); }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files![0] }));
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

const handleExcelImport = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  try {
    const file = e.target.files?.[0];

    if (!file) return;

    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer, {
      type: "array",
    });

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const excelRows: any[] =
      XLSX.utils.sheet_to_json(worksheet);

    if (!excelRows.length) {
      alert("Excel file is empty");
      return;
    }

    const formattedProducts = excelRows.map((row) => ({
      name: row.name || "",
      category: row.category || "",
      price: Number(row.price) || 0,
      wholesaleprice: Number(row.wholesaleprice) || 0,
      oldprice: Number(row.oldprice) || 0,
      weight: Number(row.weight) || 0,
      description: row.description || "",
      ingredients: row.ingredients || "",
      status: row.status || "Active",

      productimage:
        row.productimage &&
        String(row.productimage).trim() !== ""
          ? row.productimage
          : DEFAULT_IMAGE,
    }));

    const res = await axios.post(
      `${BASE_URL}/products/bulk`,
      {
        products: formattedProducts,
      }
    );

    if (res.data.success) {
      alert(
        `${formattedProducts.length} products imported successfully`
      );

   setMessage({
  type: "success",
  text: `${formattedProducts.length} products imported successfully`,
});

      // Clear file input
      e.target.value = "";
    }
  } catch (error) {
    console.error("Excel Import Error:", error);
    alert("Import failed");
  }
};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) return setMessage({ type: 'error', text: 'Image is required' });

        setLoading(true);
        try {
            const cloudData = new FormData();
            cloudData.append("file", formData.image);
            cloudData.append("upload_preset", UPLOAD_PRESET);
            const cloudRes = await axios.post(CLOUDINARY_URL, cloudData);

            const payload = {
                ...formData,
                weight: Number(formData.weight),
                wholesaleprice: formData.wholesalePrice,
                oldprice: formData.oldPrice,
                productimage: cloudRes.data.secure_url
            };

            const res = await axios.post(`${BASE_URL}/products`, payload,  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Product added to Rasi Bakery inventory!' });
                setFormData({ name: '', category: '', price: '', wholesalePrice: '', oldPrice: '', description: '', ingredients: '', status: 'Active', weight: '', image: null });
                setPreview(null);
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Server Error' });
        } finally { setLoading(false); }
    };

    return (
        <div className="add-product-container">
            <div className="ap-header">
                <div>
                    <h1><PackagePlus size={28} /> Add New Product</h1>
                    <p>Create a new item for Rasi Bakery & Sweets</p>
                </div>
             
             <div className="excel-import-wrapper">
  <input
    type="file"
    id="excel-up"
    accept=".xlsx,.xls"
    onChange={handleExcelImport}
    hidden
  />

  <label
    htmlFor="excel-up"
    className="excel-btn"
  >
    <FileSpreadsheet size={18} />
    Import Products
  </label>
</div>
            </div>

            {message && (
                <div className={`ap-alert ${message.type}`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            <form className="ap-glass-form" onSubmit={handleSubmit}>
                <div className="ap-grid">
                    {/* Left Column: Basic Info */}
                    <div className="ap-column">
                        <section className="ap-section">
                            <h3><Info size={16} /> Basic Details</h3>
                            <div className="ap-input-group">
                                <label>Product Title</label>
                                <input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Premium Butter Cookies" />
                            </div>
                            <div className="ap-row">
                                <div className="ap-input-group">
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} required>
                                        <option value="">{fetchingCats ? 'Loading...' : 'Select Category'}</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                
                            </div>
                        </section>

                        <section className="ap-section">
                            <h3><IndianRupee size={16} /> Pricing</h3>
                            <div className="ap-row">
                                <div className="ap-input-group">
                                    <label>Price</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="0.00" />
                                </div>
                                <div className="ap-input-group">
                                    <label>Wholesale</label>
                                    <input type="number" name="wholesalePrice" value={formData.wholesalePrice} onChange={handleChange} required placeholder="0.00" />
                                </div>
                                <div className="ap-input-group">
                                    <label>Old Price</label>
                                    <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange} placeholder="Optional" />
                                </div>
                                      <div className="ap-input-group">
            <label>Weight (kg)</label>
            <input 
                type="number" 
                step="0.01" 
                name="weight" 
                value={formData.weight} 
                onChange={handleChange} 
                required 
                placeholder="e.g. 0.5" 
            />
        </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Media & Description */}
                    <div className="ap-column">
                        <section className="ap-section">
                            <h3><ImageIcon size={16} /> Product Media</h3>
                            <div className={`ap-upload-zone ${preview ? 'has-preview' : ''}`}>
                                {preview ? (
                                    <img src={preview} alt="Preview" className="ap-img-preview" />
                                ) : (
                                    <div className="ap-upload-placeholder">
                                        <Upload size={32} />
                                        <p>Drag & Drop or Click to Upload</p>
                                    </div>
                                )}
                                <input type="file" onChange={handleImageChange} accept="image/*" />
                            </div>
                        </section>

                        <section className="ap-section">
                            <div className="ap-input-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Describe the taste and texture..." />
                            </div>
                            <div className="ap-input-group">
                                <label>Ingredients</label>
                                <input name="ingredients" value={formData.ingredients} onChange={handleChange} placeholder="Milk, Flour, Sugar..." />
                            </div>
                        </section>
                    </div>
                </div>

                <button type="submit" className="ap-submit-btn" disabled={loading}>
                    {loading ? <Loader2 className="ap-spin" /> : <Save size={18} />}
                    {loading ? 'Publishing Product...' : 'Save & Publish Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
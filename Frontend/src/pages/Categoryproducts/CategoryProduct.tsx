

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import ProductCard from "../../components/ProductCard/ProductCard";
import { ArrowLeft, Loader2 } from "lucide-react"; 
import './CategoryProduct.css'

const CategoryProduct: React.FC = () => {
  // 1. Get category name from URL params
  const { categoryname } = useParams<{ categoryname: string }>(); 
  const decodedName = decodeURIComponent(categoryname || "");
  const navigate = useNavigate();
  const location = useLocation();
 

  // 2. State management
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Get User Role safely from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'customer';

  // Use the name from navigation state if available, otherwise use URL param
  // const displayName = location.state?.name || categoryname;
     const displayName = decodedName;
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!categoryname) return;

      setLoading(true);
      try {
        // Fetching from your specific category endpoint
        const res = await axios.get(`http://localhost:4000/api/v1/category/${categoryname}`);
        
        if (res.data.success) {
          const list = res.data.data
            // Logic: Only show Active products
            .filter((p: any) => p.status === 'Active') 
            .map((p: any) => ({
              ...p,
              id: p._id,
              image: p.productimage,
              // Logic: Category mapping (handling object or string)
              category: typeof p.category === 'object' ? p.category?.name : p.category,
              // Logic: Role-based pricing
              price: userRole === 'retailer' ? p.wholesaleprice : p.price,
              isRetailer: userRole === 'retailer'
            }));
            
          setFilteredProducts(list);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryname, userRole]);

  return (
    <>
      <button className="rasi-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back to Home
        </button>
 
    <div 
    // className="rasi-category-page"
    >
       
      <div className="rasi-container">
       
     
        
        {/* Header Section */}
        <div className="rasi-section-header">
          <h2 style={{ textTransform: 'capitalize' }}>{displayName}</h2>
          <p>Explore our fresh and delicious {displayName?.toLowerCase()} selection</p>
        </div>

        {/* Products Grid */}
        <div className="rasi-products-grid">
          {loading ? (
            <div className="rasi-loader-container">
              <Loader2 className="spinner" size={40} />
              <p>Fetching the best treats for you...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="rasi-no-products">
              <div className="no-products-icon">🥐</div>
              <h3>No Active Products</h3>
              <p>We don't have any active products in the <strong>{displayName}</strong> category right now.</p>
              <button className="rasi-btn-primary" onClick={() => navigate('/')}>
                Browse Other Categories
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
       </>
  );
};

export default CategoryProduct;
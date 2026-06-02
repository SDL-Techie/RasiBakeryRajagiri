import React, { useState, useEffect } from 'react';
import axios from "axios";
import { LayoutGrid, List, Loader2, FilterX, Menu, X, Filter } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';
import SEO from '@/src/components/SEO';

interface Category {
  _id: string;
  name: string;
  image?: string;
  status?: string;
  createdAt?: string;
}

const Products: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(100000); 
  const [sortBy, setSortBy] = useState<string>('relevance');

  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch both Products and Categories concurrently for better performance
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:4000/api/v1/products"),
          axios.get("http://localhost:4000/api/v1/category")
        ]);

        // 2. Handle Setting Active Categories
        if (categoriesRes.data.success) {
          const activeCategories = categoriesRes.data.data.filter(
            (cat: Category) => cat.status !== "Inactive"
          );
          setCategories(activeCategories);
        }

        // 3. Process Products Mapping
        if (productsRes.data.success) {
          const data = productsRes.data.data;
          //console.log("Fetched products:", data);

          const mappedProducts = data.map((item: any) => {
            // Support both object populate layouts or flat field references safely
            const catName = typeof item.category === 'object' 
              ? item.category?.name 
              : item.categoryName || item.category;

            return {
              id: item._id,
              name: item.name,
              price: Number(item.price), 
              wholesaleprice: Number(item.wholesaleprice),
              oldprice: item.oldprice,
              productimage: item.productimage, 
              category: item.category, 
              categoryName: catName, // standard reference target name for filters
              rating: 5,
              status: item.status 
            };
          });

          const activeProducts = mappedProducts.filter(
            (p: any) => p.status === "Active"
          );

          setProducts(activeProducts);

          // Dynamically set maximum slider window baseline if matching products exist
          if (activeProducts.length > 0) {
            const maxProductPrice = Math.max(...activeProducts.map((p: any) => p.price));
            setPriceRange(maxProductPrice);
          }
        }

      } catch (error) {
        console.error("Error fetching marketplace data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const filteredProducts = products
    .filter(p => {
      // Clean check comparing lowercase or standard name values
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some(catName => p.categoryName?.toLowerCase() === catName.toLowerCase() || p.category === catName);

      // Verify targeted customer group specific pricing boundaries
      const activePrice = userRole === "retailer" ? (p.wholesaleprice || p.price) : p.price;
      const matchPrice = activePrice <= priceRange;

      return matchCategory && matchPrice;
    })
    .sort((a, b) => {
      const priceA = userRole === "retailer" ? (a.wholesaleprice || a.price) : a.price;
      const priceB = userRole === "retailer" ? (b.wholesaleprice || b.price) : b.price;

      if (sortBy === "low") return priceA - priceB;
      if (sortBy === "high") return priceB - priceA;
      return 0;
    });

  const handleClearFilters = () => {
    setSelectedCategories([]);
    if (products.length > 0) {
      const maxProductPrice = Math.max(...products.map((p: any) => p.price));
      setPriceRange(maxProductPrice);
    } else {
      setPriceRange(100000);
    }
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="rasi-loading-container">
        <Loader2 className="spinner" size={40} />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <>
 
 <SEO
  title="Products | Rajagiri Rasi Bakery"
  description="Explore cakes, sweets, breads and bakery products."
  keywords="rajagiri bakery, cakes, breads, sweets, bakery products, online bakery, thanjavur bakery"
  url="https://www.rajagirirasibakery.com/products"
/>

    <div className="rasi-products-page">
      <div className="rasi-products-container">
        
        {/* Mobile Sidebar Toggle Button */}
        <button 
          className="rasi-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle filters"
        >
          {sidebarOpen ? <X size={24} /> : <Filter size={24} /> }
        </button>

        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div 
            className="rasi-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`rasi-products-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="rasi-sidebar-header">
            <h2>Filters</h2>
            <button 
              className="rasi-close-sidebar"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close filters"
            >
              <X size={24} />
            </button>
          </div>

          <div className="rasi-filter-section">
            <h3>Categories</h3>
            <ul>
              {categories.map((cat) => (
                <li key={cat._id}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                    />
                    <span>{cat.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="rasi-filter-section">
            <h3>Price Range</h3>
            <div className="rasi-price-display">
              <span>₹0</span>
              <span className="rasi-price-value">₹{priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              className="rasi-price-range"
              min="0"
              max={products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
            <div className="rasi-price-labels">
              <span>₹0</span>
              <span>₹{products.length > 0 ? Math.max(...products.map(p => p.price)).toLocaleString() : '100k'}</span>
            </div>
          </div>

          <button 
            className="rasi-clear-filters-btn"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </button>
        </aside>

        <main className="rasi-products-main">
          <div className="rasi-products-header">
            <div className="rasi-products-count">
              <strong>Showing {filteredProducts.length} Products</strong>
            </div>
            <div className="rasi-products-controls">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="rasi-sort-select"
              >
                <option value="relevance">New Arrivals</option>
                <option value="low">Price Low → High</option>
                <option value="high">Price High → Low</option>
              </select>
              <div className="rasi-view-toggle">
                <button 
                  onClick={() => setView('grid')} 
                  className={`rasi-view-btn ${view === 'grid' ? 'active' : ''}`}
                  title="Grid view"
                >
                  <LayoutGrid size={20} />
                </button>
                <button 
                  onClick={() => setView('list')} 
                  className={`rasi-view-btn ${view === 'list' ? 'active' : ''}`}
                  title="List view"
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className={`rasi-products-display ${view}`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rasi-no-products-found">
              <FilterX size={40} />
              <p>No products match your criteria</p>
              <button 
                className="rasi-reset-btn"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
    </>
  );
};

export default Products;
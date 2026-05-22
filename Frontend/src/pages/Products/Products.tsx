import React, { useState, useEffect } from 'react';
import axios from "axios";
import { LayoutGrid, List, Loader2, FilterX, Menu, X } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

const Products: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(100000); 
  const [sortBy, setSortBy] = useState<string>('relevance');

  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/api/v1/products");
        const data = res.data.data;

        // Extract categories dynamically
        const uniqueCategories = [
          ...new Set(data.map((p: any) => p.category?.name).filter(Boolean))
        ];
        setCategories(uniqueCategories as string[]);

        // ✅ Map products to match ProductCard interface
        const mappedProducts = data.map((item: any) => {
          const finalPrice =
            userRole === "retailer"
              ? Number(item.wholesaleprice || item.price)
              : Number(item.price);

          return {
            id: item._id,
            name: item.name,
            price: Number(item.price), // Keep base price
            wholesaleprice: Number(item.wholesaleprice),
            oldprice: item.oldprice,
            productimage: item.productimage, // ✅ Matches ProductCard
            category: item.category, // Pass full object
            categoryName: item.category?.name, // For filtering
            rating: 5,
            status: item.status 
          };
        });

        const activeProducts = mappedProducts.filter(
          (p: any) => p.status === "Active"
        );

        setProducts(activeProducts);

        if (activeProducts.length > 0) {
          const maxProductPrice = Math.max(...activeProducts.map((p: any) => p.price));
          setPriceRange(maxProductPrice);
        }

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userRole]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = products
    .filter(p => {
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.categoryName);

      const matchPrice = p.price <= priceRange;
      return matchCategory && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "low") return a.price - b.price;
      if (sortBy === "high") return b.price - a.price;
      return 0;
    });

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange(100000);
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
    <div className="rasi-products-page">
     
      <div className="rasi-products-container">
        {/* Mobile Sidebar Toggle Button */}
        <button 
          className="rasi-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle filters"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
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
              {categories.map((cat, i) => (
                <li key={i}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span>{cat}</span>
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
              max="100000" 
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
            <div className="rasi-price-labels">
              <span>₹0</span>
              <span>₹100k</span>
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
  );
};

export default Products;
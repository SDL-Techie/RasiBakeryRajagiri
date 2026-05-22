import React, { useState, useEffect } from 'react';
import { Star, Heart, Share2, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ProductCard.css';
import { useCustomerAuth } from '@/src/context/CustomerAuthContext';
interface Product {
  id: string;
  name: string;
  productimage: string; 
  price: string | number;
  oldprice?: string | number; 
  wholesaleprice?: string | number;
  category?: { name: string }; 
  rating: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { customer, isLoggedIn } = useCustomerAuth();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'customer';
  //const userPhone = user.phone || localStorage.getItem('userPhone');
  // const isRetailer = userRole === 'retailer';

  const userPhone = customer?.mobile || customer?.mobile || localStorage.getItem('userPhone') || localStorage.getItem('customerMobile');
  const isRetailer = isLoggedIn && customer?.role?.toLowerCase() === 'retailer';
  
  const currentDisplayPrice = isRetailer ? product.wholesaleprice : product.price;
  
  // Struck price: Show the "Normal" price if they are a retailer to show their savings
  const struckPrice = isRetailer ? product.price : product.oldprice;

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userPhone || !product.id) return;
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/whislist/${userPhone}`);
        if (res.data.success && Array.isArray(res.data.data)) {
          const isInWishlist = res.data.data.some((item: any) => {
            const prodId = item.productId?._id || item.productId;
            return prodId === product.id;
          });
          setIsWishlisted(isInWishlist);
        }
      } catch (error) {
        console.error("Wishlist check error:", error);
      }
    };
    checkWishlistStatus();
  }, [userPhone, product.id]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userPhone) {
      toast.error("Please login to manage your wishlist.");
      navigate('/login', { state: { from: location.pathname } }); 
      return;
    }

    setIsSyncing(true);
    try {
      const res = await axios.post('http://localhost:4000/api/v1/whislist', {
        userPhone: userPhone,
        productId: product.id
      });
      if (res.data.success) {
        const added = res.data.action === 'added';
        setIsWishlisted(added);
        toast.success(added ? "Added to Wishlist" : "Removed from Wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    if (navigator.share) {
      navigator.share({ title: product.name, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="rasi-product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="rasi-product-image">
        <img 
          src={product.productimage} 
          alt={product.name} 
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image')}
        />
        
        <div className="rasi-product-actions-overlay">
          <button 
            type="button"
            className={`rasi-action-icon ${isWishlisted ? 'active' : ''}`} 
            onClick={handleWishlist}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Heart 
                size={18} 
                fill={isWishlisted ? "#ff4444" : "none"} 
                stroke={isWishlisted ? "#ff4444" : "currentColor"}
              />
            )}
          </button>
          <button type="button" className="rasi-action-icon" onClick={handleShare}>
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="rasi-product-info">
        <span className="rasi-product-category">{product.category?.name || 'Bakery'}</span>
        <h3>{product.name}</h3>
        
        <div className="rasi-product-rating">
          <Star size={12} fill="#ffc107" stroke="#ffc107" /> 
          <span>{product.rating || 5}</span>
        </div>

        <div className="rasi-product-price-row">
          <span className="rasi-price">₹{currentDisplayPrice}</span>
          {struckPrice && Number(struckPrice) > Number(currentDisplayPrice) && (
            <span className="rasi-old-price">₹{struckPrice}</span>
          )}
          {isRetailer && <span className="retailer-badge">Wholesale</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
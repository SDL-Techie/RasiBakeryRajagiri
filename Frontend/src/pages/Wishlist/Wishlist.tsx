import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Wishlist.css';
import { useCustomerAuth } from '@/src/context/CustomerAuthContext';

interface WishlistItem {
  _id: string;
  userPhone: string;
  productId: {
    _id: string;
    name: string;
    price: string | number;
    productimage: string;
    category: string;
  };
}

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingAll, setIsAddingAll] = useState(false); // New state for bulk action
  const { customer, isLoggedIn } = useCustomerAuth();
  const userPhone = localStorage.getItem('userPhone');
  const activePhone = customer?.mobile || customer?.mobile || localStorage.getItem('userPhone') || localStorage.getItem('customerMobile');

  // --- Fetch Wishlist ---
  useEffect(() => {
    const fetchWishlist = async () => {
      // if (!userPhone) {
      //   setLoading(false);
      //   return;
      // }

      if (!activePhone) {
           setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // const res = await axios.get(`http://localhost:4000/api/v1/whislist/${userPhone}`);
        const res = await axios.get(`http://localhost:4000/api/v1/whislist/${activePhone}`);
        if (res.data.success) {
          setWishlistItems(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [activePhone]);

  // --- Remove Item Helper ---
  const removeFromWishlist = async (wishlistId: string, prodId: string) => {
    try {
      const res = await axios.post('http://localhost:4000/api/v1/whislist', {
        // userPhone: userPhone,
        userPhone: activePhone,
        productId: prodId
      });

      if (res.data.success) {
        setWishlistItems(prev => prev.filter(item => item._id !== wishlistId));
        return true;
      }
    } catch (error) {
      console.error("Remove error:", error);
    }
    return false;
  };

  // --- Add Single Item to Cart ---
  const handleAddToCart = async (item: WishlistItem) => {
    try {
      const res = await axios.post('http://localhost:4000/api/v1/cart', {
        // userPhone,
        userPhone: activePhone,
        productId: item.productId._id,
        quantity: 1
      });

      if (res.data) {
        toast.success(`${item.productId.name} added to cart`);
        await removeFromWishlist(item._id, item.productId._id);
      }
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  // --- Add All to Cart Logic ---
  const handleAddAllToCart = async () => {
    if (!userPhone) return toast.error("Please login first");
    
    setIsAddingAll(true);
    const loadingToast = toast.loading("Adding all items to cart...");

    try {
      // Map all items to a list of promises
      const addPromises = wishlistItems.map(async (item) => {
        return axios.post('http://localhost:4000/api/v1/cart', {
          userPhone,
          productId: item.productId._id,
          quantity: 1
        }).then(() => removeFromWishlist(item._id, item.productId._id));
      });

      // Wait for all requests to finish
      await Promise.all(addPromises);
      
      toast.success("All items moved to cart!", { id: loadingToast });
      setWishlistItems([]); // Clear local UI since they are removed from DB
    } catch (error) {
      toast.error("Some items failed to add", { id: loadingToast });
    } finally {
      setIsAddingAll(false);
    }
  };

  // --- Calculate Total Amount ---
  const totalValue = wishlistItems.reduce((sum, item) => {
    return sum + Number(item.productId.price || 0);
  }, 0);

  if (loading) {
    return (
      <div className="rasi-loading-container">
        <Loader2 className="spinner" size={40} />
        <p>Loading your favorites...</p>
      </div>
    );
  }

  if (!userPhone) {
    return (
      <div className="rasi-empty-wishlist">
        <Heart size={64} />
        <h2>Please Login</h2>
        <p>Login to see your wishlist.</p>
        <Link to="/login" className="rasi-shop-now-btn">Go to Login</Link>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="rasi-empty-wishlist">
        <Heart size={64} />
        <h2>Your Wishlist is Empty</h2>
        <Link to="/products" className="rasi-shop-now-btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="rasi-wishlist-page">
      <div className="rasi-wishlist-container">
        <div className="rasi-wishlist-header">
          <h1><Heart size={28} /> My Wishlist</h1>
          <p>Total Items: {wishlistItems.length}</p>
        </div>

        <div className="rasi-wishlist-main">
          <div className="rasi-wishlist-items">
            {wishlistItems.map(item => (
              <div key={item._id} className="rasi-wishlist-item">
                <div className="rasi-wishlist-item-image">
                  <img src={item.productId.productimage} alt={item.productId.name} referrerPolicy="no-referrer" />
                  <button
                    className="rasi-wishlist-remove"
                    onClick={() => removeFromWishlist(item._id, item.productId._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="rasi-wishlist-item-info">
                  <h3>{item.productId.name}</h3>
                  <p className="rasi-wishlist-price">₹{item.productId.price}</p>
                  <button
                    className="rasi-add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="rasi-wishlist-summary">
            <h2>Summary</h2>
            <div className="rasi-summary-row">
              <span>Subtotal</span>
              <span>₹{totalValue}</span>
            </div>
            <div className="rasi-summary-row total">
              <span>Total Amount</span>
              <span>₹{totalValue}</span>
            </div>
            <button 
              className="rasi-checkout-btn"
              onClick={handleAddAllToCart}
              disabled={isAddingAll}
            >
              {isAddingAll ? (
                <><Loader2 size={18} className="spinner" /> Moving...</>
              ) : (
                "Add All to Cart"
              )}
            </button>
            <Link to="/products" className="rasi-continue-shopping">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
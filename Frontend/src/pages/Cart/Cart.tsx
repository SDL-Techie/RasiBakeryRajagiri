


import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Loader2, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Cart.css';
import { useCustomerAuth } from '@/src/context/CustomerAuthContext';

interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: string | number;
    productimage: string;
    description: string;
    category?: { name: string };
  };
  quantity: number;
}

const Cart: React.FC = () => {
  const { customer, isLoggedIn } = useCustomerAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const userPhone = customer?.mobile || localStorage.getItem('userPhone') || localStorage.getItem('customerMobile');
  const activeSession = isLoggedIn || !!userPhone;

  // --- Fetch Cart Data ---
  const fetchCart = async () => {
    if (!userPhone) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/cart/${userPhone}`);
      if (res.data.success) {
        setCartItems(res.data.data.items || []);
      }
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userPhone]);

  // --- Update Quantity (Buttons & Manual Entry) ---
  const handleQuantityChange = async (productId: string, newQty: number) => {
    if (newQty < 1) return;
    setUpdatingId(productId);
    try {
      const res = await axios.put(`http://localhost:4000/api/v1/cart/update`, {
        userPhone,
        productId,
        quantity: newQty
      });
      if (res.data.success) {
        setCartItems(res.data.data.items);
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // --- Remove Item ---
  const handleRemove = async (productId: string) => {
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/cart/remove`, {
        userPhone,
        productId
      });
      if (res.data.success) {
        setCartItems(res.data.data.items);
        toast.success("Removed from cart");
      }
    } catch (error) {
      toast.error("Remove failed");
    }
  };

  // --- Calculations ---
  const subtotal = cartItems.reduce((acc, item) => 
    acc + (Number(item.productId.price) * item.quantity), 0);
  const delivery = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const total = subtotal + delivery;

  // --- Loading State ---
  if (loading) {
    return (
      <div className="rasi-cart-loading-container">
        <Loader2 className="rasi-cart-spinner" size={40} />
        <p>Fetching your cart...</p>
      </div>
    );
  }

  // --- Login Required State ---
  if (!activeSession) {
    return (
      <div className="rasi-cart-empty-container">
        <ShoppingBag size={64} />
        <h2>Please Login</h2>
        <p>Login to view and manage your shopping cart.</p>
        <Link to="/login" className="rasi-cart-action-btn">Login Now</Link>
      </div>
    );
  }

  // --- Empty Cart State ---
  if (cartItems.length === 0) {
    return (
      <div className="rasi-cart-empty-container">
        <ShoppingBag size={64} />
        <h2>Your cart is empty!</h2>
        <p>Explore our delicious bakery items.</p>
        <Link to="/products" className="rasi-cart-action-btn">Shop Now</Link>
      </div>
    );
  }

  // --- Main Cart Render ---
  return (
    <div className="rasi-cart-page">
      <div className="rasi-cart-wrapper">
        {/* LEFT SIDE: Items List */}
        <div className="rasi-cart-main">
          <div className="rasi-cart-header">
            <h1>My Cart</h1>
            <span className="rasi-cart-count">({cartItems.length} items)</span>
          </div>
          
          <div className="rasi-cart-items-list">
            {cartItems.map(item => (
              <div key={item.productId._id} className="rasi-cart-item-card">
                {/* Product Image */}
                <div className="rasi-cart-item-image-wrapper">
                  <img 
                    src={item.productId.productimage} 
                    alt={item.productId.name}
                    className="rasi-cart-item-image"
                  />
                </div>

                {/* Product Info */}
                <div className="rasi-cart-item-content">
                  {/* Title and Meta */}
                  <div className="rasi-cart-item-header">
                    <Link 
                      to={`/product/${item.productId._id}`} 
                      className="rasi-cart-item-title"
                    >
                      {item.productId.name}
                    </Link>
                    <p className="rasi-cart-item-seller">Rasi Bakery</p>
                  </div>

                  {/* Price Section */}
                  <div className="rasi-cart-item-price-section">
                    <div className="rasi-cart-price-group">
                      <span className="rasi-cart-unit-price">₹{item.productId.price}</span>
                      <span className="rasi-cart-subtotal">
                        Subtotal: ₹{Number(item.productId.price) * item.quantity}
                      </span>
                    </div>

                    {/* Quantity Controls (Responsive) */}
                    <div className="rasi-cart-qty-control">
                      <button 
                        className="rasi-cart-qty-btn"
                        onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingId === item.productId._id}
                        title="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <input 
                        type="number" 
                        className="rasi-cart-qty-input"
                        value={item.quantity} 
                        onChange={(e) => handleQuantityChange(item.productId._id, parseInt(e.target.value) || 1)}
                        min="1"
                      />
                      <button 
                        className="rasi-cart-qty-btn"
                        onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                        disabled={updatingId === item.productId._id}
                        title="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="rasi-cart-item-actions">
                    <button 
                      className="rasi-cart-buy-btn"
                      onClick={() => navigate('/checkout', { 
                        state: { 
                          items: [item], 
                          subtotal: Number(item.productId.price) * item.quantity
                        } 
                      })}
                    >
                      <Zap size={14} /> BUY NOW
                    </button>
                    <button 
                      className="rasi-cart-delete-btn"
                      onClick={() => handleRemove(item.productId._id)}
                    >
                      <Trash2 size={14} /> REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="rasi-cart-continue-section">
            <Link to="/products" className="rasi-cart-continue-btn">
              <ArrowLeft size={18} /> CONTINUE SHOPPING
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: Price Summary */}
        <div className="rasi-cart-summary-panel">
          <h2 className="rasi-summary-title">PRICE DETAILS</h2>
          
          <div className="rasi-summary-content">
            <div className="rasi-summary-row">
              <span>Price ({cartItems.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            
            {/* {delivery > 0 && (
              <div className="rasi-summary-row">
                <span>Delivery Charges</span>
                <span>₹{delivery}</span>
              </div>
            )}
            
            {delivery === 0 && subtotal > 0 && (
              <div className="rasi-summary-row rasi-summary-free-delivery">
                <span>Delivery Charges</span>
                <span>FREE</span>
              </div>
            )} */}
          </div>

          {/* <div className="rasi-summary-divider"></div>

          <div className="rasi-summary-total">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>

          {delivery === 0 && subtotal > 0 && (
            <p className="rasi-summary-savings">
              🎉 You saved ₹50 on delivery!
            </p>
          )} */}

          {/* {subtotal > 0 && subtotal <= 500 && (
            <p className="rasi-summary-info">
              Add ₹{Math.ceil(500 - subtotal)} more for FREE delivery
            </p>
          )} */}

          <button 
            className="rasi-checkout-button"
            onClick={() => navigate('/checkout', { 
              state: { 
                items: cartItems, 
                subtotal: subtotal 
              } 
            })}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
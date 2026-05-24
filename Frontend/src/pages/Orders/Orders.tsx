import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingBag, Loader2, Zap,
  Clock, CheckCircle, Truck, XCircle, Trash2, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; 
import './Orders.css';
import { useCustomerAuth } from '@/src/context/CustomerAuthContext';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  // ✅ Modal State Hooks for the custom confirmation popup
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { customer } = useCustomerAuth();
  const userRole = localStorage.getItem("userRole");
  const activePhone = (
    customer?.mobile || 
    localStorage.getItem('userPhone') || 
    localStorage.getItem('customerMobile')
  )?.trim() || null;

  const fetchOrderHistory = async (phone: string) => {
    try {
      setLoading(true);
      const [customerRes, retailerRes] = await Promise.allSettled([
        axios.get(`http://localhost:4000/api/v1/getorderbyphone/${phone}`),
        axios.get(`http://localhost:4000/api/v1/retailer-order/phone/${phone}`)
      ]);

      let combinedOrders: any[] = [];

      if (customerRes.status === 'fulfilled' && customerRes.value.data?.success) {
        const clientData = Array.isArray(customerRes.value.data.data) 
          ? customerRes.value.data.data 
          : [customerRes.value.data.data];
        combinedOrders = [...clientData];
      }

      if (retailerRes.status === 'fulfilled' && retailerRes.value.data?.success) {
        const retailData = retailerRes.value.data.data.map((order: any) => ({
          ...order,
          isRetail: true
        }));
        combinedOrders = [...combinedOrders, ...retailData];
      }

      combinedOrders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(combinedOrders);
    } catch (error) {
      console.error("Fetch Error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Opens the custom pop-up component
  const handleCancelClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowConfirmModal(true);
  };

  // ✅ Processes backend data changes upon confirming
  const executeCancellationRequest = async () => {
    if (!selectedOrderId) return;
    
    const targetId = selectedOrderId;
    // Close modal view layer instantly to maintain fast UX response flow
    setShowConfirmModal(false);
    setSelectedOrderId(null);

    try {
      setCancellingId(targetId);
      const { data } = await axios.put(`http://localhost:4000/api/v1/order/cancel/${targetId}`);

      if (data.success) {
        toast.success("🎉 Order cancelled successfully!");
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === targetId ? { ...order, status: 'Cancelled' } : order
          )
        );
      } else {
        toast.error(data.message || "❌ Failed to cancel order.");
      }
    } catch (err: any) {
      console.error("Cancellation error:", err);
      toast.error(err.response?.data?.message || "❌ Connection error during cancellation.");
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    if (!activePhone) {
      setLoading(false);
      return;
    }
    fetchOrderHistory(activePhone);
  }, [activePhone]);

  const getStatusDetails = (status: string) => {
    const s = status?.toLowerCase() || 'pending';
    const icons = {
        delivered: { class: 'rasi-status-delivered', icon: <CheckCircle size={14} /> },
        shipped: { class: 'rasi-status-shipped', icon: <Truck size={14} /> },
        processing: { class: 'rasi-status-processing', icon: <Clock size={14} /> },
        cancelled: { class: 'rasi-status-cancelled', icon: <XCircle size={14} /> },
        pending: { class: 'rasi-status-pending', icon: <Clock size={14} /> },
        ordered: { class: 'rasi-status-pending', icon: <Package size={14} /> },
        "ready for pickup": { class: 'rasi-status-shipped', icon: <Package size={14} /> }
    };
    return icons[s as keyof typeof icons] || icons.pending;
  };

  if (loading) {
    return (
      <div className="rasi-orders-loader-container">
        <Loader2 className="animate-spin" size={40} />
        <p>Syncing your Rasi Bakery history...</p>
      </div>
    );
  }

  if (!activePhone) {
    return (
      <div className="rasi-empty-orders">
        <XCircle size={60} className="empty-icon text-red-400" />
        <h2>Authentication Required</h2>
        <p>Please log in with your account to track your orders.</p>
        <Link to="/login" className="rasi-shop-now-btn">Go to Login</Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rasi-empty-orders">
        <Package size={60} className="empty-icon" />
        <h2>No History Found</h2>
        <p>No orders found for number: <strong>{activePhone}</strong></p>
        <Link to="/products" className="rasi-shop-now-btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="rasi-orders-page">
      <div className="rasi-orders-container">
        <header className="rasi-orders-header">
          <h1>My Order History</h1>
          <span className="order-count-badge">{orders.length} Items</span>
        </header>

        <div className="rasi-orders-list">
          {orders.map((order) => {
            const statusInfo = getStatusDetails(order.status);
            const isCancellable = order.status !== 'Delivered' && order.status !== 'Shipped' && order.status !== 'Cancelled';

            return (
              <div key={order._id} className={`rasi-order-card ${order.isRetail ? 'retail-border' : ''}`}>
                <div className="rasi-order-card-header">
                  <div className="order-meta">
                    <div className="order-id-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="order-number">
                          #{order.orderId || order._id?.substring(order._id.length - 6).toUpperCase()}
                        </span>
                        {order.isRetail && (
                            <span className="retail-badge-fast">
                                <Zap size={10} fill="currentColor" /> FAST ORDER
                            </span>
                        )}
                    </div>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className={`status-pill ${statusInfo.class}`}>
                    {statusInfo.icon} {order.status || 'Ordered'}
                  </div>
                </div>

                <div className="rasi-order-items-summary">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="rasi-order-item-row">
                      <img src={item.image || item.productId?.productimage} alt={item.name} className="item-thumbnail" />
                      <div className="item-info">
                        <p className="item-name">{item.name}</p>
                        <p className="item-qty">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="item-price">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="rasi-order-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div className="total-box">
                    <span>Total Paid:</span>
                    <span className="final-price">₹{order.pricing?.total || order.total}</span>
                  </div>
                  
                  <div className="footer-actions-group" style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                    {/* {isCancellable && ( */}
                    {isCancellable && userRole !== "retailer" && (
                      <button 
                        onClick={() => handleCancelClick(order._id)}
                        disabled={cancellingId === order._id}
                        className="cancel-order-btn"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          backgroundColor: '#FEF2F2',
                          color: '#EF4444',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          border: '1px solid #FCA5A5',
                          cursor: 'pointer'
                        }}
                      >
                        {cancellingId === order._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Cancel Order
                      </button>
                    )}

                    <Link to={order.isRetail ? "/retailerorder" : "/products"} className="reorder-btn">
                      <ShoppingBag size={16} /> {order.isRetail ? 'Quick Restock' : 'Order Again'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ CUSTOM POPUP MODAL COMPONENT PORTAL */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center',
          }}>
            <div style={{
              display: 'inline-flex',
              backgroundColor: '#FEF2F2',
              padding: '12px',
              borderRadius: '50%',
              marginBottom: '16px'
            }}>
              <AlertTriangle size={28} color="#EF4444" />
            </div>
            
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>
              Confirm Cancellation
            </h3>
            
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#4B5563', lineHeight: '1.5' }}>
              Are you sure you want to cancel this order? This action cannot be reversed.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => { setShowConfirmModal(false); setSelectedOrderId(null); }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'background-color 0.2s'
                }}
              >
                No, Keep Order
              </button>
              <button
                onClick={executeCancellationRequest}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: '#EF4444',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  transition: 'background-color 0.2s'
                }}
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
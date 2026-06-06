import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, Search, Loader2, MapPin, Phone, Calendar, 
  Package, X, CreditCard, RefreshCcw, Printer, 
  Download, ChevronLeft, ChevronRight, Filter,
  Wallet, Banknote, ShoppingBag, IndianRupee, Hash, CheckCircle
} from 'lucide-react';
import axios from 'axios';
import Logo from '../../components/Logo/Logo';
import './Order.css';
import toast, { Toaster } from "react-hot-toast";

const Orders: React.FC = () => {

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/getallordercod", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
     // console.log(res.data)
      if (res.data.success) {
        // Filter the data here before saving it to state
        const customerOnlyOrders = res.data.data.filter(
          (order: any) => order.customerDetails?.role === "customer"
        );
        
        setOrders(customerOnlyOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

const [isEditOpen, setIsEditOpen] = useState(false);
const [editForm, setEditForm] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEditOrder = (order:any) => {
  setEditForm(JSON.parse(JSON.stringify(order)));
  setIsEditOpen(true);
};

const saveEditedOrder = async () => {
  try {
    const res = await axios.put(
      `http://localhost:4000/api/v1/order/edit/${editForm._id}`,
      editForm,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "token"
          )}`,
        },
      }
    );

    if (res.data.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === editForm._id
            ? res.data.data
            : o
        )
      );

      setSelectedOrder(res.data.data);

      setIsEditOpen(false);
toast.success("Order updated successfully");
    
    }
  } catch (error) {
    console.error(error);
    toast.error("Update failed");
  }
};


const recalculatePricing = (items: any[], pricing: any) => {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const deliveryCharge = pricing?.deliveryCharge || 0;
  const discount = pricing?.discount || 0;

  return {
    ...pricing,
    subtotal,
    total: subtotal + deliveryCharge - discount,
  };
};



  // Filtering Logic
  // const filteredOrders = useMemo(() => {
  //   return orders.filter(o => {
  //     const matchesSearch = 
  //       o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       o.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       o.customerDetails?.phone?.includes(searchTerm);
      
  //     const orderDate = new Date(o.createdAt).setHours(0,0,0,0);
  //     const start = startDate ? new Date(startDate).setHours(0,0,0,0) : null;
  //     const end = endDate ? new Date(endDate).setHours(23,59,59,999) : null;

  //     const matchesDate = (!start || orderDate >= start) && (!end || orderDate <= end);

  //     return matchesSearch && matchesDate;
  //   });
  // }, [orders, searchTerm, startDate, endDate]);

  const filteredOrders = useMemo(() => {
  return orders
    .filter((o) => {
      const matchesSearch =
        o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerDetails?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const orderDate = new Date(o.createdAt).setHours(0, 0, 0, 0);

      const start = startDate
        ? new Date(startDate).setHours(0, 0, 0, 0)
        : null;

      const end = endDate
        ? new Date(endDate).setHours(23, 59, 59, 999)
        : null;

      const matchesDate =
        (!start || orderDate >= start) &&
        (!end || orderDate <= end);

      return matchesSearch && matchesDate;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}, [orders, searchTerm, startDate, endDate]);

  // ✅ Stats Calculations (Corrected target tracking for both 'upi' and 'razorpay' strings)
  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const revenue = filteredOrders.reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);
    const upi = filteredOrders
      .filter(o => {
        const m = o.payment?.method?.toLowerCase() || '';
        return m === 'upi' || m === 'razorpay';
      })
      .reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);
    const cod = filteredOrders
      .filter(o => o.payment?.method?.toLowerCase() === 'cod')
      .reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);

    return { total, revenue, upi, cod };
  }, [filteredOrders]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentData = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    const headers = ["Order ID,Customer,Date,Total,Status,Payment"];
    const rows = filteredOrders.map(o => 
      `${o.orderId},${o.customerDetails?.name},${new Date(o.createdAt).toLocaleDateString()},${o.pricing?.total},${o.status},${o.payment?.method}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const res = await axios.put(`http://localhost:4000/api/v1/order/${orderId}`, { status: newStatus }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
      if (res.data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (error) {
      alert("Update failed");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <div className="admin-loading">
      <Loader2 className="spinner" size={48} color="#4B2E2B" />
      <p>Loading Your Bakery Dashboard...</p>
    </div>
  );

  return (
    <div className="admin-orders-container">
           <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      {/* 1. STATS SECTION */}
      <h1 className="title">Order Management</h1>
      <div className="stats-grid no-print">
        <div className="stat-card">
          <div className="stat-icon brown"><ShoppingBag size={20} /></div>
          <div className="stat-info">
            <p>Total Orders</p>
            <h3>{stats.total}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon brown"><IndianRupee size={20} /></div>
          <div className="stat-info">
            <p>Total Revenue</p>
            <h3>₹{stats.revenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon brown"><Wallet size={20} /></div>
          <div className="stat-info">
            <p>UPI Payments</p>
            <h3>₹{stats.upi.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon brown"><Banknote size={20} /></div>
          <div className="stat-info">
            <p>Cash (COD)</p>
            <h3>₹{stats.cod.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* 2. FILTER CONTROLS */}
      <header className="admin-header no-print">
        <div className="filter-row">
          <div className="search-group">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          <div className="date-group">
            <div className="date-input">
              <span>From:</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="date-input">
              <span>To:</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="action-buttons">
            <button className="export-btn" onClick={handleExport}>
              <Download size={16} /> <span className="btn-text">Export</span>
            </button>
            <button className="refresh-btn" onClick={fetchOrders}>
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. TABLE SECTION */}
      <div className="orders-table-wrapper no-print">
        <div className="table-scroll">
          <table className="professional-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Booking Date</th>
                <th>Delivery Schedule</th>
                <th>Amount</th>
                <th>Transaction</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((order) => {
                const isOnlinePay = order.payment?.method?.toLowerCase() === 'razorpay' || order.payment?.method?.toLowerCase() === 'upi';
                return (
                  <tr key={order._id}>
                    <td className="bold-id" data-label="Order ID">#{order.orderId || order._id?.substring(order._id.length - 6).toUpperCase()}</td>
                    <td data-label="Customer">
                      <div className="cust-cell">
                        <span className="name">{order.customerDetails?.name}</span>
                        <span className="phone">{order.customerDetails?.phone}</span>
                      </div>
                    </td>
                    <td data-label="Booking Date">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td data-label="Delivery Schedule">
                      <div className="delivery-badge">
                        {order.deliveryDate && new Date(order.deliveryDate).getFullYear() > 2000
                          ? <>
                              {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
                              <span className="time-tag">
                                {new Date(order.deliveryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </>
                          : <span className="no-date-tag">No date assigned</span>
                        }
                      </div>
                    </td>
                    <td className="price-cell" data-label="Amount">₹{order.pricing?.total || order.total}</td>
                    <td className="payment-method-cell" data-label="Transaction">
                      <span className={`method-badge ${isOnlinePay ? 'upi' : 'cod'}`}>
                        {!isOnlinePay ? (
                          <><Banknote size={12} /> <span className="badge-text">COD</span></>
                        ) : (
                          <><Wallet size={12} /> <span className="badge-text">UPI</span></>
                        )}
                      </span>
                    </td>
                    <td data-label="Status">
                      <select 
                        className={`status-dropdown ${order.status?.toLowerCase()}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updating === order._id}
                      >
                        {["Ordered", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td data-label="Action">
                      <button className="action-eye" onClick={() => setSelectedOrder(order)} title="View Details">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION */}
        <div className="pagination-footer">
          <p className="pagination-info">Showing {currentData.length} of {filteredOrders.length} orders</p>
          <div className="pagination-btns">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
              title="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="page-num">{currentPage} / {totalPages || 1}</span>
            <button 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(p => p + 1)}
              title="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ MODAL (SHOWS EXTENSIVE ONLINE/UPI RAZORPAY METADATA) */}
      {selectedOrder && (
        <div className="modal-overlay no-print" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <h2>Order Details</h2>
                <span className="modal-id">#{selectedOrder.orderId || selectedOrder._id?.substring(selectedOrder._id.length - 6).toUpperCase()}</span>
              </div>
              <div className="modal-header-actions">

                <button className="edit-btn" onClick={() => handleEditOrder(selectedOrder)}> Edit Order
                </button>
  
                <button className="print-btn" onClick={handlePrint} title="Print Invoice">
                  <Printer size={18} /> <span className="btn-label">Print Invoice</span>
                </button>
                <button className="close-modal" onClick={() => setSelectedOrder(null)} title="Close">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-grid">
                <div className="modal-section">
                  <h3><MapPin size={16} /> Delivery Info</h3>
                  <div className="info-card">
                    <p className="primary-text">{selectedOrder.customerDetails?.name}</p>
                    <p className="secondary-text">{selectedOrder.customerDetails?.address}</p>
                    <p className="secondary-text">Pincode: {selectedOrder.customerDetails?.pincode}</p>
                    <p className="phone-link"><Phone size={14} /> {selectedOrder.customerDetails?.phone}</p>
                  </div>
                </div>

                <div className="modal-section">
                  <h3><Calendar size={16} /> Schedule & Status</h3>
                  <div className="info-card">
                    <p><strong>Date Ordered:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</p>
                    <p><strong>Delivery Date:</strong> {selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString('en-IN') : 'As Soon As Possible'}</p>
                    <p><strong>Order Status:</strong> <span className={`text-status-${selectedOrder.status?.toLowerCase()}`} style={{fontWeight: 600}}>{selectedOrder.status}</span></p>
                  </div>
                </div>
              </div>

              {/* ✅ UPI / RAZORPAY TRANSACTION AUDIT BOX - ONLY RENDERED HERE IN MODAL VIEW */}
              {(selectedOrder.payment?.method?.toLowerCase() === 'razorpay' || selectedOrder.payment?.method?.toLowerCase() === 'upi') && (
                <div className="modal-section" style={{ marginTop: '16px' }}>
                  <h3 style={{ color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={16} /> Secure Online Gateway Parameters
                  </h3>
                  <div className="info-card" style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                      <p style={{ margin: 0 }}><strong>Payment Method:</strong> <span style={{ textTransform: 'uppercase', color: '#0369a1', fontWeight: 600 }}>UPI (Razorpay)</span></p>
                      <p style={{ margin: 0 }}><strong>Settlement Status:</strong> <span style={{ color: '#16a34a', fontWeight: 600 }}>● {selectedOrder.payment?.status || 'Paid'}</span></p>
                      <p style={{ margin: 0 }}><strong>Transacted Amount:</strong> <span style={{ color: '#0369a1', fontWeight: 700, fontSize: '14px' }}>₹{selectedOrder.pricing?.total || selectedOrder.total}</span></p>
                    </div>
                    
                    <div style={{ borderTop: '1px dashed #BAE6FD', marginTop: '10px', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontFamily: 'monospace', color: '#334155' }}>
                      {selectedOrder.razorpayOrderId && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Razorpay Order ID:</span>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedOrder.razorpayOrderId}</span>
                        </div>
                      )}
                      {selectedOrder.razorpayPaymentId && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Razorpay Payment ID:</span>
                          <span style={{ fontWeight: 600, color: '#16a34a' }}>{selectedOrder.razorpayPaymentId}</span>
                        </div>
                      )}
                      {selectedOrder.razorpaySignature && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                          <span>Cryptographic Signature Key:</span>
                          <span style={{ fontSize: '10px', color: '#64748b', wordBreak: 'break-all', backgroundColor: '#fff', padding: '4px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                            {selectedOrder.razorpaySignature}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* COD INFORMATION BOX */}
              {selectedOrder.payment?.method?.toLowerCase() === 'cod' && (
                <div className="modal-section" style={{ marginTop: '16px' }}>
                  <h3 style={{ color: '#854d0e' }}><Banknote size={16} /> Collect On Delivery Details</h3>
                  <div className="info-card" style={{ backgroundColor: '#FEFCE8', border: '1px solid #FEF08A', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '13px' }}><strong>Amount Outstanding at Doorstep:</strong> <span style={{ color: '#a16207', fontWeight: 700 }}>₹{selectedOrder.pricing?.total || selectedOrder.total}</span></p>
                  </div>
                </div>
              )}

              <div className="modal-section" style={{ marginTop: '16px' }}>
                <h3><Package size={16} /> Items ({selectedOrder.items?.length})</h3>
                <div className="modal-items-scroll">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="modal-item-row">
                      <img src={item.image || item.productId?.productimage} alt="" className="modal-item-img" />
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-meta">₹{item.price} × {item.quantity}</span>
                      </div>
                      <span className="item-total-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section billing-summary">
                <div className="bill-row"><span>Subtotal</span> <span>₹{selectedOrder.pricing?.subtotal}</span></div>
                <div className="bill-row"><span>Delivery</span> <span>₹{selectedOrder.pricing?.deliveryCharge}</span></div>
                {selectedOrder.pricing?.discount > 0 && (
                  <div className="bill-row"><span>Discount</span> <span>- ₹{selectedOrder.pricing?.discount}</span></div>
                )}
                <div className="bill-row total"><span>Grand Total</span> <span>₹{selectedOrder.pricing?.total || selectedOrder.total}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}


{isEditOpen && editForm && (
  <div
    className="modal-overlay"
    onClick={() => setIsEditOpen(false)}
  >
    <div
      className="order-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2>Edit Order</h2>

        <button
          className="close-modal"
          onClick={() => setIsEditOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      <div className="modal-body">

        {/* CUSTOMER DETAILS */}

        <h3>Customer Details</h3>

        <input
          type="text"
          placeholder="Customer Name"
          value={editForm.customerDetails?.name || ""}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              customerDetails: {
                ...editForm.customerDetails,
                name: e.target.value,
              },
            })
          }
        />

        <input
          type="text"
          placeholder="Phone"
          value={editForm.customerDetails?.phone || ""}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              customerDetails: {
                ...editForm.customerDetails,
                phone: e.target.value,
              },
            })
          }
        />

        <textarea
          placeholder="Address"
          value={editForm.customerDetails?.address || ""}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              customerDetails: {
                ...editForm.customerDetails,
                address: e.target.value,
              },
            })
          }
        />

        <input
          type="text"
          placeholder="Pincode"
          value={editForm.customerDetails?.pincode || ""}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              customerDetails: {
                ...editForm.customerDetails,
                pincode: e.target.value,
              },
            })
          }
        />

        {/* DELIVERY DATE */}

        <h3>Delivery Date</h3>

        <input
          type="datetime-local"
          value={
            editForm.deliveryDate
              ? new Date(editForm.deliveryDate)
                  .toISOString()
                  .slice(0, 16)
              : ""
          }
          onChange={(e) =>
            setEditForm({
              ...editForm,
              deliveryDate: e.target.value,
            })
          }
        />

        {/* ORDER STATUS */}

        <h3>Order Status</h3>

        <select
          value={editForm.status}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              status: e.target.value,
            })
          }
        >
          <option value="Ordered">Ordered</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* PAYMENT */}

        <h3>Payment</h3>

        <select
          value={editForm.payment?.method}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              payment: {
                ...editForm.payment,
                method: e.target.value,
              },
            })
          }
        >
          <option value="cod">COD</option>
          <option value="upi">UPI</option>
          <option value="razorpay">Razorpay</option>
        </select>

        <select
          value={editForm.payment?.status}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              payment: {
                ...editForm.payment,
                status: e.target.value,
              },
            })
          }
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
        </select>

        {/* PRICING */}

      

        {/* PRODUCTS */}

        <h3>Products</h3>

        {editForm.items?.map(
          (item: any, index: number) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <label>Product Name</label>
              <input
                type="text"
                placeholder="Product Name"
                value={item.name}
                onChange={(e) => {
                  const items = [...editForm.items];
                  items[index].name =
                    e.target.value;

                  setEditForm({
                    ...editForm,
                    items,
                  });
                }}
              />

              {/* <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => {
                  const items = [...editForm.items];
                  items[index].price =
                    Number(e.target.value);

                  setEditForm({
                    ...editForm,
                    items,
                  });
                }}
              /> */}

<label>Price</label>
              <input
  type="number"
  placeholder="Price"
  value={item.price}
  onChange={(e) => {
    const items = [...editForm.items];

    items[index].price = Number(
      e.target.value
    );

    const pricing = recalculatePricing(
      items,
      editForm.pricing
    );

    setEditForm({
      ...editForm,
      items,
      pricing,
    });
  }}
/>
<label>Quantity</label>

              {/* <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => {
                  const items = [...editForm.items];
                  items[index].quantity =
                    Number(e.target.value);

                  setEditForm({
                    ...editForm,
                    items,
                  });
                }}
              /> */}


              <input
  type="number"
  placeholder="Quantity"
  value={item.quantity}
  onChange={(e) => {
    const items = [...editForm.items];

    items[index].quantity = Number(
      e.target.value
    );

    const pricing = recalculatePricing(
      items,
      editForm.pricing
    );

    setEditForm({
      ...editForm,
      items,
      pricing,
    });
  }}
/>
            </div>
          )
        )}

          <h3>Pricing</h3>


        {/* <label>Subtotal</label>
        <input
          type="number"
          placeholder="Subtotal"
          value={editForm.pricing?.subtotal || 0}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              pricing: {
                ...editForm.pricing,
                subtotal: Number(e.target.value),
              },
            })
          }
        /> */}

<label>Subtotal</label>
<input
  type="number"
  value={editForm.pricing?.subtotal || 0}
  readOnly
  className="readonly-input"
/>


        <label>Delivery Charge</label>
        <input
  type="number"
  value={
    editForm.pricing?.deliveryCharge || 0
  }
  onChange={(e) => {
    const pricing = {
      ...editForm.pricing,
      deliveryCharge: Number(
        e.target.value
      ),
    };

    const updatedPricing =
      recalculatePricing(
        editForm.items,
        pricing
      );

    setEditForm({
      ...editForm,
      pricing: updatedPricing,
    });
  }}
/>


        <label>Discount</label>
<input
  type="number"
  value={
    editForm.pricing?.discount || 0
  }
  onChange={(e) => {
    const pricing = {
      ...editForm.pricing,
      discount: Number(
        e.target.value
      ),
    };

    const updatedPricing =
      recalculatePricing(
        editForm.items,
        pricing
      );

    setEditForm({
      ...editForm,
      pricing: updatedPricing,
    });
  }}
/>


        <label>Grand Total</label>
        {/* <input
          type="number"
          placeholder="Grand Total"
          value={editForm.pricing?.total || 0}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              pricing: {
                ...editForm.pricing,
                total: Number(e.target.value),
              },
            })
          }
        /> */}

        <input
  type="number"
  value={editForm.pricing?.total || 0}
  readOnly
/>

        {/* SAVE */}

        <button
          className="save-btn"
          onClick={saveEditedOrder}
        >
          Save Changes
        </button>

      </div>
    </div>
  </div>
)}


      <div className="print-area">
  {selectedOrder &&
    (() => {

      const itemsPerPage = 15;

      const totalPages = Math.ceil(
        selectedOrder.items.length / itemsPerPage
      );

      return (
        <>
          {Array.from({
            length: totalPages,
          }).map((_, pageIndex) => {

            const start =
              pageIndex * itemsPerPage;

            const end =
              start + itemsPerPage;

            const pageItems =
              selectedOrder.items.slice(
                start,
                end
              );

            const isLastPage =
              pageIndex === totalPages - 1;

            return (
              <div
                className="invoice-page"
                key={pageIndex}
              >

                {/* HEADER */}
                <div className="invoice-header">

                  <div>
                    <Logo />

                    {/* <h1>
                      RAJAGIRI RASI BAKERY
                    </h1> */}

                    <p>
                      Order ID:
                      #{selectedOrder.orderId}
                    </p>

                    <p>
                      Date:
                      {new Date(
                        selectedOrder.createdAt
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="company-info">
                    <h3>
                     Rajagiri Rasi Bakery & Sweets
                    </h3>

                    <p>
                      Madarasa Street,
                      Rajagiri
                    </p>

                    <p>
                      Thanjavur,
                      Tamil Nadu
                    </p>

                    <p>
                      +91 94434 76738
                    </p>
                  </div>

                </div>

                {/* CUSTOMER DETAILS ONLY FIRST PAGE */}
                {pageIndex === 0 && (
                  <div className="customer-section">

                    <div>
                      <h4>
                        Customer Details
                      </h4>

                      <p>
                        <strong>
                          {
                            selectedOrder
                              .customerDetails?.name
                          }
                        </strong>
                      </p>

                      <p>
                        {
                          selectedOrder
                            .customerDetails?.address
                        }
                      </p>

                      <p>
                        {
                          selectedOrder
                            .customerDetails?.phone
                        }
                      </p>
                    </div>

                    <div>
                      <h4>Delivery</h4>

                      <p>
                        {selectedOrder.deliveryDate
                          ? new Date(
                              selectedOrder.deliveryDate
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "Not Assigned"}
                      </p>

                      <p>
                        {
                          selectedOrder.payment?.method
                        }
                      </p>
                    </div>

                  </div>
                )}

                {/* TABLE */}
                <table className="invoice-table">

                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>

                    {pageItems.map(
                      (
                        item: any,
                        index: number
                      ) => (
                        <tr key={index}>

                          <td>
                            {start + index + 1}
                          </td>

                          <td>
                            {item.name}
                          </td>

                          <td>
                            {item.quantity}
                          </td>

                          <td>
                            ₹{item.price}
                          </td>

                          <td>
                            ₹
                            {item.price *
                              item.quantity}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

                {/* SMALL FOOTER */}
                <div className="small-footer">
                  Page {pageIndex + 1} of{" "}
                  {totalPages}
                </div>

                {/* LAST PAGE ONLY */}
                {isLastPage && (
                  <>

                    {/* TOTALS */}
                    {/* <div className="totals-section">

                      <div>
                        <span>
                          Subtotal
                        </span>

                        <span>
                          ₹
                          {
                            selectedOrder
                              .pricing?.subtotal
                          }
                        </span>
                      </div>

                      <div>
                        <span>
                          Delivery
                        </span>

                        <span>
                          ₹
                          {
                            selectedOrder
                              .pricing
                              ?.deliveryCharge
                          }
                        </span>
                      </div>

                      <div className="grand-total">

                        <span>
                          Grand Total
                        </span>

                        <span>
                          ₹
                          {
                            selectedOrder
                              .pricing?.total
                          }
                        </span>

                      </div>

                    </div> */}

<div className="totals-section">

  <div className="total-row">
    <span className="label">
      Subtotal
    </span>

    <span className="value">
      ₹
      {selectedOrder.pricing?.subtotal || 0}
    </span>
  </div>

  <div className="total-row">
    <span className="label">
      Delivery Charge
    </span>

    <span className="value">
      ₹
      {selectedOrder.pricing?.deliveryCharge || 0}
    </span>
  </div>

  {selectedOrder.pricing?.discount > 0 && (
    <div className="total-row discount-row">

      <span className="label">
        Discount
      </span>

      <span className="discount-value">
        - ₹
        {selectedOrder.pricing?.discount}
      </span>

    </div>
  )}

  <div className="grand-total">

    <span>
      Grand Total
    </span>

    <span>
      ₹
      {selectedOrder.pricing?.total || 0}
    </span>

  </div>

</div>
                

                    {/* THANK YOU */}
               

                  </>
                )}

                     <div className="thankyou-footer">

                      <h3>
                        Thank you for choosing
                        Rajagiri Rasi Bakery!
                      </h3>

                      <p>
                        Visit again for fresh
                        cakes, sweets, and
                        savories.
                      </p>

                    </div>

              </div>
            );
          })}
        </>
      );
    })()}
</div>
    </div>
  );
};

export default Orders;
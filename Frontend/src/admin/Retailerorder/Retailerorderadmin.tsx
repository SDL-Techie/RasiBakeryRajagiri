import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, Search, Loader2, MapPin, Phone, Calendar, 
  Package, X, CreditCard, RefreshCcw, Printer, 
  Download, ChevronLeft, ChevronRight, Filter,
  Wallet, Banknote, ShoppingBag, IndianRupee
} from 'lucide-react';
import axios from 'axios';
import Logo from '../../components/Logo/Logo';
import './Retailerorderadmin.css';

const Retailerorderadmin: React.FC = () => {
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

  // const fetchOrders = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.get("http://localhost:4000/api/v1/order");
  //     console.log(res.data.data)
  //     if (res.data.success) {
  //       setOrders(res.data.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching orders:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchOrders = async () => {
  try {
    setLoading(true);
    const res = await axios.get("http://localhost:4000/api/v1/getallordercod");
    // console.log("retailer orders:", res.data.data);
    if (res.data.success) {
      // Filter the data here before saving it to state
      const customerOnlyOrders = res.data.data.filter(
        (order: any) => order.customerDetails?.role === "retailer"
      );
      
      setOrders(customerOnlyOrders);
      //console.log("Filtered Customer Orders:", customerOnlyOrders);
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
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const orderDate = new Date(o.createdAt).setHours(0,0,0,0);
      const start = startDate ? new Date(startDate).setHours(0,0,0,0) : null;
      const end = endDate ? new Date(endDate).setHours(23,59,59,999) : null;

      const matchesDate = (!start || orderDate >= start) && (!end || orderDate <= end);

      return matchesSearch && matchesDate;
    });
  }, [orders, searchTerm, startDate, endDate]);

  // Stats Calculations
  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const revenue = filteredOrders.reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);
    // const upi = filteredOrders
    //   .filter(o => o.payment?.method?.toLowerCase() === 'razorpay')
    //   .reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);
      const upi = filteredOrders
    .filter(o => {
      const method = o.payment?.method?.toLowerCase() || "";
      return method === "upi" || method === "razorpay";
    })
    .reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);

  //   const cod = filteredOrders
  //     .filter(o => o.payment?.method?.toLowerCase() === 'cod')
  //     .reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);

  //   return { total, revenue, upi, cod };
  // }, [filteredOrders]);

    const cod = filteredOrders
    .filter(o => o.payment?.method?.toLowerCase() === "cod")
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
      const res = await axios.put(`http://localhost:4000/api/v1/order/${orderId}`, { status: newStatus });

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
      {/* 1. STATS SECTION */}
      <h1 className="title">Retailer Order Management</h1>
      <div className="stats-grid no-print">
        <div className="stat-card">
          <div className="stat-icon brown"><ShoppingBag /></div>
          <div className="stat-info">
            <p>Total Orders</p>
            <h3>{stats.total}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon brown"><IndianRupee /></div>
          <div className="stat-info">
            <p>Total Revenue</p>
            <h3>₹{stats.revenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon brown"><Wallet /></div>
          <div className="stat-info">
            <p>UPI Payments</p>
            <h3>₹{stats.upi.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon brown"><Banknote /></div>
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
              <Download size={16} /> Export
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
              {currentData.map((order) => (
                <tr key={order._id}>
                  <td className="bold-id">#{order.orderId}</td>
                  <td>
                    <div className="cust-cell">
                      <span className="name">{order.customerDetails?.name}</span>
                      <span className="phone">{order.customerDetails?.phone}</span>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  {/* <td>
                    <div className="delivery-badge">
                      <Calendar size={14} />
                      {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
                      <span className="time-tag">
                        {new Date(order.deliveryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </td> */}

                  <td>
  {order.deliveryDate ? (
    <div className="delivery-badge">
      <Calendar size={14} />
      {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
      <span className="time-tag">
        {new Date(order.deliveryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  ) : (
    <span className="no-assignment">Not Assigned</span>
  )}
</td>


                  <td className="price-cell">₹{order.pricing?.total}</td>
                   {/* <td className="price-method-cell">{order.payment?.method}</td> */}
                   {/* <td className="payment-method-cell">
  <span className={`method-badge ${order.payment?.method?.toLowerCase()}`}>
    {order.payment?.method === 'COD' ? (
      <><Banknote size={12} /> COD</>
    ) : (
      <><Wallet size={12} /> UPI</>
    )}
  </span>
</td> */}

<td className="payment-method-cell">
  {(() => {
    const isOnline =
      order.payment?.method?.toLowerCase() === "razorpay" ||
      order.payment?.method?.toLowerCase() === "upi";

    return (
      <span className={`method-badge ${isOnline ? "upi" : "cod"}`}>
        {isOnline ? (
          <>
            <Wallet size={12} /> UPI
          </>
        ) : (
          <>
            <Banknote size={12} /> COD
          </>
        )}
      </span>
    );
  })()}
</td>
                  <td>
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
                  <td>
                    <button className="action-eye" onClick={() => setSelectedOrder(order)}>
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION */}
        <div className="pagination-footer">
          <p>Showing {currentData.length} of {filteredOrders.length} orders</p>
          <div className="pagination-btns">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="page-num">{currentPage} / {totalPages || 1}</span>
            <button 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL & INVOICE REMAINS (Logic same, but styled with new CSS classes) */}
      {/* ... (Keep your existing Modal and Invoice Print Area structure) ... */}

       {selectedOrder && (
        <div className="modal-overlay no-print" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Order Details</h2>
                <span className="modal-id">#{selectedOrder.orderId}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="print-btn" onClick={handlePrint}>
                  <Printer size={18} /> Print Invoice
                </button>
                <button className="close-modal" onClick={() => setSelectedOrder(null)}><X /></button>
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
                  <h3><Calendar size={16} /> Schedule</h3>
                  <div className="info-card">
                    {/* <p><strong>Date:</strong> {new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p> */}
                    <p>
  <strong>Date:</strong>{" "}
  {selectedOrder.deliveryDate
    ? new Date(selectedOrder.deliveryDate).toLocaleDateString()
    : "Not Assigned"}
</p>

{/* <p>
  <strong>Time Slot:</strong>{" "}
  {selectedOrder.deliveryDate
    ? new Date(selectedOrder.deliveryDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A"}
</p> */}
                    <p><strong>Time Slot:</strong> {selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}</p>
                    {/* <p><strong>Method:</strong> {selectedOrder.payment?.method?.toUpperCase()}</p> */}
                    <p>
  <strong>Method:</strong>{" "}
  {selectedOrder.payment?.method?.toLowerCase() === "razorpay"
    ? "UPI"
    : selectedOrder.payment?.method?.toUpperCase()}
</p>
                    <p><strong>Status:</strong> {selectedOrder.payment?.status}</p>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3><Package size={16} /> Items ({selectedOrder.items?.length})</h3>
                <div className="modal-items-scroll">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="modal-item-row">
                      <img src={item.image} alt="" className="modal-item-img" />
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
                <div className="bill-row total"><span>Grand Total</span> <span>₹{selectedOrder.pricing?.total}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}


<div className="print-area" >
  {selectedOrder && (

   <div className="print-area" style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
  {selectedOrder && (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header with Real Brand Data */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #4B2E2B', paddingBottom: '20px' }}>
        <div>
          <Logo/>
          <h1 style={{ color: '#4B2E2B', margin: 0, fontSize: '1.8rem', letterSpacing: '1px' }}>RASI BAKERY</h1>
          <p style={{ margin: '5px 0', color: '#666' }}>Order ID: <span style={{ color: '#4B2E2B', fontWeight: 'bold' }}>#{selectedOrder.orderId}</span></p>
          <p style={{ margin: 0, color: '#666' }}>Date: {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#4B2E2B' }}>
          <h3 style={{ margin: 0, color: '#4B2E2B' }}>Rasi Bakery & Sweets</h3>
          <p style={{ margin: '2px 0' }}>Madarasa Street, Rajagiri</p>
          <p style={{ margin: '2px 0' }}>Thanjavur, Tamil Nadu 614207</p>
          <p style={{ margin: '2px 0' }}>Ph: +91 94434 76738</p>
          <p style={{ margin: '2px 0' }}>Email: rajagirirasibakery@gmail.com</p>
        </div>
      </div>

      {/* Customer & Schedule Section */}
      <div style={{ display: 'flex', marginTop: '30px', gap: '50px' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#8C5A3C', borderBottom: '1px solid #eee', paddingBottom: '5px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Bill To</h4>
          <p style={{ margin: '10px 0 5px 0' }}><strong>{selectedOrder.customerDetails?.name}</strong></p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>{selectedOrder.customerDetails?.address}</p>
          <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#555' }}>Phone: {selectedOrder.customerDetails?.phone}</p>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#8C5A3C', borderBottom: '1px solid #eee', paddingBottom: '5px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Delivery Schedule</h4>
          {/* <p style={{ margin: '10px 0 5px 0' }}><strong>Date:</strong> {new Date(selectedOrder.deliveryDate).toLocaleDateString('en-IN')}</p> */}
          <strong>Date:</strong>{" "}
{selectedOrder.deliveryDate
  ? new Date(selectedOrder.deliveryDate).toLocaleDateString('en-IN')
  : "Not Assigned"}
          <p style={{ margin: '5px 0' }}><strong>Time Slot:</strong> {new Date(selectedOrder.deliveryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          {/* <p style={{ margin: '5px 0' }}><strong>Payment:</strong> {selectedOrder.payment?.method?.toUpperCase()} ({selectedOrder.payment?.status})</p> */}
          <strong>Payment:</strong>{" "}
{selectedOrder.payment?.method?.toLowerCase() === "razorpay"
  ? "UPI"
  : selectedOrder.payment?.method?.toUpperCase()}
        </div>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#FDF4ED', color: '#4B2E2B' }}>
            <th style={{ padding: '12px 10px', textAlign: 'left', borderBottom: '2px solid #4B2E2B' }}>Item Description</th>
            <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #4B2E2B' }}>Qty</th>
            <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #4B2E2B' }}>Price</th>
            <th style={{ padding: '12px 10px', textAlign: 'right', borderBottom: '2px solid #4B2E2B' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {selectedOrder.items?.map((item:any, i:any) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 10px', fontWeight: '500' }}>{item.name}</td>
              <td style={{ padding: '12px 10px', textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ padding: '12px 10px', textAlign: 'center' }}>₹{item.price}</td>
              <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600' }}>₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div style={{ marginLeft: 'auto', width: '280px', marginTop: '30px', backgroundColor: '#FDF4ED', padding: '15px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#666' }}>Subtotal:</span>
          <span>₹{selectedOrder.pricing?.subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#666' }}>Delivery Charge:</span>
          <span>₹{selectedOrder.pricing?.deliveryCharge}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '10px', color: '#4B2E2B', borderTop: '1px solid #4B2E2B', paddingTop: '10px' }}>
          <span>Grand Total:</span>
          <span>₹{selectedOrder.pricing?.total}</span>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ marginTop: '60px', textAlign: 'center', borderTop: '1px dashed #ccc', paddingTop: '20px' }}>
        <p style={{ margin: 0, color: '#4B2E2B', fontWeight: '600' }}>Thank you for choosing Rasi Bakery!</p>
        <p style={{ margin: '5px 0', color: '#888', fontSize: '0.75rem' }}>
          Visit again for fresh cakes, sweets, and savories.
        </p>
        {/* <p style={{ margin: 0, color: '#aaa', fontSize: '0.7rem', fontStyle: 'italic' }}>
          This is a computer-generated invoice. No signature required.
        </p> */}
      </div>
    </div>
  )}
</div>
  )}
  </div>
      
    </div>
  );
};

export default Retailerorderadmin;
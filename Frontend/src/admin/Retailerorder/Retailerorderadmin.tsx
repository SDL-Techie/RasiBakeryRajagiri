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
    const res = await axios.get("http://localhost:4000/api/v1/getallordercod", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
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
  // const filteredOrders = useMemo(() => {
  //   return orders.filter(o => {
  //     const matchesSearch = 
  //       o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       o.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
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


{/* PRINT AREA */}
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
                      Rajagiri Rasi Bakery
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



export default Retailerorderadmin;






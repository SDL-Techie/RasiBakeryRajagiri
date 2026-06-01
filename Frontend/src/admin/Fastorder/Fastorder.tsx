


import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
    Package, Calendar, MapPin, Phone, 
    Building2, Eye, Search, Filter, RefreshCcw, 
    Download, ShoppingBag, IndianRupee, Wallet, 
    Banknote, X, Printer, Loader2
} from 'lucide-react';
import './Fastorder.css';
import Logo from '@/src/components/Logo/Logo';


const Fastorder: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:4000/api/v1/all-retailer-orders', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
            console.log(res)
            if (res.data.success) {
                setOrders(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching admin orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const handlePrint = () => {
        if (selectedOrder) {
            setTimeout(() => {
                window.print();
            }, 100);
        }
    };

    // 1. FILTERING LOGIC (Search + Dates)
    // const filteredOrders = useMemo(() => {
    //     return orders.filter(o => {
    //         const matchesSearch = 
    //             o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             o.retailerDetails?.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
            
    //         const orderDate = new Date(o.createdAt).setHours(0,0,0,0);
    //         const start = startDate ? new Date(startDate).setHours(0,0,0,0) : null;
    //         const end = endDate ? new Date(endDate).setHours(23,59,59,999) : null;

    //         const matchesDate = (!start || orderDate >= start) && (!end || orderDate <= end);
    //         return matchesSearch && matchesDate;
    //     });
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

    // 2. STATS CALCULATION
    const stats = useMemo(() => {
        const total = filteredOrders.length;
        const revenue = filteredOrders.reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);
        const upi = filteredOrders
            .filter(o => o.payment?.method?.toLowerCase() === 'upi')
            .reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);
        const cod = filteredOrders
            .filter(o => o.payment?.method?.toLowerCase() === 'cod')
            .reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);

        return { total, revenue, upi, cod };
    }, [filteredOrders]);

    const handleExport = () => {
        const headers = ["Order ID,Business Name,Date,Total,Status,Payment"];
        const rows = filteredOrders.map(o => 
            `${o.orderId},${o.retailerDetails?.businessName},${new Date(o.createdAt).toLocaleDateString()},${o.pricing?.total},${o.status},${o.payment?.method}`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `wholesale_export_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdating(orderId);
        try {
            const res = await axios.put(`http://localhost:4000/api/v1/retailer-order/${orderId}`, { status: newStatus }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
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
        <div className="admin-loader">
            <Loader2 className="spinner" size={48} />
            <p>Fetching Wholesale Data...</p>
        </div>
    );

    return (
        <div className="admin-order-page">

            <h1 className="title">Fast Order Management (wholesale)</h1>
            
            {/* STATS SECTION */}
            <div className="stats-grid no-print">
                <div className="stat-card">
                    <div className="stat-icon brown"><ShoppingBag size={20} /></div>
                    <div className="stat-info">
                        <p>B2B Orders</p>
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
                        <p>UPI (Wholesale)</p>
                        <h3>₹{stats.upi.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon brown"><Banknote size={20} /></div>
                    <div className="stat-info">
                        <p>COD (Wholesale)</p>
                        <h3>₹{stats.cod.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            {/* HEADER */}
            <div className="admin-header no-print">
                <div className="header-left">
                    <h1>Wholesale Orders</h1>
                    <p className="header-desc">Manage and track all B2B retailer requests</p>
                </div>
                <div className="action-buttons">
                    <button className="export-btn" onClick={handleExport}>
                        <Download size={16} /> <span className="btn-text">Export</span>
                    </button>
                    <button className="refresh-btn" onClick={fetchAllOrders}>
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </div>

            {/* FILTER CONTROLS */}
            <div className="admin-controls no-print">
                <div className="search-bar">
                    {/* <Search size={18} className="search-icon" /> */}
                    <input 
                        type="text" 
                        placeholder="Search by ID or Shop Name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="date-group">
                    <div className="date-input">
                        <span className="date-label">From:</span>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="date-input">
                        <span className="date-label">To:</span>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
            </div>

            {/* TABLE SECTION */}
            <div className="table-container no-print">
                <div className="table-scroll">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Business Details</th>
                                <th>Logistics</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order._id}>
                                    <td className="order-id-cell" data-label="Order ID">
                                        <span className="id-txt">#{order.orderId}</span>
                                        <span className="date-txt">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                                    </td>
                                    <td data-label="Business Details">
                                        <div className="biz-info">
                                            <div className="biz-name"><Building2 size={14}/> {order.retailerDetails?.businessName}</div>
                                            <div className="biz-sub"><Phone size={12}/> {order.retailerDetails?.phone}</div>
                                        </div>
                                    </td>
                                    <td data-label="Logistics">
                                        <div className="logistics-info">
                                            <span className="type-badge">{order.logistics?.orderType}</span>
                                            <div className="slot-txt">{order.logistics?.timeSlot}</div>
                                        </div>
                                    </td>
                                    <td className="price-cell" data-label="Amount">
                                        <div className="price-cell-inner">
                                            <span className="total-amt">₹{order.pricing?.total}</span>
                                            <span className={`method-badge ${order.payment?.method?.toLowerCase()}`}>
                                                {order.payment?.method?.toUpperCase()}
                                            </span>
                                        </div>
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
                                        <button className="view-details-btn" onClick={() => setSelectedOrder(order)} title="View Details">
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL & INVOICE */}
            {selectedOrder && (
                <div className="modal-overlay no-print" onClick={() => setSelectedOrder(null)}>
                    <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-header-title">
                                <h2>Wholesale Details</h2>
                                <span className="modal-id">#{selectedOrder.orderId}</span>
                            </div>
                            <div className="modal-header-actions">
                                <button className="print-btn" onClick={handlePrint}>
                                    <Printer size={18} /> <span className="btn-label">Print Invoice</span>
                                </button>
                                <button className="close-modal" onClick={() => setSelectedOrder(null)}><X size={24} /></button>
                            </div>
                        </div>

                        <div className="modal-body">
                            <div className="modal-grid">
                                <div className="modal-section">
                                    <h3><Building2 size={16} /> Retailer Info</h3>
                                    <div className="info-card">
                                        <p className="primary-text">{selectedOrder.retailerDetails?.businessName}</p>
                                        <p className="secondary-text">{selectedOrder.retailerDetails?.address}</p>
                                        <p className="phone-link"><Phone size={14} /> {selectedOrder.retailerDetails?.phone}</p>
                                    </div>
                                </div>
                                <div className="modal-section">
                                    <h3><Calendar size={16} /> Logistics</h3>
                                    <div className="info-card">
                                        <p><strong>Type:</strong> {selectedOrder.logistics?.orderType}</p>
                                        <p><strong>Slot:</strong> {selectedOrder.logistics?.timeSlot}</p>
                                        <p><strong>Payment:</strong> {selectedOrder.payment?.method?.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3><Package size={16} /> Items</h3>
                                <div className="modal-items-scroll">
                                    {selectedOrder.items?.map((item: any, i: number) => (
                                        <div key={i} className="modal-item-row">
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
                                <div className="bill-row total"><span>Grand Total</span> <span>₹{selectedOrder.pricing?.total}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PRINT AREA (Hidden on screen) */}
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
                      RAJAGIRI RASI BAKERY
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
                         RAJAGIRI RASI BAKERY!
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

export default Fastorder;


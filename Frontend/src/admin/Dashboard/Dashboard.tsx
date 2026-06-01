import React, { useState, useEffect } from 'react';
import { 
    ShoppingCart, Package, IndianRupee, Store, Layers, 
    Calendar, Clock, X, MapPin, RefreshCw, ChevronRight, Users, CheckCircle, Truck, AlertCircle, Zap, Menu
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './Dashboard.css';

const API_BASE = "http://localhost:4000/api/v1";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [scheduledOrders, setScheduledOrders] = useState<any[]>([]);
    const [orderBreakdown, setOrderBreakdown] = useState<any[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [stats, setStats] = useState({
        orders: 0, 
        fastOrders: 0,
        customers: 0, 
        retailers: 0, 
        products: 0, 
        categories: 0, 
        revenue: 0,
        todayOrders: 0,    
        todayRevenue: 0,   
        deliveredCount: 0
    });

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [orderRes, userRes, productRes, categoryRes, statusRes, fastOrderRes] = await Promise.all([
                axios.get(`${API_BASE}/getallordercod`,          {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }),
                axios.get(`${API_BASE}/getalluser`,          {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }),
                axios.get(`${API_BASE}/products`),
                axios.get(`${API_BASE}/category`),
                axios.get(`${API_BASE}/getorderstatus`,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }),
                axios.get(`${API_BASE}/all-retailer-orders`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
            ]);

            const allOrders = orderRes.data.data || [];
            const allUsers = userRes.data.data || [];
            const breakdown = statusRes.data.data?.breakdown || [];
            const fastOrders = fastOrderRes.data.data || [];
            
            const todayStr = new Date().toDateString();

            const todayOrdersList = allOrders.filter((order:any) => 
                new Date(order.createdAt).toDateString() === todayStr
            );
            const todayOrdersCount = todayOrdersList.length;
            const todayRevenue = todayOrdersList.reduce((acc: number, curr: any) => acc + (curr.pricing?.total || 0), 0);

            const totalDelivered = allOrders.filter((order: any) => 
                order.status?.toLowerCase() === 'delivered'
            ).length;

            const revenue = allOrders.reduce((acc: number, curr: any) => acc + (curr.pricing?.total || 0), 0);
            const retailers = allUsers.filter((u: any) => u.role?.toLowerCase() === 'retailer');
            const customers = allUsers.filter((u: any) => u.role?.toLowerCase() === 'customer' || u.role?.toLowerCase() === 'user');

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const scheduled = allOrders.filter((order: any) => {
                const dDate = new Date(order.deliveryDate);
                return dDate > today;
            }).sort((a: any, b: any) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());

            setStats({
                orders: allOrders.length,
                fastOrders: fastOrders.length,
                customers: customers.length,
                retailers: retailers.length,
                products: productRes.data.data?.length || 0,
                categories: categoryRes.data.data?.length || 0,
                revenue: revenue,
                todayOrders: todayOrdersCount,
                todayRevenue: todayRevenue,
                deliveredCount: totalDelivered
            });

            setOrderBreakdown(breakdown);
            setRecentOrders(allOrders.slice(0, 6));
            setScheduledOrders(scheduled);
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDashboardData(); }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.5, staggerChildren: 0.1 } 
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };

    if (loading) return (
        <div className="rasi-loading-container">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="rasi-bakery-loader"
            />
            <p>Gathering Rasi Bakery Insights...</p>
        </div>
    );

    return (
        <motion.div 
            className="rasi-dashboard-wrapper"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="rasi-db-header">
                <div className="rasi-db-header-content">
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back, Admin. Here's your bakery's performance.</p>
                </div>
                <button className="rasi-db-refresh-btn" onClick={fetchDashboardData} title="Refresh data">
                    <RefreshCw size={18} /> 
                    <span className="rasi-refresh-text">Refresh</span>
                </button>
            </div>

            {/* --- TOP ROW: PRIMARY STATS --- */}
            <div className="rasi-db-stats-grid">
                {[
                    { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: <IndianRupee />, color: '#2E8B57' },
                    { label: 'Total Orders', value: stats.orders, icon: <Package />, color: '#3b82f6' },
                    { label: 'Fast Orders', value: stats.fastOrders, icon: <Zap />, color: '#f59e0b' },
                    { label: "Today's Revenue", value: `₹${stats.todayRevenue.toLocaleString('en-IN')}`, icon: <Zap />, color: '#8b5cf6' },
                    { label: "Today's Orders", value: stats.todayOrders, icon: <ShoppingCart />, color: '#ec4899' },
                    { label: "Delivered", value: stats.deliveredCount, icon: <CheckCircle />, color: '#10b981' },
                    { label: 'Customers', value: stats.customers, icon: <Users />, color: '#4B2E2B' },
                    { label: 'Retailers', value: stats.retailers, icon: <Store />, color: '#D4AF37' },
                    { label: 'Products', value: stats.products, icon: <Layers />, color: '#6D4C41' }
                ].map((stat, i) => (
                    <motion.div key={i} className="rasi-db-stat-card" variants={itemVariants}>
                        <div className="rasi-db-stat-icon" style={{ background: `${stat.color}10`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="rasi-db-stat-info">
                            <span>{stat.label}</span>
                            <h3>{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* --- ORDER STATUS BREAKDOWN --- */}
            <h3 className="rasi-section-title">Order Pipeline</h3>
            <div className="rasi-db-status-breakdown-grid">
                {orderBreakdown.map((item, idx) => {
                    const statusMap: any = {
                        ordered: { label: 'New Orders', color: '#3b82f6', icon: <ShoppingCart size={16}/> },
                        shipped: { label: 'Shipped', color: '#f59e0b', icon: <Truck size={16}/> },
                        delivered: { label: 'Delivered', color: '#10b981', icon: <CheckCircle size={16}/> },
                        cancelled: { label: 'Cancelled', color: '#ef4444', icon: <AlertCircle size={16}/> }
                    };
                    const config = statusMap[item.status.toLowerCase()] || { label: item.status, color: '#64748b', icon: <Layers size={16}/> };

                    return (
                        <motion.div 
                            key={idx} 
                            className="rasi-db-status-mini-card" 
                            variants={itemVariants}
                            style={{ borderLeft: `4px solid ${config.color}` }}
                        >
                            <div className="rasi-status-mini-header">
                                <span style={{ color: config.color }}>{config.icon}</span>
                                <span className="rasi-status-mini-label">{config.label}</span>
                            </div>
                            <div className="rasi-status-mini-body">
                                <h4>{item.count}</h4>
                                <span className="rasi-status-mini-rev">₹{item.totalRevenue.toLocaleString('en-IN')}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="rasi-db-main-grid">
                {/* --- RECENT ORDERS --- */}
                <motion.div className="rasi-db-card rasi-db-glass" variants={itemVariants}>
                    <div className="rasi-db-card-header">
                        <h3><Clock size={18} /> Recent Activity</h3>
                        <Link to="/admin/orders" className="rasi-db-link">View All <ChevronRight size={14}/></Link>
                    </div>
                    <div className="rasi-db-table-container">
                        <table className="rasi-db-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="rasi-db-customer-name">
                                            {order.customerDetails?.name || "Guest"}
                                            <small>{order.customerDetails?.role}</small>
                                        </td>
                                        <td className="rasi-db-price">₹{order.pricing?.total?.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span className={`rasi-db-badge ${order.status?.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* --- SCHEDULE PANEL --- */}
                <motion.div className="rasi-db-card rasi-db-glass" variants={itemVariants}>
                    <div className="rasi-db-card-header">
                        <h3><Calendar size={18} /> Upcoming Deliveries</h3>
                        <button onClick={() => navigate('/admin/orders')} className="rasi-db-view-more">
                            Manage Orders
                        </button>
                    </div>
                    <div className="rasi-db-schedule-list">
                        {scheduledOrders.length > 0 ? (
                            scheduledOrders.slice(0, 5).map((order, idx) => (
                                <div key={idx} className="rasi-db-schedule-item">
                                    <div className="rasi-db-date-tag">
                                        <span className="rasi-db-day">{new Date(order.deliveryDate).getDate()}</span>
                                        <span className="rasi-db-month">{new Date(order.deliveryDate).toLocaleString('default', { month: 'short' })}</span>
                                    </div>
                                    <div className="rasi-db-schedule-info">
                                        <h4>{order.customerDetails?.name}</h4>
                                        <p>{new Date(order.deliveryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="rasi-no-data">No upcoming deliveries scheduled.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
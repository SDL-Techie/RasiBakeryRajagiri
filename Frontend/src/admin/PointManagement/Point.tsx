import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCoins, FaPercent, FaShoppingBag, FaSave, FaSync, FaInfoCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './Point.css';

const Point = () => {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        minOrderAmount: 0,
        pointsEarnedPerOrder: 0,
        pointsRequiredForDiscount: 0,
        discountPercentage: 0
    });

    // Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message:any, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:4000/api/v1/points-settings');
             console.log(res)
            if (res.data) setSettings(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching settings", err);
            setLoading(false);
        }
    };

    const handleSave = async (e:any) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4000/api/v1/points-settings', settings);
            showToast("Loyalty Rules Updated Successfully!", "success");
            setSettings(res.data.settings);
           
        } catch (err) {
            showToast("Error saving settings", "error");
        }
    };

    return (
        <div className="rasi-users-container">
            {/* Toast Component */}
            {toast.show && (
                <div className={`toast-notification ${toast.type}`}>
                    {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="rasi-users-header">
                <div className="header-info">
                    <h1>Point Management</h1>
                    <span className="user-count-badge">Bakery Rewards Active</span>
                </div>
                {/* <div className="contact-item">
                    <FaInfoCircle />
                    <span className='point-desc'>Configure points earned per Cocoa spent</span>
                </div> */}
            </div>

            {/* Input Card */}
            <div className="rasi-table-card" style={{ 
                padding: '15px'
                , marginBottom: '2rem' }}>
                <form onSubmit={handleSave}>
                    <div className="settings-grid">
                        <div className="input-group">
                            <label><FaShoppingBag /> Min Purchase (₹)</label>
                            <input 
                                type="number" 
                                value={settings.minOrderAmount} 
                                onChange={(e) => setSettings({...settings, minOrderAmount:Number(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label><FaCoins /> Points Earned</label>
                            <input 
                                type="number" 
                                value={settings.pointsEarnedPerOrder} 
                                onChange={(e) => setSettings({...settings, pointsEarnedPerOrder: Number(e.target.value)})}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label><FaSync /> Points Needed</label>
                            <input 
                                type="number" 
                                value={settings.pointsRequiredForDiscount} 
                                onChange={(e) => setSettings({...settings, pointsRequiredForDiscount: Number(e.target.value)})}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label><FaPercent /> Reward (%)</label>
                            <input 
                                type="number" 
                                value={settings.discountPercentage} 
                                onChange={(e) => setSettings({...settings, discountPercentage: Number(e.target.value)})}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="save-settings-btn">
                        <FaSave /> Save Configuration
                    </button>
                </form>
            </div>

            {/* Summary Table */}
            <div className="rasi-table-card">
                <table className="rasi-users-table">
                    <thead>
                        <tr>
                            <th>Rule Overview</th>
                            <th>Value</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="bold-name">Points per purchase above ₹{settings.minOrderAmount}</td>
                            <td><span className="user-count-badge" style={{color: '#5d4037'}}>+{settings.pointsEarnedPerOrder} Pts</span></td>
                            <td><span className="status-badge status-active">Enabled</span></td>
                        </tr>
                        <tr>
                            <td className="bold-name">Threshold for Reward Claim</td>
                            <td><span className="user-count-badge" style={{color: '#5d4037'}}>{settings.pointsRequiredForDiscount} Pts</span></td>
                            <td><span className="status-badge status-active">Enabled</span></td>
                        </tr>
                        <tr>
                            <td className="bold-name">Claimable Benefit</td>
                            <td><span className="user-count-badge" style={{background: '#d4a373', color: 'white'}}>{settings.discountPercentage}% OFF</span></td>
                            <td><span className="status-badge status-active">Enabled</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Point;
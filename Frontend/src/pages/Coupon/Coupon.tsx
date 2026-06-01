import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Award, ShoppingBag, Gift, Star, Copy, CheckCircle, Clock } from 'lucide-react';
import "./Coupon.css";

// --- TypeScript Interfaces ---
interface LoyaltyStatus {
    requiredpointToUnlockdiscount?: number;
    Task?: string;
    Rules?: string;
    currentprogress?: string;
    currentProgress?: string;
}

interface PointsData {
    success?: boolean;
    sucess?: boolean; 
    currentPoints?: number;
    Totalspent?: number;
    OrderAmount?: number;
    Points?: number;
    PointsEarned?: number;
    canRedeem?: boolean;
    pointNeededtoRedeem?: number;
    pointsNeededToRedeem?: number;
    discount?: number;
    discountAvailable?: number;
    loyaltystatus?: LoyaltyStatus;
    loyaltyStatus?: LoyaltyStatus;
}

interface GeneratedCoupon {
    code: string;
    expiry: string;
}

const Coupon: React.FC = () => {
    const [pointsData, setPointsData] = useState<PointsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [redeemedCoupon, setRedeemedCoupon] = useState<GeneratedCoupon | null>(null);
    const [copied, setCopied] = useState<boolean>(false);
    
    const customerphone = localStorage.getItem('customerMobile');

    const fetchPoints = async () => {
        if (!customerphone) return;
        try {
            const res = await axios.get(`http://localhost:4000/api/v1/getuserpoints/${customerphone}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
            if (res.data.sucess || res.data.success) {
                setPointsData(res.data);
            }
        } catch (error: any) {
            console.error("Error fetching loyalty points:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async () => {
        if (!customerphone) return;
        try {
            // Updated to hit your specific coupon claim endpoint route
            const res = await axios.post(`http://localhost:4000/api/v1/coupon`, {
                phone: customerphone 
            }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
            
            if (res.data.success) {
                // 🎯 FIX: Reading root level properties directly from your exact JSON layout response
                setRedeemedCoupon({
                    code: res.data.code,
                    expiry: res.data.expiryDate
                });
                
                // Refresh the profile wallet balances immediately after deduction
                fetchPoints(); 
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "Redemption failed. Please try again.");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        if (customerphone) {
            fetchPoints();
        } else {
            setLoading(false);
        }
    }, [customerphone]);

    if (loading) {
        return (
            <div className="rasi-category-page">
                <div className="rasi-container" style={{ textAlign: 'center', paddingTop: '50px' }}>
                    Loading rewards...
                </div>
            </div>
        );
    }

    if (!pointsData) {
        return (
            <div className="rasi-category-page">
                <div className="rasi-container" style={{ textAlign: 'center', paddingTop: '50px' }}>
                    No loyalty data found.
                </div>
            </div>
        );
    }

    // --- Defensive Parsing Layer ---
    const activeLoyaltyStatus = pointsData.loyaltyStatus || pointsData.loyaltystatus || {};
    
    const currentPoints = pointsData.currentPoints ?? 0;
    const totalSpent = pointsData.Totalspent ?? pointsData.OrderAmount ?? 0;
    const pointsEarned = pointsData.Points ?? pointsData.PointsEarned ?? 0;
    const pointNeededToRedeem = pointsData.pointNeededtoRedeem ?? pointsData.pointsNeededToRedeem ?? 0;
    const canRedeem = pointsData.canRedeem ?? false;
    const discount = pointsData.discount ?? pointsData.discountAvailable ?? 0;

    const requiredPointsToUnlock = activeLoyaltyStatus.requiredpointToUnlockdiscount ?? 100;
    const taskText = activeLoyaltyStatus.Task ?? "";
    const rulesText = activeLoyaltyStatus.Rules ?? "";
    const currentProgressText = activeLoyaltyStatus.currentProgress || activeLoyaltyStatus.currentprogress || `${currentPoints}/${requiredPointsToUnlock}`;

    const progressPercent = requiredPointsToUnlock > 0 
        ? Math.min((currentPoints / requiredPointsToUnlock) * 100, 100) 
        : 0;

    return (
        <div className="rasi-category-page">
            <div className="rasi-container">
                
                {/* Header Section */}
                <div className="rasi-section-header">
                    <button className="rasi-back-btn" onClick={() => window.history.back()}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h2>Loyalty Rewards</h2>
                    <p>Unlock exclusive treats with your Rasi points.</p>
                </div>

                {/* Grid Layout Container */}
                <div className="rasi-products-grid">
                    
                    {/* Box 1: Current Point Balance */}
                    <div className="loyalty-box highlight-box">
                        <Award size={32} className="box-icon" />
                        <span className="box-label">Current Balance</span>
                        <h3 className="box-value">{currentPoints} Points</h3>
                        <div className="status-pill">
                            {canRedeem ? "Reward Ready" : "Earning Points"}
                        </div>
                    </div>

                    {/* Box 2: Goal and Progress Tracker */}
                    <div className="loyalty-box">
                        <Star size={32} className="box-icon" />
                        <span className="box-label">Goal: {requiredPointsToUnlock} Points</span>
                        <div className="rasi-progress-container">
                            <div 
                                className="progress-bar-fill" 
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <span className="box-sub-value">
                            {currentProgressText}
                        </span>
                        {taskText && <p className="box-text">{taskText}</p>}
                    </div>

                    {/* Box 3: Historical Spent Tracking */}
                    <div className="loyalty-box">
                        <ShoppingBag size={32} className="box-icon" />
                        <span className="box-label">Lifetime Spend</span>
                        <h3 className="box-value">₹{totalSpent}</h3>
                        <span className="points-added">+{pointsEarned} Total Points</span>
                    </div>

                    {/* Box 4: Coupon Redemption Actions */}
                    <div className="loyalty-box redemption-box">
                        <Gift size={32} className="box-icon" />
                        <span className="box-label">Reward Status</span>
                        
                        {redeemedCoupon ? (
                            <div className="coupon-display">
                                <div className="coupon-code-wrap" onClick={() => copyToClipboard(redeemedCoupon.code)}>
                                    <span className="actual-code">{redeemedCoupon.code}</span>
                                    {copied ? <CheckCircle size={16} color="#27ae60" /> : <Copy size={16} />}
                                </div>
                                <div className="expiry-tag">
                                    <Clock size={12} /> Unused Coupon Active
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="box-value">
                                    {discount}% Discount
                                </h3>
                                
                                {canRedeem ? (
                                    <button className="rasi-btn-primary" onClick={handleRedeem}>
                                        Redeem {discount}% Coupon
                                    </button>
                                ) : (
                                    <p className="box-text-small">Need {pointNeededToRedeem} more points</p>
                                )}
                            </>
                        )}
                    </div>

                </div>

                {/* Banner notification after successful execution */}
                {redeemedCoupon && (
                    <div className="success-banner">
                        <CheckCircle size={20} />
                        <span>Coupon generated! Copy code <strong>{redeemedCoupon.code}</strong> and apply it on your next order.</span>
                    </div>
                )}

                {/* Strategic summary rule box layout baseline */}
                {rulesText && (
                    <div className="loyalty-rule-box">
                        <strong>Earning Rules:</strong> {rulesText}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Coupon;
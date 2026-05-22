import mongoose from "mongoose";

// 1. Schema for Global Admin Settings
const pointSettingSchema = new mongoose.Schema({
    minOrderAmount: {
        type: Number,
        required: true,
        default: 500, // Minimum spend to earn any points
    },
    pointsEarnedPerOrder: {
        type: Number,
        required: true,
        default: 1, // How many points given per valid order
    },
    pointsRequiredForDiscount: {
        type: Number,
        required: true,
        default: 10, // Milestone needed to unlock discount
    },
    discountPercentage: {
        type: Number,
        required: true,
        default: 20, // The % off the user gets
    }
}, { timestamps: true });

// 2. Schema to track points and history for each User
const userPointSchema = new mongoose.Schema({
    userPhone: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    customerName: {
        type: String,
        default: ""
    },
    userRole: {
        type: String,
        default: "customer"
    },
    totalAmountSpent: {
        type: Number,
        default: 0
    },
    currentPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    totalPointsEarned: {
        type: Number,
        default: 0
    },
    activeCoupons: [{
        code: { type: String, required: true },
        discountValue: { type: Number, required: true }, 
        expiresAt: { type: Date, required: true },
        isUsed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    history: [{
        orderId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Order' 
        },
        pointsChanged: {
            type: Number,
            required: true
        },
        type: { 
            type: String, 
            enum: ['earned', 'redeemed'],
            required: true 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        }
    }]
}, { timestamps: true });

// Initialize Models
const PointSetting = mongoose.model("PointSetting", pointSettingSchema);
const UserPoint = mongoose.model("UserPoint", userPointSchema);

// Export both
export { PointSetting, UserPoint };
import mongoose from "mongoose";

const userpointSchemas = new mongoose.Schema({
    userPhone: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    },
    // This tracks their current balance (e.g., drops from 200 to 100 when they redeem)
    currentPoints: { 
        type: Number, 
        // default: 0 
    },

        totalPointsEarned: {
        type: Number,
        // default: 0
    },

    // Total points user redeemed lifetime
    totalPointsRedeemed: {
        type: Number,
        // default: 0
    },

    totalAmountSpent: { 
        type: Number, 
        // default: 0 
    }
}, { timestamps: true });

const UserPoints = mongoose.model("UserPoints", userpointSchemas);
export default UserPoints;


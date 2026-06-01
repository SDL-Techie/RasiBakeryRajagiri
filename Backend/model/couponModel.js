import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  // The actual code generated (e.g., RASI-X8F2K)
  code: {
    type: String,
    required: true,
    unique: true,      // Prevents two users from getting the same code
    uppercase: true,   // Forces uppercase consistency
    trim: true
  },
  userPhone: {
    type: String,
    required: true,
    index: true        
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false   
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, { 
  timestamps: true    
});

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default Coupon;
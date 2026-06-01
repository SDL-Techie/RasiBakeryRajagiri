import mongoose from "mongoose";

const pointsettingSchema = new mongoose.Schema({
    minOrderAmount: { type: Number },  
    pointsEarnedPerOrder: { type: Number },   
    pointsRequiredForDiscount: { type: Number }, 
    discountPercentage: { type: Number},      
    couponValidityDays: { type: Number}
}, { timestamps: true });

const PointSettings = mongoose.models.PointSettings || mongoose.model("PointSettings", pointsettingSchema);
export default PointSettings;
import mongoose from "mongoose";

const retailerOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  retailerDetails: {
    userId:       { type: String, required: true },
    businessName: { type: String, required: true },
    name:         { type: String, required: true },
    phone:        { type: String, required: true },
    address:      { type: String, required: true },
    pincode:      { type: String, required: true },
    landmark:     { type: String },
    isRegistered: { type: Boolean, default: false },
  },
  items: [{
    productId: { type: String, required: true },
    name:      { type: String, required: true },
    category:  { type: String, required: true },
    price:     { type: Number, required: true },
    quantity:  { type: Number, required: true },
    image:     { type: String },
  }],
  logistics: {
    orderType:    { type: String, enum: ["Delivery", "Pickup"], required: true },
    deliveryDate: { type: Date },
    timeSlot:     { type: String },
  },
  pricing: {
    subtotal:       { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    total:          { type: Number, required: true },
  },
  payment: {
    method:            { type: String, enum: ["upi", "cod", "credit", "UPI", "COD"], required: true },
    status:            { type: String, default: "Pending" },
    razorpayOrderId:   { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    paidAt:            { type: Date,   default: null },
  },
  status: {
    type: String,
    enum: ["Ordered", "Processing", "Shipped", "Delivered", "Cancelled", "Ready for Pickup"],
    default: "Ordered",
  },
  createdAt: { type: Date, default: Date.now },
});

const RetailerOrder = mongoose.model("RetailerOrder", retailerOrderSchema);
export default RetailerOrder;
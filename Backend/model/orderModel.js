import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    // required: true, 
    unique: true 
  },
  // Customer details nested for organization
  customerDetails: {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    role:String,
  },
  // Detailed product snapshot at time of purchase
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  // pricing: {
  //   subtotal: Number,
  //   deliveryCharge: { type: Number, default: 50 },
  //   total: Number
  // },

  pricing: {
    subtotal: Number,
    deliveryCharge: { type: Number, default: 50 },
    discount: { type: Number, default: 0 }, // New field
    usePoints: { type: Boolean, default: false }, // New field
    total: Number
  },
  // payment: {

  //   method: { type: String, enum: ['upi', 'cod'], required: true },
  //   status: { type: String, default: "Pending" }
  // },

  payment: {
    method: {
      type: String,
      required: true,
      enum: ['cod', 'upi', 'COD', 'UPI','razorpay','RAZORPAY'], // Allow both cases to prevent crashes
    },
    status: { 
      type: String,
       default: 'Pending',
      enum: ['Pending', 'Paid', 'Failed']
     }
  },

  razorpayOrderId: {
    type: String,
    default: null
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  razorpaySignature: {
    type: String,
    default: null
  },

  // IMPORTANT: The field for the customer's chosen date
  deliveryDate: { 
    type: Date, 
    default: null
 
  },
  status: {
    type: String,
    enum: ["Ordered", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Ordered",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const uniqueString = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderId = `RASI-${uniqueString}`;
  }
  // next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
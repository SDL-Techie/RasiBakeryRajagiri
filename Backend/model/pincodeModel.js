import mongoose from "mongoose";

const pincodeSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
    unique: true, 
    trim: true
  },
  deliveryCharge: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    default: "Active", 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Pincode = mongoose.model("Pincode", pincodeSchema);
export default Pincode;
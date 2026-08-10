import mongoose from "mongoose";

const weightChargeSchema = new mongoose.Schema({
  ratePerKg: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    default: "Active",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const WeightCharge = mongoose.model("WeightCharge", weightChargeSchema);
export default WeightCharge;
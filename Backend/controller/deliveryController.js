import Pincode from "../model/pincodeModel.js";
import WeightCharge from "../model/weightChargeModel.js";

export const calculateDeliveryCharge = async (req, res) => {
  try {
    const { pincode, weight } = req.body; // weight = total cart weight in kg

    // Step 1: PRIMARY — pincode-wise
    const pincodeData = await Pincode.findOne({ pincode, status: "Active" });

    if (pincodeData) {
      return res.status(200).json({
        success: true,
        method: "pincode",
        deliveryCharge: pincodeData.deliveryCharge,
      });
    }

    // Step 2: FALLBACK — pincode not found -> kg-wise
    if (!weight || weight <= 0) {
      return res.status(400).json({
        success: false,
        message: "Delivery unavailable for this pincode, and no weight was provided to calculate fallback charge.",
      });
    }

    const weightCharge = await WeightCharge.findOne({ status: "Active" });

    if (!weightCharge) {
      return res.status(404).json({
        success: false,
        message: "Delivery charge unavailable for this pincode, and no weight-wise rate is configured.",
      });
    }

    const deliveryCharge = weightCharge.ratePerKg * weight;

    return res.status(200).json({
      success: true,
      method: "weight",
      ratePerKg: weightCharge.ratePerKg,
      weight,
      deliveryCharge,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
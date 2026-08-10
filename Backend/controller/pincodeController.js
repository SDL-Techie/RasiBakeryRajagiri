// import Pincode from "../model/pincodeModel.js";

// export const savePincodeCharge = async (req, res) => {
//   try {
//     const { pincode, deliveryCharge, status } = req.body;

//     // findOneAndUpdate will update if it exists, or create if it doesn't (upsert)
//     const updatedPincode = await Pincode.findOneAndUpdate(
//       { pincode },
//       { deliveryCharge, status },
//       { new: true, upsert: true } 
//     );

//     res.status(200).json({ success: true, data: updatedPincode });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getallpincode = async (req, res) => {
//     try {
//         // Use .find() to get all records from the collection
//         const pincodes = await Pincode.find(); 
        
//         // Use 200 for SUCCESS. 500 tells the frontend it failed!
//         res.status(200).json({ 
//             success: true, 
//             data: pincodes 
//         });
//     } catch (err) {
//         // Must use 'err.message' because your variable name is 'err'
//         res.status(500).json({ 
//             success: false, 
//             message: err.message 
//         });
//     }
// };

// // ✅ USER: Get Charge by Pincode
// export const getChargeByPincode = async (req, res) => {
//   try {
//     const { code } = req.params;
//     const data = await Pincode.findOne({ pincode: code, status: "Active" });

//     if (!data) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Delivery is not available for this pincode." 
//       });
//     }

//     res.status(200).json({ success: true, deliveryCharge: data.deliveryCharge });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// export const deletePincode = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedPincode = await Pincode.findByIdAndDelete(id);

//     // If the ID doesn't exist in the database
//     if (!deletedPincode) {
//       return res.status(404).json({
//         success: false,
//         message: "Pincode record not found."
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Pincode deleted successfully.",
//       data: deletedPincode // Optional: returns the document that was deleted
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


import Pincode from "../model/pincodeModel.js";
import WeightCharge from "../model/weightChargeModel.js";

export const savePincodeCharge = async (req, res) => {
  try {
    const { pincode, deliveryCharge, status } = req.body;

    // findOneAndUpdate will update if it exists, or create if it doesn't (upsert)
    const updatedPincode = await Pincode.findOneAndUpdate(
      { pincode },
      { deliveryCharge, status },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: updatedPincode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getallpincode = async (req, res) => {
  try {
    // Use .find() to get all records from the collection
    const pincodes = await Pincode.find();

    res.status(200).json({
      success: true,
      data: pincodes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✅ USER: Get Charge by Pincode — falls back to kg-wise charge if pincode unavailable
export const getChargeByPincode = async (req, res) => {
  try {
    const { code } = req.params;
    const { weight } = req.query; // total order weight in kg, passed as ?weight=3

    // 1. PRIMARY — try pincode-wise charge first
    const pincodeData = await Pincode.findOne({ pincode: code, status: "Active" });

    if (pincodeData) {
      return res.status(200).json({
        success: true,
        method: "pincode",
        deliveryCharge: pincodeData.deliveryCharge
      });
    }

    // 2. FALLBACK — pincode not found or inactive, try kg-wise charge
    const parsedWeight = Number(weight);

    if (!weight || isNaN(parsedWeight) || parsedWeight <= 0) {
      // No usable weight provided, can't compute fallback — behave as before
      return res.status(404).json({
        success: false,
        message: "Delivery is not available for this pincode."
      });
    }

    const weightCharge = await WeightCharge.findOne({ status: "Active" });

    if (!weightCharge) {
      // No kg-wise rate configured either — nothing we can do
      return res.status(404).json({
        success: false,
        message: "Delivery is not available for this pincode."
      });
    }

    const deliveryCharge = weightCharge.ratePerKg * parsedWeight;

    return res.status(200).json({
      success: true,
      method: "weight",
      ratePerKg: weightCharge.ratePerKg,
      weight: parsedWeight,
      deliveryCharge
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePincode = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPincode = await Pincode.findByIdAndDelete(id);

    // If the ID doesn't exist in the database
    if (!deletedPincode) {
      return res.status(404).json({
        success: false,
        message: "Pincode record not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Pincode deleted successfully.",
      data: deletedPincode // Optional: returns the document that was deleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
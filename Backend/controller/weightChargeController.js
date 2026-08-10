import WeightCharge from "../model/weightChargeModel.js";

// Only ONE rate document should exist — update it if present, else create it
export const saveWeightCharge = async (req, res) => {
  try {
    const { ratePerKg, status } = req.body;

    let weightCharge = await WeightCharge.findOne();

    if (weightCharge) {
      weightCharge.ratePerKg = ratePerKg;
      weightCharge.status = status || weightCharge.status;
      weightCharge.updatedAt = Date.now();
      await weightCharge.save();
    } else {
      weightCharge = await WeightCharge.create({ ratePerKg, status });
    }

    res.status(200).json({ success: true, data: weightCharge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWeightCharge = async (req, res) => {
  try {
    const weightCharge = await WeightCharge.findOne();
    res.status(200).json({ success: true, data: weightCharge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
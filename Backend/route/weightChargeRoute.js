import express from "express";
import { getWeightCharge, saveWeightCharge } from "../controller/weightChargeController.js";
import { calculateDeliveryCharge } from "../controller/deliveryController.js";

const router = express.Router();

router.get("/weightcharge", getWeightCharge);   // admin: view current rate
router.post("/weightcharge", saveWeightCharge); // admin: set/update rate (e.g. {ratePerKg: 10})

router.post("/delivery/calculate", calculateDeliveryCharge); // frontend calls this at checkout

export default router;
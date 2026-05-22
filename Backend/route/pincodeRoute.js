import express from "express";
import { deletePincode, getallpincode, getChargeByPincode, savePincodeCharge } from "../controller/pincodeController.js";
const router = express.Router();

router.get("/pincode",getallpincode)
router.post("/pincode",savePincodeCharge)
router.get("/pincode/:code",getChargeByPincode)
router.delete("/deletepincode/:id",deletePincode)
export default router;
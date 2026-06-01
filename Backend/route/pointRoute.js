import express from "express";
import { getPointSettings, getUserPoints,  redeemPoints, savePointSettings, updatePointSettings } from "../controller/pointController.js";
const router = express.Router();

router.get("/points-settings",getPointSettings)
router.put("/points-settings",updatePointSettings)
router.get("/user-points/:phone",getUserPoints)
router.post("/points-settings",savePointSettings)
router.post("/redeem-points",redeemPoints)
// router.post("/validate-coupon",validateCoupon)
// router.post("/mark-coupon-used", markCouponUsed)
export default router;
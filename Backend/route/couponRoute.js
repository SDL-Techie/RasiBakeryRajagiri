import express from "express";
import { claimCoupon, markCouponAsUsed, validateCoupon } from "../controller/couponController.js";
import { verifyUser } from "../helper/userAuth.js";


const router=express.Router()

router.post("/coupon",verifyUser,claimCoupon)
router.post("/validate-coupon",verifyUser,validateCoupon)
router.post("/mark-coupon-used",verifyUser,markCouponAsUsed)


export default router;
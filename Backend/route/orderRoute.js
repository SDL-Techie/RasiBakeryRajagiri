import express from "express";
import { calculateTotalSpentFromOrders, cancelOrder, createordercod, getallordercod,  getordercodbyphone, getOrderStatusStats, initiateRazorpayPayment, updateOrderStatus, verifyRazorpayPaymentAndCreateOrder } from "../controller/orderController.js";
import { verifyUser } from "../helper/userAuth.js";
const router = express.Router();
router.put("/order/:id", verifyUser, updateOrderStatus);
router.get("/order/total-spent/:phone", calculateTotalSpentFromOrders);
router.get("/getorderstatus", verifyUser, getOrderStatusStats);

router.post("/createordercod", verifyUser, createordercod);
router.get("/getallordercod",verifyUser,getallordercod);
router.get("/getorderbyphone/:phone",verifyUser,getordercodbyphone)


router.post("/razorpay/initiate",verifyUser, initiateRazorpayPayment); 
router.post("/razorpay/verify",verifyUser,verifyRazorpayPaymentAndCreateOrder)
router.put("/order/cancel/:id",verifyUser,cancelOrder)
export default router;
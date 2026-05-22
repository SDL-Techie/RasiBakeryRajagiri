// import express from "express";
// import { calculateTotalSpentFromOrders, createOrder, getAllOrders, getOrdersByPhone, getOrderStatusStats, updateOrderStatus, verifyPayment, whatsappmanager } from "../controller/orderController.js";
// const router = express.Router();

// router.post("/order",createOrder)
// router.post("/verify-payment",verifyPayment)
// router.get("/order",getAllOrders)
// router.put("/order/:id",updateOrderStatus)
// router.get("/order/:phoneno",getOrdersByPhone)
// router.get("/order/total-spent/:phone",calculateTotalSpentFromOrders)
// router.get("/getorderstatus",getOrderStatusStats)
// router.post("/whatsapptrigger",whatsappmanager)
// export default router;


import express from "express";
import { calculateTotalSpentFromOrders, cancelOrder, createordercod, getallordercod,  getordercodbyphone, getOrderStatusStats, initiateRazorpayPayment, updateOrderStatus, verifyRazorpayPaymentAndCreateOrder } from "../controller/orderController.js";
// import {
//   calculateTotalSpentFromOrders,
//   createOrder,
//   createRazorpayOrder,
//   getAllOrders,
//   getOrdersByPhone,
//   getOrderStatusStats,
//   updateOrderStatus,
//   verifyPayment,
//   whatsappmanager,
// } from "../controller/orderController.js";

const router = express.Router();

// router.post("/create-razorpay-order", createRazorpayOrder); // ✅ NEW: UPI step 1
// router.post("/order", createOrder);                          // ✅ COD only (or internal use)
// router.post("/verify-payment", verifyPayment);               // ✅ UPI step 2: verify + save order
// router.get("/order", getAllOrders);
 router.put("/order/:id", updateOrderStatus);
// router.get("/order/:phoneno", getOrdersByPhone);
router.get("/order/total-spent/:phone", calculateTotalSpentFromOrders);
 router.get("/getorderstatus", getOrderStatusStats);
// router.post("/whatsapptrigger", whatsappmanager);

router.post("/createordercod", createordercod);
router.get("/getallordercod",getallordercod);
router.get("/getorderbyphone/:phone",getordercodbyphone)


router.post("/razorpay/initiate", initiateRazorpayPayment); 
router.post("/razorpay/verify",verifyRazorpayPaymentAndCreateOrder)
router.put("/order/cancel/:id",cancelOrder)
export default router;
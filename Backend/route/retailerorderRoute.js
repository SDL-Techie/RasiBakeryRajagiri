import express from "express";
import {
  createRetailerOrder,
  verifyRetailerPayment,
  updateRetailerOrderStatus,
  getAllRetailerOrders,
  getRetailerOrders,
  getRetailerOrdersByPhone,
  initiateRetailerPayment,
} from "../controller/retailerorderController.js";
import { verifyUser } from "../helper/userAuth.js";

const router = express.Router();

router.post("/createretailerorder",   verifyUser,createRetailerOrder);
router.post("/verify-retailer-payment",   verifyRetailerPayment);
router.put("/retailer-order/:id",     verifyUser,    updateRetailerOrderStatus);
router.get("/all-retailer-orders",   verifyUser,getAllRetailerOrders);
router.get("/retailerorder/:userId",verifyUser,getRetailerOrders);
router.get("/retailer-order/phone/:phone", verifyUser,getRetailerOrdersByPhone);
router.post("/initiate-retailer-payment",verifyUser,initiateRetailerPayment)
export default router;
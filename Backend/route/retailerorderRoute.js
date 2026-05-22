// import express from "express";
// import { createRetailerOrder, getAllRetailerOrders, getRetailerOrders, getRetailerOrdersByPhone } from "../controller/retailerorderController.js";
// const router = express.Router();

// router.post("/createretailerorder",createRetailerOrder)
// router.get("/retailerorder/:userId",getRetailerOrders)
// router.get("/all-retailer-orders",getAllRetailerOrders)
// router.get("/retailer-order/phone/:phone",getRetailerOrdersByPhone)
// export default router;


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

const router = express.Router();

router.post("/createretailerorder",       createRetailerOrder);
router.post("/verify-retailer-payment",   verifyRetailerPayment);
router.put("/retailer-order/:id",         updateRetailerOrderStatus);
router.get("/all-retailer-orders",        getAllRetailerOrders);
router.get("/retailerorder/:userId",      getRetailerOrders);
router.get("/retailer-order/phone/:phone",getRetailerOrdersByPhone);
router.post("/initiate-retailer-payment",initiateRetailerPayment)
export default router;
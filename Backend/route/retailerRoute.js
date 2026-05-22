// import express from "express";
// import { createRetailerCode, getAllAccessCodes, loginRetailer } from "../controller/retailerController.js";
// const router=express.Router();

// router.post("/retailer",createRetailerCode)
// router.post("/retailerlogin",loginRetailer)
// router.get("/retailer",getAllAccessCodes)
// export default router;


import express from "express";
import { createRetailerCode, getAllCodes, getUsedCodesDetails, verifyAndRegisterRetailer } from "../controller/retailerController.js";
const router = express.Router();

router.post("/createretailercode",createRetailerCode)
router.post("/retailerlogin",verifyAndRegisterRetailer)
router.get("/retailers",getUsedCodesDetails)
router.get("/allcodes",getAllCodes)

export default router;
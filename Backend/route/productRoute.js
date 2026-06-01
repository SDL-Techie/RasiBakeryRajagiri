import express from "express"
import { bulkImportProducts, createproduct, getallproduct, getProductsByCategoryName, getsingleproduct, updateproduct } from "../controller/productController.js";
import { verifyUser } from "../helper/userAuth.js";

const router=express.Router()
router.route("/products").get(getallproduct).post(verifyUser,createproduct)
router.route("/product/:id").get(getsingleproduct).put(verifyUser,updateproduct)
router.get("/category/:categoryName",getProductsByCategoryName)
router.post(  "/products/bulk", bulkImportProducts)
export default router;
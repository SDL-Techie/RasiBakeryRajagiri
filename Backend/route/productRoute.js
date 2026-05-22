import express from "express"
import { createproduct, deleteproduct, getallproduct, getProductsByCategoryName, getsingleproduct, updateproduct } from "../controller/productController.js";

const router=express.Router()
router.route("/products").get(getallproduct).post(createproduct)
router.route("/product/:id").get(getsingleproduct).delete(deleteproduct).put(updateproduct)
router.get("/category/:categoryName",getProductsByCategoryName)
export default router;
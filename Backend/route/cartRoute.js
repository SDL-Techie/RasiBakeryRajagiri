import express from "express"
import { addToCart, clearCart, getCart, removeFromCart, updateCartQuantity } from "../controller/cartController.js"

const router=express.Router()

router.post("/cart",addToCart)
router.get("/cart/:phoneno",getCart)
router.post("/cart/remove",removeFromCart)
router.delete("/cart/:phoneno",clearCart)
router.put("/cart/update",updateCartQuantity)
export default router
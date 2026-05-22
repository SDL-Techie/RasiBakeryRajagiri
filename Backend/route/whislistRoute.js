import express from "express"
import { clearWishlist, getUserWishlist, toggleWishlist } from "../controller/whislistController.js"
const router=express.Router()

router.post("/whislist" , toggleWishlist)
router.get("/whislist/:phoneno",getUserWishlist)
router.delete("/whislist/:phoneno",clearWishlist)

export default router;
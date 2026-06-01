import express from "express";
import { createcategory, deleteCategory, getallcategory, updateCategory } from "../controller/categoryController.js";
import { verifyUser } from "../helper/userAuth.js";


const router=express.Router();

router.route("/category").post(verifyUser,createcategory).get(getallcategory)
router.route("/category/:id").put(updateCategory)
router.route("/category/delete/:id").delete(verifyUser,deleteCategory)
export default router;
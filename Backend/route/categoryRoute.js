import express from "express";
import { createcategory, deleteCategory, getallcategory, updateCategory } from "../controller/categoryController.js";


const router=express.Router();

router.route("/category").post(createcategory).get(getallcategory)
router.route("/category/:id").put(updateCategory)
router.route("/category/delete/:id").delete(deleteCategory)
export default router;
import express from 'express';
import { createuser, getAllUsers, getUserById, loginUser, retailerLogin, updateProfile } from '../controller/userController.js';

const router=express.Router();

router.route("/register").post(createuser)
router.route("/login").post(loginUser)
router.route("/getalluser").get(getAllUsers)
router.route("/profile/:id").put(updateProfile).get(getUserById)
router.route("/retailer-login").post(retailerLogin);
export default router;

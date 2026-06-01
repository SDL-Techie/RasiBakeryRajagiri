import express from 'express';
import { createuser, getAllUsers, getUserById, loginUser, Logoutuser, retailerLogin, updateProfile, updateUserRole } from '../controller/userController.js';
import { verifyUser } from '../helper/userAuth.js';
const router=express.Router();

router.route("/register").post(createuser)
router.route("/login").post(loginUser)
router.route("/getalluser").get(verifyUser,getAllUsers)
router.route("/profile/:id").put(verifyUser,updateProfile).get(verifyUser,getUserById)
router.route("/retailer-login").post(retailerLogin);
router.route("/logout").get(Logoutuser)
router.put("/update-role/:id",verifyUser,updateUserRole)
export default router;

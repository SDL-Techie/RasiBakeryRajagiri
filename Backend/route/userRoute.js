import express from 'express';
import { createCredential, createuser, getAdmins, getAllUsers, getUserById, getUserDetails, getUsers, loginUser, Logoutuser, retailerLogin, updateProfile, updateUserRole } from '../controller/userController.js';
import { verifyUser } from '../helper/userAuth.js';
const router=express.Router();

router.route("/register").post(createuser)
router.route("/login").post(loginUser)
router.route("/getalluser").get(verifyUser,getAllUsers)
router.route("/profile/:id").put(verifyUser,updateProfile).get(verifyUser,getUserById)
router.route("/retailer-login").post(retailerLogin);
router.route("/logout").get(Logoutuser)
router.put("/update-role/:id",verifyUser,updateUserRole)
router.get("/users-list",getUsers)
router.get("/admins-list",getAdmins)
router.post("/create-credential",verifyUser,createCredential)
router.get("/user-details/:id",getUserDetails)
export default router;

import express from "express";
import { getalluserpoint, getUserPoints } from "../controller/userpointController.js";
import { verifyUser } from "../helper/userAuth.js";

const router = express.Router();
 
router.get("/getuserpoints/:phone",verifyUser,getUserPoints)
router.get("/getalluserpoints",getalluserpoint)

export default router;
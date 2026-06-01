import express from 'express'
import { createpointsettings, getpointsettings } from '../controller/pointsettingController.js'
import { verifyUser } from '../helper/userAuth.js'

const router=express.Router()

router.post("/createpointsettings",verifyUser,createpointsettings)
router.get("/getpointsettings",verifyUser,getpointsettings)

export default router
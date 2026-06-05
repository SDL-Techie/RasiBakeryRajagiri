import express from 'express';
import { createBackup, restoreBackup } from '../controller/backupController.js';
import upload from '../middleware/upload.js';
import { verifyUser } from '../helper/userAuth.js';
const router=express.Router();

router.get("/backup", verifyUser, createBackup);
router.post("/restore",verifyUser, upload.single("file"),
restoreBackup)

export default router;
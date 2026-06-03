import express from 'express';
import { createBackup, restoreBackup } from '../controller/backupController.js';
import upload from '../middleware/upload.js';
const router=express.Router();

router.get("/backup", createBackup);
router.post("/restore",upload.single("file"),
restoreBackup)

export default router;
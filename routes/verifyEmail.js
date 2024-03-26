import express from "express";
import { verifyEmail } from "../controllers/userController.js";
const router = express.Router();

// Define route for handling GET request
router.get("/verify-email", verifyEmail);

export default router;
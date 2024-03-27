import express from "express";
import { verifyEmail } from "../controllers/userController.js";
const router = express.Router();
import basicAuth from "../middlewares/authorizationMiddleware.js";
import checkDBConnection from "../middlewares/checkDBConnection.js";
import { handlePayload, validateQueryParams } from "../middlewares/checkPayloadAndQueryParams.js";

// Define route for handling GET request
// router.get("/verify-email", validateQueryParams, handlePayload, checkDBConnection, basicAuth, verifyEmail);

router.get("/verify-email", verifyEmail);

export default router;
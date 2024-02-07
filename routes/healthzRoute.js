import express from "express";
import healthzCheck from "../controllers/healthzController.js";
import checkDBConnection from "../middlewares/checkDBConnection.js";
import checkPayloadAndQueryParams from "../middlewares/checkPayloadAndQueryParams.js";

const router = express.Router();

// Define route for handling GET request
router.get("/", checkPayloadAndQueryParams, checkDBConnection, healthzCheck);

export default router;

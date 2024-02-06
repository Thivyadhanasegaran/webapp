import express from "express";
import { createUser, getUserInfo, updateUser } from "../controllers/userController.js";
import basicAuth from "../middlewares/authorizationMiddleware.js";
import checkDBConnection from "../middlewares/checkDBConnection.js"
import checkPayloadAndQueryParams from "../middlewares/checkPayloadAndQueryParams.js";


const router = express.Router();

// Route to handle new user
router.post("/v1/user", checkDBConnection, createUser);

// Route to get user information
router.get("/v1/user/self", checkDBConnection, basicAuth, checkPayloadAndQueryParams, getUserInfo); 

// Route to update user information
router.put("/v1/user/self", checkDBConnection, basicAuth, updateUser);


export default router;

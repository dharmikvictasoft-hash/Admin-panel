// routes/userRoutes.js
import express from "express";
import { storeUserData } from "../controllers/userController.js";

const router = express.Router();

router.post("/steps", storeUserData);

export default router;

import express from "express";
import {
  getTotalCaloriesAllUsers,
  getTotalUsers,
  getTotalSteps,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/total-calories", getTotalCaloriesAllUsers);
router.get("/total-users", getTotalUsers);
router.get("/total-steps", getTotalSteps);

export default router;

import express from "express";

import {
  getDashboardStats,
  getAllRegistrations,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

router.get(
  "/registrations",
  authMiddleware,
  adminMiddleware,
  getAllRegistrations
);

export default router;
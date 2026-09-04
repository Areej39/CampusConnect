import express from "express";

import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getAllRegistrations,
  submitPayment,
  approveRegistration,
  rejectRegistration,
} from "../controllers/registrationController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  registrationParamsSchema,
} from "../validations/registrationValidation.js";

import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Student: register for an event
router.post(
  "/:eventId",
  authMiddleware,
  validate(registrationParamsSchema, "params"),
  registerForEvent
);

// Student: get own registrations
router.get(
  "/my",
  authMiddleware,
  getMyRegistrations
);

// Student: submit payment
router.put(
  "/:id/payment",
  authMiddleware,
  submitPayment
);

// Student: cancel registration
router.put(
  "/:id/cancel",
  authMiddleware,
  cancelRegistration
);

// Admin: get all registrations
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllRegistrations
);

// Admin: approve registration
router.put(
  "/admin/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveRegistration
);

// Admin: reject registration
router.put(
  "/admin/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectRegistration
);

export default router;
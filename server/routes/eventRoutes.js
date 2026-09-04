import express from "express";

import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  cancelEvent,
  publishEvent,
} from "../controllers/eventController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  createEventSchema,
  updateEventSchema,
} from "../validations/eventValidation.js";

import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validate(createEventSchema),
  createEvent
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(updateEventSchema),
  updateEvent
);

router.patch(
  "/:id/publish",
  authMiddleware,
  adminMiddleware,
  publishEvent
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  adminMiddleware,
  cancelEvent
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteEvent
);

export default router;
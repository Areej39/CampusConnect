import express from 'express'
import { signup, login, getMe } from "../controllers/authController.js" 
import authMiddleware from '../middleware/authMiddleware.js';
import {
  signupSchema,
  loginSchema,
} from "../validations/authValidation.js";

import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
  "/signup",
  validate(signupSchema),
  signup
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get("/me", authMiddleware, getMe);

export default router;
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import {
  notFoundMiddleware,
  errorMiddleware,
} from "./middleware/errorMiddleware.js";

dotenv.config();

dns.setServers(["1.1.1.1"]);

connectDB();

const app = express();

app.set("trust proxy", 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://campus-connect-pi-ten.vercel.app"
    ]

  })
);

app.use(express.json({ limit: "10kb" }));

app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.json({
    message: "CampusConnect API is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`CampusConnect API is running on port ${port}`);
});
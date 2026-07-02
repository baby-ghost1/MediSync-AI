import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

import { Router } from "express";
import routes from "./routes/index.js";

import {
  auth,
  notFound,
  errorHandler,
} from "./middleware/index.js";

const app = express();

/* ==========================================
   Security Middleware
========================================= */

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());
app.use(compression());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, try again later." },
});
app.use("/api", limiter);

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts, try again later." },
});
app.use("/api/auth", authLimiter);

// Custom sanitization middleware (Express v5 compatible)
// express-mongo-sanitize & xss-clean both break in Express v5 because
// req.query is a getter-only property — they try to reassign it.
// This middleware sanitizes in-place without reassignment.
import sanitize from "./middleware/sanitize.js";
app.use(sanitize());

// Prevent parameter pollution
app.use(hpp());

const uploadsRouter = Router();
uploadsRouter.use(auth);
uploadsRouter.use(
  express.static(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "uploads"
    )
  )
);
app.use("/uploads", uploadsRouter);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* ==========================================
   Health Check
========================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "MediSync AI API",
    version: "1.0.0",
    status: "Running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

/* ==========================================
   API Routes
========================================== */

app.use("/api", routes);

/* ==========================================
   Error Handling
========================================== */

app.use(notFound);

app.use(errorHandler);

export default app;

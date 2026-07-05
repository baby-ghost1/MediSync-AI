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

import logger, { stream } from "./services/logger.service.js";

const app = express();

/* ==========================================
   Security Middleware
========================================= */

const DEFAULT_ALLOWED_ORIGINS = [
  "https://app-medisync.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      const envOrigins = process.env.CLIENT_URL?.split(",").map((o) => o.trim()) || [];
      const allowed = [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins])];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "res.cloudinary.com", "https://via.placeholder.com"],
        connectSrc: ["'self'", ...(process.env.CLIENT_URL?.split(",").map((o) => o.trim()) || []), "https://res.cloudinary.com"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
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

// HTTP request logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev", { stream }));
} else {
  app.use(morgan("combined", { stream }));
}

/* ==========================================
   Swagger API Documentation
========================================= */

import { swaggerSpec, swaggerUi } from "./config/swagger.js";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "MediSync AI API Docs",
}));

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/* ==========================================
   Health Check
========================================= */

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
========================================= */

app.use("/api", routes);

/* ==========================================
   Error Handling
========================================= */

app.use(notFound);

app.use(errorHandler);

export default app;

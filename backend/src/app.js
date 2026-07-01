import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { Router } from "express";
import routes from "./routes/index.js";

import {
  auth,
  notFound,
  errorHandler,
} from "./middleware/index.js";

const app = express();

/* ==========================================
   Core Middleware
========================================== */

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(compression());

app.use(cookieParser());

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
    limit: "20mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
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

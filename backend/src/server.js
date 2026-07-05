import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import logger from "./services/logger.service.js";

const { default: app } = await import("./app.js");
const { connectDB } = await import("./config/index.js");
const { default: setupSocket } = await import("./sockets/index.js");

/* ==========================================
   Sentry (optional — requires SENTRY_DSN)
========================================= */

if (process.env.SENTRY_DSN) {
  const Sentry = await import("@sentry/node");
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.2,
    maxBreadcrumbs: 50,
    debug: false,
  });
  Sentry.setupExpressErrorHandler(app);
  logger.info("Sentry error tracking initialized");
}

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL?.split(",").map((o) => o.trim()) || "*",
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

setupSocket(io);

const { User } = await import("./models/index.js");

const seedDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@medisync.ai";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });

  if (!existing) {
    await User.create({
      firstName: "System",
      lastName: "Admin",
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: "admin",
      isVerified: true,
    });
    logger.info(`Default admin seeded: ${adminEmail}`);
  } else {
    logger.debug("Admin account already exists, skipping seed.");
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedDefaultAdmin();
    server.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`API docs available at http://localhost:${PORT}/api-docs`);
    });

    const { default: startReminderJob } = await import("./jobs/reminder.job.js");
    startReminderJob();
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

const shutdown = (signal) => {
  logger.info(`${signal} received. Closing server...`);
  io.close();
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

const { default: app } = await import("./app.js");
const { connectDB } = await import("./config/index.js");
const { default: setupSocket } = await import("./sockets/index.js");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
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
    console.log(`Default admin seeded: ${adminEmail}`);
  } else {
    console.log("Admin account already exists, skipping seed.");
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedDefaultAdmin();
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();

const shutdown = (signal) => {
  console.log(`\n${signal} received. Closing server...`);
  io.close();
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

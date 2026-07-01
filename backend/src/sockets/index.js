import jwt from "jsonwebtoken";
import User from "../models/User.js";

const onlineUsers = new Set();

const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication required"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return next(new Error("User not found"));
    if (user.isBlocked) return next(new Error("Account blocked"));
    socket.user = user;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
};

const registerHandlers = (io, socket) => {
  const userId = socket.user?._id?.toString();
  const role = socket.user?.role;

  socket.join(`user:${userId}`);
  if (role) socket.join(`role:${role}`);

  socket.on("user:online", () => {
    onlineUsers.add(userId);
    io.emit("users:online", [...onlineUsers]);
    io.emit("user:online", userId);
  });

  socket.on("user:offline", () => {
    onlineUsers.delete(userId);
    io.emit("users:online", [...onlineUsers]);
    io.emit("user:offline", userId);
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
  });

  socket.on("appointment:create", (data) => {
    const { doctorId, patientId } = data || {};
    if (doctorId) io.to(`user:${doctorId}`).emit("appointment:created", data);
    if (patientId) io.to(`user:${patientId}`).emit("appointment:created", data);
    io.to("role:admin").emit("appointment:created", data);
  });

  socket.on("appointment:update", (data) => {
    const { doctorId, patientId } = data || {};
    if (doctorId) io.to(`user:${doctorId}`).emit("appointment:updated", data);
    if (patientId) io.to(`user:${patientId}`).emit("appointment:updated", data);
    io.to("role:admin").emit("appointment:updated", data);
  });

  socket.on("appointment:cancel", (data) => {
    const { doctorId, patientId } = data || {};
    if (doctorId) io.to(`user:${doctorId}`).emit("appointment:cancelled", data);
    if (patientId) io.to(`user:${patientId}`).emit("appointment:cancelled", data);
    io.to("role:admin").emit("appointment:cancelled", data);
  });

  socket.on("doctor:status", (data) => {
    io.emit("doctor:status", { userId, ...data });
    io.emit("doctor:availability", { userId, ...data });
  });

  socket.on("patient:update", (data) => {
    const { doctorId } = data || {};
    if (doctorId) io.to(`user:${doctorId}`).emit("patient:updated", { patientId: userId, ...data });
  });

  socket.on("dashboard:update", (data) => {
    if (data?.userId) {
      io.to(`user:${data.userId}`).emit("dashboard:update", data);
    }
  });

  socket.on("notification:send", (data) => {
    const { recipientId, ...notification } = data || {};
    if (recipientId) {
      io.to(`user:${recipientId}`).emit("notification", notification);
    }
  });

  socket.on("prescription:send", (data) => {
    const { patientId, doctorId } = data || {};
    if (patientId) io.to(`user:${patientId}`).emit("prescription:created", data);
    if (doctorId) io.to(`user:${doctorId}`).emit("prescription:created", data);
  });

  socket.on("report:send", (data) => {
    const { patientId, doctorId } = data || {};
    if (patientId) io.to(`user:${patientId}`).emit("report:uploaded", data);
    if (doctorId) io.to(`user:${doctorId}`).emit("report:uploaded", data);
  });

  socket.on("chat-message", (payload) => {
    if (payload?.room) {
      io.to(payload.room).emit("chat-message", payload);
    }
  });
};

const setupSocket = (io) => {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (${socket.user?.email || "unknown"})`);

    registerHandlers(io, socket);

    io.emit("users:online", [...onlineUsers]);

    socket.on("disconnect", () => {
      const userId = socket.user?._id?.toString();
      onlineUsers.delete(userId);
      io.emit("users:online", [...onlineUsers]);
      io.emit("user:offline", userId);
      console.log(`Socket disconnected: ${socket.id} (${socket.user?.email || "unknown"})`);
    });
  });
};

export { setupSocket, onlineUsers };
export default setupSocket;

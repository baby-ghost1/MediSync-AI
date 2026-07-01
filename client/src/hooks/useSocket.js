import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";
import useAuthStore from "@/store/authStore";
import useSocketStore from "@/store/socketStore";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export const useSocket = () => {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const socketRef = useRef(null);
  const listenersRef = useRef(new Map());
  const [socketInstance, setSocketInstance] = useState(null);

  const {
    isConnected, socketId, onlineUsers,
    setConnected, setSocketId, setOnlineUsers,
    addOnlineUser, removeOnlineUser,
  } = useSocketStore();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketInstance(null);
        setConnected(false);
        setSocketId(null);
      }
      return;
    }

    if (socketRef.current?.connected) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5,
      timeout: 15000,
    });

    socket.on("connect", () => {
      setConnected(true);
      setSocketId(socket.id);
      if (user?._id) {
        socket.emit("user:online", user._id);
      }
      listenersRef.current.forEach((handlers, event) => {
        handlers.forEach((handler) => {
          socket.on(event, handler);
        });
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setSocketId(null);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setConnected(false);
    });

    socket.on("users:online", (users) => {
      setOnlineUsers(users);
    });

    socket.on("user:online", (userId) => {
      addOnlineUser(userId);
    });

    socket.on("user:offline", (userId) => {
      removeOnlineUser(userId);
    });

    socketRef.current = socket;
    setSocketInstance(socket);

    return () => {
      const currentSocket = socketRef.current;
      const currentListeners = listenersRef.current;
      if (user?._id && currentSocket?.connected) {
        currentSocket.emit("user:offline", user._id);
      }
      currentListeners.forEach((handlers, event) => {
        handlers.forEach((handler) => {
          currentSocket?.off(event, handler);
        });
      });
      currentSocket?.disconnect();
      socketRef.current = null;
      setSocketInstance(null);
      setConnected(false);
      setSocketId(null);
    };
  }, [isAuthenticated, token, user?._id, setConnected, setSocketId, setOnlineUsers, addOnlineUser, removeOnlineUser]);

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event).add(handler);

    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, handler);
      }
      listenersRef.current.get(event)?.delete(handler);
    };
  }, []);

  const off = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
    listenersRef.current.get(event)?.delete(handler);
  }, []);

  const isOnline = useCallback(
    (userId) => onlineUsers.includes(userId),
    [onlineUsers]
  );

  return {
    socket: socketInstance,
    isConnected,
    socketId,
    onlineUsers,
    isOnline,
    emit,
    on,
    off,
  };
};

export default useSocket;

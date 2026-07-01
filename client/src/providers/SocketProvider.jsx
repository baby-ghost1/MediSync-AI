import { useMemo } from "react";
import { SocketContext } from "./SocketContext";
import { useSocket } from "@/hooks/useSocket";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import useSocketStore from "@/store/socketStore";

export const SocketProvider = ({ children }) => {
  const socket = useSocket();
  const { isConnected, socketId } = useSocketStore();

  useSocketEvents();

  const value = useMemo(
    () => ({
      isConnected,
      socketId,
      emit: socket.emit,
      on: socket.on,
      off: socket.off,
      isOnline: socket.isOnline,
      onlineUsers: socket.onlineUsers,
    }),
    [isConnected, socketId, socket.emit, socket.on, socket.off, socket.isOnline, socket.onlineUsers]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

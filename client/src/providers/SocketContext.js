import { createContext, useContext } from "react";

export const SocketContext = createContext(null);

export const useSocketContext = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return ctx;
};

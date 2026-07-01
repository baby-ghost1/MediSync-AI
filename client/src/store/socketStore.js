import { create } from "zustand";

const useSocketStore = create((set) => ({
  isConnected: false,
  socketId: null,
  onlineUsers: [],
  lastEvent: null,
  connectionAttempts: 0,

  setConnected: (connected) => set({ isConnected: connected }),
  setSocketId: (id) => set({ socketId: id }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setLastEvent: (event) => set({ lastEvent: event }),
  incrementAttempts: () => set((s) => ({ connectionAttempts: s.connectionAttempts + 1 })),
  resetAttempts: () => set({ connectionAttempts: 0 }),

  addOnlineUser: (userId) =>
    set((s) => ({
      onlineUsers: s.onlineUsers.includes(userId) ? s.onlineUsers : [...s.onlineUsers, userId],
    })),

  removeOnlineUser: (userId) =>
    set((s) => ({
      onlineUsers: s.onlineUsers.filter((id) => id !== userId),
    })),
}));

export default useSocketStore;

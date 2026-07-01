import { create } from "zustand";

const useAppStore = create((set) => ({
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  globalLoading: false,
  globalSearch: "",

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) =>
    set({ sidebarCollapsed: collapsed }),

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  setGlobalSearch: (query) => set({ globalSearch: query }),
}));

export default useAppStore;

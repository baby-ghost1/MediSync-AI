import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import authService from "@/services/auth.service";

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      initializeAuth: async () => {
        try {
          const savedToken = get().token;
          if (!savedToken) {
            set({ loading: false });
            return;
          }
          const profile = await authService.me();
          set({
            user: profile,
            token: savedToken,
            isAuthenticated: true,
            loading: false,
          });
        } catch {
          get().logout(false);
        } finally {
          set((state) => {
            if (state.loading) return { loading: false };
            return {};
          });
        }
      },

      login: async (credentials) => {
        try {
          const response = await authService.login(credentials);
          const { token, refreshToken, user } = response;

          set({ user, token, refreshToken, isAuthenticated: true });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      register: async (payload) => {
        try {
          const response = await authService.register(payload);
          return { success: true, data: response };
        } catch (error) {
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      logout: (redirect = true) => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, loading: false });
        if (redirect && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      },

      refreshProfile: async () => {
        try {
          const profile = await authService.me();
          set({ user: profile });
          return profile;
        } catch (error) {
          console.error(error);
        }
      },

      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      setLoading: (loading) => set({ loading }),

      resetAuth: () => set({ ...initialState, loading: false }),
    }),
    {
      name: "medisync-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useAuth = () => {
  const store = useAuthStore();
  return {
    ...store,
    isPatient: store.user?.role === "patient",
    isDoctor: store.user?.role === "doctor",
    isAdmin: store.user?.role === "admin",
  };
};

export default useAuthStore;

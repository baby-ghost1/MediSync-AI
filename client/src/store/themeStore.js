import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "medisync-theme";

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (selectedTheme) => {
  const html = document.documentElement;
  const isDark = selectedTheme === THEMES.DARK || (selectedTheme === THEMES.SYSTEM && getSystemTheme() === "dark");
  html.classList.toggle("dark", isDark);
};

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: THEMES.SYSTEM,
      themes: THEMES,

      setTheme: (newTheme) => {
        set({ theme: newTheme });
        applyTheme(newTheme);
      },

      toggleTheme: () => {
        const current = get().theme;
        const next = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
        get().setTheme(next);
      },

      initTheme: () => {
        const saved = get().theme || THEMES.SYSTEM;
        applyTheme(saved);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

export default useThemeStore;
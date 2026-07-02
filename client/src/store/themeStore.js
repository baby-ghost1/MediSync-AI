import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "medisync-theme";

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const applyTheme = (selectedTheme) => {
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(selectedTheme);
};

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: THEMES.LIGHT, // Default theme set to LIGHT instead of SYSTEM
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
        const saved = get().theme || THEMES.LIGHT; // Fallback to LIGHT
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
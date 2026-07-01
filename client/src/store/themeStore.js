import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "medisync-theme";

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT;

const applyTheme = (selectedTheme) => {
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  const finalTheme =
    selectedTheme === THEMES.SYSTEM ? getSystemTheme() : selectedTheme;
  html.classList.add(finalTheme);
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
        const next =
          current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
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

import { createContext, useMemo, useEffect } from "react";
import useThemeStore from "@/store/themeStore";

const ThemeContext = createContext(null);

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

export const ThemeProvider = ({ children }) => {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = useThemeStore.getState().theme;
      if (current === THEMES.SYSTEM) {
        const html = document.documentElement;
        html.classList.remove("light", "dark");
        html.classList.add(mediaQuery.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      themes: THEMES,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, THEMES };



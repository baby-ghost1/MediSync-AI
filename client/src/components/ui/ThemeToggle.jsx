import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/theme/useTheme";
import Dropdown from "./Dropdown";
import Button from "./Button";

const ThemeToggle = () => {
  const { theme, themes, setTheme } = useTheme();

  const currentIcon = () => {
    switch (theme) {
      case themes.DARK:
        return <Moon size={16} />;
      case themes.LIGHT:
        return <Sun size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  const items = [
    {
      label: "Light",
      icon: <Sun size={16} />,
      checked: theme === themes.LIGHT,
      onClick: () => setTheme(themes.LIGHT),
    },
    {
      label: "Dark",
      icon: <Moon size={16} />,
      checked: theme === themes.DARK,
      onClick: () => setTheme(themes.DARK),
    },
    {
      label: "System",
      icon: <Monitor size={16} />,
      checked: theme === themes.SYSTEM,
      onClick: () => setTheme(themes.SYSTEM),
    },
  ];

  return (
    <Dropdown
      trigger={
        <Button variant="ghost" size="icon" aria-label="Toggle theme">
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentIcon()}
            </motion.div>
          </AnimatePresence>
        </Button>
      }
      items={items}
    />
  );
};

export default ThemeToggle;

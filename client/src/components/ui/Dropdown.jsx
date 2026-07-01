import { useState, useRef, useEffect, cloneElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

const Dropdown = ({
  trigger,
  items = [],
  width = "w-56",
  align = "right",
  closeOnSelect = true,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {cloneElement(trigger, {
        onClick: () => setOpen((prev) => !prev),
      })}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute z-50 mt-2 overflow-hidden rounded-xl border border-[var(--border)]/50",
              "bg-[var(--card)]",
              "shadow-2xl shadow-black/20",
              width,
              align === "right" ? "right-0" : "left-0",
              className
            )}
          >
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={index}
                    className="my-1 border-t border-[var(--border)]/50"
                  />
                );
              }

              return (
                <button
                  key={index}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    if (closeOnSelect) setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between",
                    "px-3 py-2.5 text-sm",
                    "transition-all duration-100",
                    "hover:bg-[var(--surface-hover)] active:bg-[var(--surface-hover)]/80",
                    "text-[var(--foreground)]",
                    item.disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon && (
                      <span className="text-[var(--muted-foreground)]">
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.checked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Check
                          size={16}
                          className="text-[var(--primary)]"
                        />
                      </motion.div>
                    )}
                    {item.submenu && (
                      <ChevronRight size={16} className="text-[var(--muted-foreground)]" />
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;

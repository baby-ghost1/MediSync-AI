import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Check } from "lucide-react";
import { cn } from "@/utils/cn";

const TimePicker = ({
  value,
  onChange,
  label,
  error,
  disabled,
  placeholder = "Select time",
  hour12 = false,
  interval = 30,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  const measureWidth = useCallback((node) => {
    if (node) setDropdownWidth(node.offsetWidth);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const times = [];
  const total = 24 * 60;
  for (let i = 0; i < total; i += interval) {
    const h = Math.floor(i / 60);
    const m = i % 60;
    const display = hour12
      ? `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`
      : `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const iso = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    times.push({ display, iso });
  }

  const selected = times.find((t) => t.iso === value);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
    >
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all duration-200",
          "bg-[var(--input)] text-[var(--foreground)]",
          "border-[var(--border)]",
          "hover:border-[var(--border-hover)]",
          "focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[var(--danger)]"
        )}
      >
        <span className={cn(!value && "text-[var(--muted-foreground)]")}>
          {selected ? selected.display : placeholder}
        </span>
        <Clock
          size={16}
          className="text-[var(--muted-foreground)]"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            ref={measureWidth}
            className="absolute z-[9999] mt-1 max-h-60 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-xl)]"
            style={{ width: dropdownWidth || "100%" }}
          >
            <div className="max-h-60 overflow-y-auto p-1">
              {times.map((t) => (
                <button
                  key={t.iso}
                  type="button"
                  onClick={() => {
                    onChange?.(t.iso);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    "hover:bg-[var(--surface-hover)]",
                    value === t.iso &&
                      "bg-[var(--primary-light)] font-medium text-[var(--primary)]"
                  )}
                >
                  <span>{t.display}</span>
                  {value === t.iso && (
                    <Check size={14} className="text-[var(--primary)]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1.5 text-xs text-[var(--danger)]">{error}</p>
      )}
    </div>
  );
};

export default TimePicker;

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, AlertCircle, Search } from "lucide-react";
import { cn } from "@/utils/cn";

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  error,
  helperText,
  disabled,
  required,
  searchable,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const containerRef = useRef(null);

  const measureWidth = useCallback((node) => {
    if (node) setDropdownWidth(node.offsetWidth);
  }, []);

  const selected = options.find(
    (o) => o.value === value || o.value === value?.value
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false);
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

  const filtered = searchable
    ? options.filter((o) =>
        o.label?.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium tracking-tight text-[var(--foreground)]">
          {label}
          {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all duration-150",
          "bg-[var(--input)] text-[var(--foreground)]",
          "border-[var(--border)]",
          "hover:border-[var(--border-hover)]",
          "focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--ring)] focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-40",
          error &&
            "border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_var(--ring)]"
        )}
      >
        <span className={cn(!selected && "text-[var(--muted-foreground)]")}>
          {selected ? selected.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-[var(--muted-foreground)]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            ref={measureWidth}
            className="absolute z-50 mt-1.5 max-h-60 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg shadow-black/[0.04] dark:shadow-black/[0.25]"
            style={{ width: dropdownWidth || "100%" }}
          >
            {searchable && (
              <div className="relative border-b border-[var(--border)] p-2">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pl-8 pr-3 text-sm outline-none transition-all duration-150 placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_var(--ring)]"
                  autoFocus
                />
              </div>
            )}
            <div className="max-h-48 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <p className="px-3 py-4 text-center text-sm text-[var(--muted-foreground)]">
                  No options
                </p>
              ) : (
                filtered.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange?.(option);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                      "hover:bg-[var(--surface-hover)]",
                      (value === option.value ||
                        value?.value === option.value) &&
                        "bg-[var(--primary-light)] font-medium text-[var(--primary)]"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                    {(value === option.value ||
                      value?.value === option.value) && (
                      <Check size={16} className="text-[var(--primary)]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
          {helperText}
        </p>
      )}
      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--danger)]">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Select;

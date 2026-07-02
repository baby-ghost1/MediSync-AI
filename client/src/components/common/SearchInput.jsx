import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const SearchInput = ({
  value: externalValue,
  onChange,
  placeholder = "Search...",
  debounceMs = 400,
  className,
}) => {
  const [localValue, setLocalValue] = useState(externalValue || "");
  const timeoutRef = useRef(null);
  const prevExternalRef = useRef(externalValue);

  const handleChange = (e) => {
    const value = e.target.value;

    setLocalValue(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onChange?.(value);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue("");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    onChange?.("");
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (prevExternalRef.current !== externalValue) {
      prevExternalRef.current = externalValue;
      setLocalValue(externalValue || "");
    }
  }, [externalValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "relative w-full max-w-md",
        className
      )}
    >
      <Search
        size={17}
        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[var(--muted-foreground)]"
      />

      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "h-11 w-full rounded-2xl",
          "border border-[var(--border)]",
          "bg-[var(--card)]",
          "pl-11 pr-11",
          "text-sm font-medium",
          "text-[var(--foreground)]",
          "placeholder:font-normal",
          "placeholder:text-[var(--muted-foreground)]",
          "shadow-[0_1px_2px_rgba(15,23,42,.04)]",
          "transition-all duration-200",
          "hover:border-[var(--border-hover)]",
          "focus:border-[var(--primary)]",
          "focus:ring-4",
          "focus:ring-[rgba(37,99,235,.12)]",
          "focus:outline-none"
        )}
      />

      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "flex h-8 w-8 items-center justify-center",
            "rounded-xl",
            "text-[var(--muted-foreground)]",
            "transition-all duration-200",
            "hover:bg-[var(--secondary)]",
            "hover:text-[var(--foreground)]"
          )}
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default SearchInput;
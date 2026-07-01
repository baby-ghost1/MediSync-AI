import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
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
    const val = e.target.value;
    setLocalValue(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange?.(val);
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
    <div className={cn("relative w-full max-w-md", className)}>
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none"
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-[var(--border)] bg-[var(--input)] py-2.5 pl-10 pr-10 text-sm text-[var(--foreground)] shadow-sm",
          "placeholder:text-[var(--muted-foreground)] placeholder:font-normal",
          "transition-all duration-200",
          "focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--primary)]/10 focus:outline-none focus:shadow-md",
          "hover:border-[var(--border-hover)]"
        )}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

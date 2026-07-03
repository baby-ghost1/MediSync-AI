import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DatePicker = ({
  value,
  onChange,
  label,
  error,
  disabled,
  minDate,
  maxDate,
  placeholder = "Select date",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    value ? new Date(value) : new Date()
  );
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = new Date();
  const today = `${todayDate.getFullYear()}-${String(
    todayDate.getMonth() + 1
  ).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleSelect = (day) => {
    const date = new Date(year, month, day);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    onChange?.(iso);
    setOpen(false);
  };

  const canGoPrev =
    !minDate || new Date(year, month - 1, 1) >= new Date(minDate);
  const canGoNext =
    !maxDate || new Date(year, month + 1, 0) <= new Date(maxDate);

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
          {value
            ? new Date(value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : placeholder}
        </span>
        <Calendar
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
            className="absolute z-[9999] mt-1 w-[280px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-xl)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={prevMonth}
                disabled={!canGoPrev}
                className="rounded-lg p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-hover)] disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {months[month]} {year}
              </span>
              <button
                onClick={nextMonth}
                disabled={!canGoNext}
                className="rounded-lg p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-hover)] disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="mb-1.5 grid grid-cols-7 gap-0.5">
              {days.map((d) => (
                <div
                  key={d}
                  className="text-center text-[11px] font-medium text-[var(--muted-foreground)]"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (day) => {
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isSelected = value === dateStr;
                  const isToday = today === dateStr;
                  const isDisabled =
                    (minDate && dateStr < minDate) ||
                    (maxDate && dateStr > maxDate);
                  return (
                    <button
                      key={day}
                      disabled={isDisabled}
                      onClick={() => handleSelect(day)}
                      className={cn(
                        "rounded-lg py-1.5 text-sm transition-colors",
                        isSelected &&
                          "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium",
                        !isSelected &&
                          !isDisabled &&
                          "hover:bg-[var(--surface-hover)]",
                        isToday &&
                          !isSelected &&
                          "text-[var(--primary)] font-semibold",
                        isDisabled &&
                          "cursor-not-allowed text-[var(--muted-foreground)]/40"
                      )}
                    >
                      {day}
                    </button>
                  );
                }
              )}
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

export default DatePicker;

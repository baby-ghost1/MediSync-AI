import { useId } from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { cn } from "@/utils/cn";

const Checkbox = ({
  label,
  checked,
  onChange,
  indeterminate,
  disabled,
  error,
  className,
  id,
  ...props
}) => {
  const uid = useId();
  const checkboxId = id || `checkbox-${uid}`;

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked || false}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        aria-label={label || "Checkbox"}
        className="sr-only"
      />
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        aria-labelledby={label ? `${checkboxId}-label` : undefined}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          "relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked || indeterminate
            ? "border-[var(--primary)] bg-[var(--primary)] shadow-[0_0_12px_-2px_var(--primary)]"
            : "border-[var(--border-hover)] bg-[var(--input)] hover:border-[var(--primary)]",
          error && "border-[var(--danger)]"
        )}
        {...props}
      >
        {indeterminate ? (
          <Minus size={13} className="text-[var(--primary-foreground)]" strokeWidth={3} />
        ) : checked ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <Check size={13} className="text-[var(--primary-foreground)]" strokeWidth={3} />
          </motion.div>
        ) : null}
      </button>
      {label && (
        <label
          id={`${checkboxId}-label`}
          htmlFor={checkboxId}
          className={cn(
            "cursor-pointer select-none text-sm leading-5 text-[var(--foreground)]",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};

Checkbox.displayName = "Checkbox";
export default Checkbox;

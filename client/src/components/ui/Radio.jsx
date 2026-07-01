import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Radio = ({
  label,
  checked,
  onChange,
  value,
  disabled,
  error,
  className,
  id,
  ...props
}) => {
  const uid = useId();
  const radioId = id || `radio-${uid}`;

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <button
        type="button"
        id={radioId}
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(value)}
        className={cn(
          "relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "border-[var(--primary)]"
            : "border-[var(--border-hover)] bg-[var(--input)] hover:border-[var(--primary)]",
          error && "border-[var(--danger)]"
        )}
        {...props}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="h-[9px] w-[9px] rounded-full bg-[var(--primary)] shadow-[0_0_8px_-1px_var(--primary)]"
          />
        )}
      </button>
      {label && (
        <label
          htmlFor={radioId}
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

Radio.displayName = "Radio";
export default Radio;

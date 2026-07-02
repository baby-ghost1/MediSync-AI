import { forwardRef, useId, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = useId();

    const inputType =
      type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    return (
      <div
        className={cn(
          "flex w-full flex-col gap-2",
          containerClassName
        )}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="flex items-center gap-1 text-sm font-semibold tracking-[-0.01em] text-[var(--foreground)]"
          >
            {label}
            {required && (
              <span className="text-[var(--danger)]">*</span>
            )}
          </label>
        )}

        <motion.div
          whileFocus={{ scale: 1.005 }}
          transition={{
            duration: 0.18,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative"
        >
          {leftIcon && (
            <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[var(--muted-foreground)]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            className={cn(
              "h-11 w-full rounded-2xl",
              "border",
              "bg-[var(--card)]",
              "text-sm",
              "font-medium",
              "text-[var(--foreground)]",
              "placeholder:text-[var(--muted-foreground)]",
              "transition-all duration-200",
              "border-[var(--border)]",
              "shadow-[0_1px_2px_rgba(15,23,42,.04)]",
              "hover:border-[var(--border-hover)]",
              "focus:border-[var(--primary)]",
              "focus:ring-4",
              "focus:ring-[rgba(37,99,235,.12)]",
              "focus:outline-none",
              "disabled:pointer-events-none",
              "disabled:opacity-50",
              leftIcon ? "pl-11" : "pl-4",
              rightIcon || type === "password"
                ? "pr-11"
                : "pr-4",
              error &&
                "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[rgba(220,38,38,.12)]",
              className
            )}
            {...props}
          />          {type === "password" ? (
            <button
              type="button"
              tabIndex={-1}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
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
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          ) : (
            rightIcon && (
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                {rightIcon}
              </div>
            )
          )}
        </motion.div>

        {helperText && !error && (
          <p className="pl-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
            {helperText}
          </p>
        )}

        {error && (
          <div className="flex items-center gap-2 pl-1 text-xs font-medium text-[var(--danger)]">
            <AlertCircle
              size={14}
              className="shrink-0"
            />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
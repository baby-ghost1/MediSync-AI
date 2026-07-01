import { forwardRef, useState, useId } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
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
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium tracking-tight text-[var(--foreground)]"
          >
            {label}
            {required && (
              <span className="ml-0.5 text-[var(--danger)]">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            className={cn(
              "w-full rounded-xl border px-4 py-3 text-sm transition-all duration-150",
              "bg-[var(--input)] text-[var(--foreground)]",
              "border-[var(--border)]",
              "placeholder:text-[var(--muted-foreground)]",
              "hover:border-[var(--border-hover)]",
              "focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--ring)] focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-40",
              leftIcon ? "pl-11" : "pl-4",
              type === "password" || rightIcon ? "pr-11" : "pr-4",
              error &&
                "border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_var(--ring)]",
              className
            )}
            {...props}
          />

          {type === "password" ? (
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : (
            rightIcon && (
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {helperText && !error && (
          <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">{helperText}</p>
        )}

        {error && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--danger)]">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

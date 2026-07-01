import { forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className,
      disabled,
      required,
      rows = 4,
      resize = true,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = useId();
    const inputId = id || textareaId;

    return (
      <div className="w-full">
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
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          rows={rows}
          className={cn(
            "w-full rounded-xl border px-4 py-3 text-sm transition-all duration-150",
            "bg-[var(--input)] text-[var(--foreground)]",
            "border-[var(--border)]",
            "placeholder:text-[var(--muted-foreground)]",
            "hover:border-[var(--border-hover)]",
            "focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--ring)] focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-40",
            resize ? "resize-y" : "resize-none",
            error &&
              "border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_var(--ring)]",
            className
          )}
          {...props}
        />
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
  }
);

Textarea.displayName = "Textarea";
export default Textarea;

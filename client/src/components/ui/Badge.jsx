import { cn } from "@/utils/cn";

const variants = {
  primary:
    "border border-[var(--primary)]/15 bg-[var(--primary)]/8 text-[var(--primary)]",

  success:
    "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",

  warning:
    "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",

  danger:
    "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",

  info:
    "border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400",

  secondary:
    "border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)]",

  outline:
    "border border-[var(--border)] bg-transparent text-[var(--muted-foreground)]",

  accent:
    "border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-300",

  glass:
    "border border-white/20 bg-white/70 backdrop-blur-xl text-[var(--foreground)] dark:bg-white/10 dark:text-white",

  gradient:
    "border-0 bg-[var(--gradient-primary)] text-white shadow-sm",
};

const sizes = {
  xs: "h-5 px-2 text-[10px]",
  sm: "h-6 px-2.5 text-[11px]",
  md: "h-7 px-3 text-xs",
  lg: "h-8 px-3.5 text-sm",
};

const Badge = ({
  children,
  variant = "primary",
  size = "sm",
  rounded = true,
  className,
}) => {  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "whitespace-nowrap",
        "font-medium tracking-[-0.01em]",
        "transition-all duration-200",
        "select-none",
        "shadow-[0_1px_2px_rgba(15,23,42,.04)]",
        rounded ? "rounded-full" : "rounded-xl",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
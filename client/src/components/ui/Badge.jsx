import { cn } from "@/utils/cn";

const variants = {
  primary:
    "border border-[var(--primary-light)] bg-[var(--primary-light)] text-[var(--primary)]",

  success:
    "border border-[var(--success-light)] bg-[var(--success-light)] text-[var(--success)]",

  warning:
    "border border-[var(--warning-light)] bg-[var(--warning-light)] text-[var(--warning)]",

  danger:
    "border border-[var(--danger-light)] bg-[var(--danger-light)] text-[var(--danger)]",

  info:
    "border border-[var(--info-light)] bg-[var(--info-light)] text-[var(--info)]",

  secondary:
    "border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)]",

  outline:
    "border border-[var(--border)] bg-transparent text-[var(--muted-foreground)]",

  accent:
    "border border-[var(--accent-light)] bg-[var(--accent-light)] text-[var(--accent)]",

  glass:
    "border border-[var(--border)] bg-[var(--card)] backdrop-blur-xl text-[var(--foreground)]",

  gradient:
    "border-0 bg-[var(--gradient-primary)] text-[var(--primary-foreground)] shadow-sm",
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
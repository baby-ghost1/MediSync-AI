import { cn } from "@/utils/cn";

const variants = {
  primary:
    "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 shadow-sm",

  success:
    "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20",

  warning:
    "bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20",

  danger:
    "bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20 shadow-sm",

  secondary:
    "bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)]",

  outline:
    "bg-transparent text-[var(--muted-foreground)] border border-[var(--border)]",

  glass:
    "bg-white/10 text-white border border-white/20 backdrop-blur-xl shadow-sm",

  gradient:
    "bg-[var(--gradient-primary)] text-white border-0 shadow-md",

  info:
    "bg-[var(--info)]/10 text-[var(--info)] border border-[var(--info)]/20",

  accent:
    "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm",
};

const sizes = {
  xs: "px-1.5 py-[3px] text-[10px] leading-none",
  sm: "px-2 py-[3px] text-[11px] leading-tight",
  md: "px-2.5 py-1 text-xs leading-tight",
  lg: "px-3 py-1.5 text-sm leading-tight",
};

const Badge = ({
  children,
  variant = "primary",
  size = "sm",
  rounded = true,
  className = "",
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1 whitespace-nowrap font-medium tracking-tight",
        rounded ? "rounded-full" : "rounded-lg",
        sizes[size],
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const variants = {
  default:
    "bg-[var(--card)] border border-[var(--border)]/70 shadow-[var(--shadow-card)]",
  glass:
    "bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)]/40 shadow-[var(--shadow-card)]",
  gradient:
    "bg-gradient-to-br from-[#2563eb] via-[#4f46e5] to-[#0f766e] text-white border-0 shadow-[var(--shadow-lg)]",
  outline:
    "bg-transparent border border-[var(--border)]",
  elevated:
    "bg-[var(--card)] border border-[var(--border)]/40 shadow-[var(--shadow-xl)]",
  subtle:
    "bg-[var(--surface-subtle)] border border-transparent",
};

const padding = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

const radius = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
};

const Card = ({
  children,
  className,
  variant = "default",
  paddingSize = "md",
  radiusSize = "lg",
  hover = true,
  animate = true,
  onClick,
  ...props
}) => {
  const Component = animate ? motion.div : "div";

  return (
    <Component
      whileHover={
        hover
          ? { y: -2, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
          : undefined
      }
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      className={cn(
        "transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:shadow-[var(--shadow-card-hover)]",
        "ring-1 ring-black/[0.02] dark:ring-white/[0.04]",
        variants[variant],
        padding[paddingSize],
        radius[radiusSize],
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const variants = {
  default: [
    "bg-[var(--card)]",
    "border border-[var(--border)]",
    "shadow-[0_1px_2px_rgba(15,23,42,.04),0_8px_20px_rgba(15,23,42,.05)]",
  ].join(" "),

  glass: [
    "bg-[var(--card)]/80",
    "backdrop-blur-2xl",
    "border border-[var(--border)]/40",
    "shadow-[0_8px_24px_rgba(15,23,42,.06)]",
  ].join(" "),

  gradient: [
    "bg-[var(--gradient-primary)]",
    "text-[var(--primary-foreground)]",
    "border-0",
    "shadow-[0_14px_34px_rgba(37,99,235,.18)]",
  ].join(" "),

  outline: [
    "bg-transparent",
    "border border-[var(--border)]",
  ].join(" "),

  elevated: [
    "bg-[var(--card)]",
    "border border-[var(--border)]/70",
    "shadow-[0_18px_48px_rgba(15,23,42,.08)]",
  ].join(" "),

  subtle: [
    "bg-[var(--secondary)]/70",
    "border border-transparent",
  ].join(" "),
};

const padding = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

const radius = {
  sm: "rounded-xl",
  md: "rounded-2xl",
  lg: "rounded-2xl",
  xl: "rounded-[28px]",
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
          ? {
              y: -3,
              transition: {
                duration: 0.28,
                ease: [0.16, 1, 0.3, 1],
              },
            }
          : undefined
      }      transition={{
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1],
      }}
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
        "relative overflow-hidden",
        "transition-all duration-300",
        "ease-[cubic-bezier(0.16,1,0.3,1)]",
        "ring-1 ring-[var(--border)]/50",
        "before:absolute before:inset-0",
        "before:pointer-events-none",
        "before:bg-gradient-to-b",
        "before:from-[var(--primary-foreground)]/[0.04]",
        "before:to-transparent",
        hover &&
          "hover:ring-[var(--border-hover)]/50 hover:shadow-[0_18px_40px_rgba(15,23,42,.08)]",
        variants[variant],
        padding[paddingSize],
        radius[radiusSize],
        onClick &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/25",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
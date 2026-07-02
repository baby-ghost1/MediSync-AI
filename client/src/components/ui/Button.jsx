// import { forwardRef } from "react";
// import { LoaderCircle } from "lucide-react";
// import { motion } from "framer-motion";
// import { cn } from "@/utils/cn";

// const variants = {
//   primary:
//     "bg-[var(--primary)] text-white shadow-[0_8px_24px_rgba(37,99,235,0.2)] hover:shadow-[0_16px_36px_rgba(37,99,235,0.24)] hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/15 before:to-transparent before:pointer-events-none",

//   secondary:
//     "bg-[var(--secondary)] hover:bg-[var(--border)] text-[var(--foreground)] dark:bg-[var(--secondary)] dark:hover:bg-[var(--border-hover)] shadow-[0_4px_14px_rgba(15,23,42,0.04)] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]",

//   outline:
//     "border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)] active:bg-[var(--surface-active)] text-[var(--foreground)]",

//   ghost:
//     "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] active:bg-[var(--surface-active)] rounded-xl",

//   danger:
//     "bg-[var(--danger)] hover:brightness-110 active:brightness-95 text-white shadow-[0_1px_2px_rgba(220,38,38,0.2)] hover:shadow-[0_4px_12px_rgba(220,38,38,0.3),0_1px_2px_rgba(220,38,38,0.1)]",

//   success:
//     "bg-[var(--success)] hover:brightness-110 active:brightness-95 text-white shadow-[0_1px_2px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_12px_rgba(16,185,129,0.3),0_1px_2px_rgba(16,185,129,0.1)]",

//   gradient:
//     "text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.05)] bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#06b6d4] bg-[length:200%_100%] bg-left hover:bg-right relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.2)_50%,transparent_70%)] before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",

//   glass:
//     "backdrop-blur-xl bg-white/15 dark:bg-white/8 border border-white/25 dark:border-white/15 text-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-white/25 dark:hover:bg-white/12 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
// };

// const sizes = {
//   xs: "h-8 px-3 text-xs gap-1.5 rounded-md",
//   sm: "h-9 px-4 text-sm gap-1.5 rounded-lg",
//   md: "h-10 px-5 text-sm gap-2 rounded-xl",
//   lg: "h-11 px-6 text-sm gap-2.5 rounded-2xl",
//   xl: "h-12 px-8 text-base gap-3 rounded-2xl",
//   icon: "h-10 w-10 p-0 rounded-xl",
// };

// const Button = forwardRef(
//   (
//     {
//       children,
//       className,
//       variant = "primary",
//       size = "md",
//       loading = false,
//       disabled = false,
//       fullWidth = false,
//       leftIcon,
//       rightIcon,
//       "aria-label": ariaLabel,
//       ...props
//     },
//     ref
//   ) => {
//     return (
//       <motion.button
//         whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
//         transition={{ duration: 0.1, ease: [0.32, 0.72, 0, 1] }}
//         ref={ref}
//         disabled={disabled || loading}
//         aria-disabled={disabled || loading}
//         aria-label={ariaLabel || (typeof children === "string" ? children : undefined)}
//         aria-busy={loading}
//         className={cn(
//           "inline-flex items-center justify-center font-medium transition-all duration-200 select-none",
//           "ease-[cubic-bezier(0.32,0.72,0,1)]",
//           "focus:outline-none focus-visible:outline-none",
//           "focus-visible:ring-[3px] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
//           "disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none",
//           "active:scale-[0.97]",
//           "relative isolate",
//           variants[variant],
//           sizes[size],
//           fullWidth && "w-full",
//           variant === "gradient" && "text-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
//           loading && "cursor-wait",
//           className
//         )}
//         {...props}
//       >
//         {loading ? (
//           <LoaderCircle
//             size={size === "xs" || size === "sm" ? 14 : size === "xl" ? 20 : 16}
//             className="animate-spin"
//             strokeWidth={2.5}
//           />
//         ) : (
//           <>
//             {leftIcon && <span className="shrink-0 -mx-0.5">{leftIcon}</span>}
//             <span className={variant === "gradient" ? "relative z-[1]" : undefined}>{children}</span>
//             {rightIcon && <span className="shrink-0 -mx-0.5">{rightIcon}</span>}
//           </>
//         )}
//       </motion.button>
//     );
//   }
// );

// Button.displayName = "Button";

// export default Button;



import { forwardRef } from "react";
import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const variants = {
  primary: [
    "relative overflow-hidden",
    "bg-[var(--primary)]",
    "text-white",
    "border border-[var(--primary)]",
    "shadow-[0_1px_2px_rgba(15,23,42,.06),0_8px_20px_rgba(37,99,235,.14)]",
    "hover:bg-[var(--primary-hover)]",
    "hover:shadow-[0_10px_28px_rgba(37,99,235,.18)]",
    "active:shadow-[0_4px_12px_rgba(37,99,235,.12)]",
    "before:absolute before:inset-0",
    "before:bg-gradient-to-b before:from-white/10 before:to-transparent",
    "before:pointer-events-none",
  ].join(" "),

  secondary: [
    "bg-[var(--card)]",
    "text-[var(--foreground)]",
    "border border-[var(--border)]",
    "shadow-[0_1px_2px_rgba(15,23,42,.04)]",
    "hover:bg-[var(--secondary)]",
    "hover:border-[var(--border-hover)]",
  ].join(" "),

  outline: [
    "bg-transparent",
    "border border-[var(--border)]",
    "text-[var(--foreground)]",
    "hover:border-[var(--primary)]",
    "hover:bg-[var(--primary-light)]",
  ].join(" "),

  ghost: [
    "bg-transparent",
    "text-[var(--muted-foreground)]",
    "hover:text-[var(--foreground)]",
    "hover:bg-[var(--surface-hover)]",
  ].join(" "),

  danger: [
    "bg-[var(--danger)]",
    "border border-[var(--danger)]",
    "text-white",
    "shadow-[0_8px_20px_rgba(220,38,38,.14)]",
    "hover:brightness-105",
  ].join(" "),

  success: [
    "bg-[var(--success)]",
    "border border-[var(--success)]",
    "text-white",
    "shadow-[0_8px_20px_rgba(5,150,105,.14)]",
    "hover:brightness-105",
  ].join(" "),

  gradient: [
    "relative overflow-hidden",
    "bg-[var(--gradient-primary)]",
    "text-white",
    "shadow-[0_10px_26px_rgba(37,99,235,.16)]",
    "before:absolute before:inset-0",
    "before:bg-gradient-to-b",
    "before:from-white/10",
    "before:to-transparent",
    "before:pointer-events-none",
  ].join(" "),

  glass: [
    "backdrop-blur-xl",
    "bg-white/70",
    "dark:bg-white/10",
    "border border-white/30",
    "text-[var(--foreground)]",
  ].join(" "),
};

const sizes = {
  xs: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  sm: "h-9 px-4 text-sm gap-2 rounded-xl",
  md: "h-10 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-sm gap-2.5 rounded-2xl",
xl: "h-14 px-8 text-base gap-3 rounded-2xl",
  icon: "h-10 w-10 rounded-xl p-0",
};

const Button = forwardRef(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {    return (
      <motion.button
        ref={ref}
        whileTap={{
          scale: disabled || loading ? 1 : 0.985,
        }}
        transition={{
          duration: 0.14,
          ease: [0.16, 1, 0.3, 1],
        }}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        aria-label={
          ariaLabel ||
          (typeof children === "string" ? children : undefined)
        }
        className={cn(
          "relative isolate inline-flex items-center justify-center",
"overflow-hidden",
"leading-none",
"align-middle",
          "font-medium tracking-[-0.01em]",
          "transition-all duration-200",
          "ease-[cubic-bezier(0.16,1,0.3,1)]",
          "select-none whitespace-nowrap",
          "focus-visible:outline-none",
          "focus-visible:ring-[3px]",
          "focus-visible:ring-[var(--primary)]/20",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--background)]",
          "disabled:pointer-events-none",
          "disabled:opacity-45",
          "disabled:shadow-none",
          "active:translate-y-px",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          loading && "cursor-wait",
          className
        )}
        {...props}
      >
        {loading ? (
          <LoaderCircle
            size={
              size === "xs"
                ? 14
                : size === "sm"
                ? 15
                : size === "xl"
                ? 20
                : 17
            }
            strokeWidth={2.25}
            className="animate-spin"
          />
        ) : (
          <>
            {/* {leftIcon && (
              <span className="flex shrink-0 items-center justify-center">
                {leftIcon}
              </span>
            )}

            <span
              className={cn(
                "relative z-[1] flex items-center justify-center",
                variant === "gradient" && "drop-shadow-sm"
              )}
            >
              {children}
            </span>

            {rightIcon && (
              <span className="flex shrink-0 items-center justify-center">
                {rightIcon}
              </span>
            )} */}
            <>
  {leftIcon && (
    <span className="relative z-10 flex shrink-0 items-center justify-center">
      {leftIcon}
    </span>
  )}

  <span
    className={cn(
      "relative z-10",
      "flex flex-1 items-center justify-center",
      "min-w-0",
      "overflow-hidden",
      "text-center",
      "leading-none",
      "whitespace-nowrap",
      "font-semibold",
      variant === "gradient" && "drop-shadow-[0_1px_1px_rgba(0,0,0,.18)]"
    )}
  >
    {children}
  </span>

  {rightIcon && (
    <span className="relative z-10 flex shrink-0 items-center justify-center">
      {rightIcon}
    </span>
  )}
</>
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

const sizes = {
  sm: "w-80",
  md: "w-[420px]",
  lg: "w-[560px]",
  xl: "w-[700px]",
  full: "w-screen",
};

const placements = {
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    position: "left-0",
  },
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    position: "right-0",
  },
};

const Drawer = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  placement = "right",
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  className,
}) => {
  const drawerRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (!open) return;
    previousActiveElement.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow || "";
      previousActiveElement.current?.focus();
    };
  }, [open]);

  const handleKeyDown = useCallback((e) => {
    if (e.key !== "Tab" || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const current = placements[placement];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={title || "Drawer"}
          onKeyDown={handleKeyDown}
        >
          <div
            onClick={() => closeOnOverlay && onClose?.()}
            aria-hidden="true"
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />

          <motion.div
            ref={drawerRef}
            initial={current.initial}
            animate={current.animate}
            exit={current.exit}
            transition={{
              type: "spring",
              damping: 32,
              stiffness: 320,
              mass: 1,
            }}
            tabIndex={-1}
            className={cn(
              "absolute top-0 h-full",
              "flex flex-col",
              "bg-[var(--card)]",
              "shadow-2xl shadow-black/20",
              "focus:outline-none",
              placement === "right"
                ? "border-l border-[var(--border)]/50"
                : "border-r border-[var(--border)]/50",
              current.position,
              sizes[size],
              className
            )}
          >
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between border-b border-[var(--border)]/50 px-6 py-5">
                <div className="pr-4">
                  {title && (
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {subtitle}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    aria-label="Close drawer"
                    className="rounded-lg p-1.5 text-[var(--muted-foreground)] transition-all duration-150 hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] active:scale-95"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {footer && (
              <div className="border-t border-[var(--border)]/50 px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Drawer;

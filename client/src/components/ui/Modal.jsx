import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

const sizes = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-[96vw] h-[94vh]",
};

const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  className,
}) => {
  const modalRef = useRef(null);
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
    modalRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow || "";
      previousActiveElement.current?.focus();
    };
  }, [open]);

  const handleKeyDown = useCallback((e) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll(
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

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={title || "Modal"}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          onKeyDown={handleKeyDown}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeOnOverlay && onClose?.()}
            aria-hidden="true"
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            tabIndex={-1}
            className={cn(
              "relative z-10 w-full overflow-hidden rounded-2xl border border-[var(--border)]/50",
              "bg-[var(--card)]",
              "shadow-2xl shadow-black/20",
              "focus:outline-none",
              sizes[size],
              className
            )}
            onClick={(e) => e.stopPropagation()}
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
                    aria-label="Close modal"
                    className="rounded-lg p-1.5 text-[var(--muted-foreground)] transition-all duration-150 hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] active:scale-95"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              {children}
            </div>

            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-[var(--border)]/50 px-6 py-4">
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

export default Modal;

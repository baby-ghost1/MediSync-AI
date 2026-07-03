import { motion } from "framer-motion";
import { Inbox, AlertCircle, SearchX, WifiOff } from "lucide-react";

import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const icons = {
  empty: Inbox,
  error: AlertCircle,
  search: SearchX,
  offline: WifiOff,
};

const EmptyState = ({
  icon = "empty",
  title = "No data found",
  description = "There's nothing here yet.",
  action,
  className,
}) => {
  const Icon = icons[icon] || Inbox;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center px-4",
        className
      )}
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-subtle)] ring-1 ring-[var(--border)]">
        <Icon className="h-8 w-8 text-[var(--muted-foreground)]" />
      </div>

      <h3 className="mb-1.5 text-lg font-semibold text-[var(--foreground)]">
        {title}
      </h3>

      <p className="mb-7 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
        {description}
      </p>

      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
};

const ErrorState = ({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  error,
  onRetry,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center px-4",
        className
      )}
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--danger-light)] ring-1 ring-[var(--danger)]/20">
        <AlertCircle className="h-8 w-8 text-[var(--danger)]" />
      </div>

      <h3 className="mb-1.5 text-lg font-semibold text-[var(--foreground)]">
        {title}
      </h3>

      <p className="mb-2 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
        {description}
      </p>

      {error && (
        <p className="mb-7 max-w-md rounded-lg bg-[var(--danger-light)] px-4 py-2.5 text-xs text-[var(--danger)] font-mono">
          {error}
        </p>
      )}

      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export { EmptyState, ErrorState };

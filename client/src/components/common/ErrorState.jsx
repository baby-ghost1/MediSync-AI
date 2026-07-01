import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";

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
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30 ring-1 ring-red-200 dark:ring-red-900/50">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>

      <h3 className="mb-1.5 text-lg font-semibold text-[var(--foreground)]">
        {title}
      </h3>

      <p className="mb-2 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
        {description}
      </p>

      {error && (
        <p className="mb-7 max-w-md rounded-lg bg-red-50 dark:bg-red-950/20 px-4 py-2.5 text-xs text-red-600 dark:text-red-400 font-mono">
          {error}
        </p>
      )}

      {onRetry && (
        <Button variant="primary" leftIcon={<RefreshCw size={16} />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;

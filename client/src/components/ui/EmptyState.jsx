import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { cn } from "@/utils/cn";

const EmptyState = ({
  title = "No Data Found",
  description = "There is nothing to display.",
  icon,
  actionText,
  onAction,
  actionLink,
  actionVariant = "primary",
  secondaryAction,
  compact = false,
  className,
}) => {
  const Icon = icon || Inbox;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--secondary)]/50 text-center",
        compact ? "py-10" : "py-16",
        className
      )}
    >
      <div className="rounded-2xl bg-[var(--primary)]/10 p-4 ring-1 ring-[var(--primary)]/10">
        <Icon size={32} className="text-[var(--primary)]" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-[var(--muted-foreground)]">{description}</p>
      <div className="mt-6 flex items-center gap-3">
        {actionLink && (
          <Link to={actionLink}>
            <Button size="sm" variant={actionVariant}>{actionText}</Button>
          </Link>
        )}
        {actionText && onAction && !actionLink && (
          <Button size="sm" variant={actionVariant} onClick={onAction}>{actionText}</Button>
        )}
        {secondaryAction && (
          <Button size="sm" variant="ghost" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;

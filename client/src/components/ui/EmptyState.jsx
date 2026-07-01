import { Inbox } from "lucide-react";
import Button from "./Button";

const EmptyState = ({
  title = "No Data Found",
  description = "There is nothing to display.",
  icon,
  actionText,
  onAction,
}) => {
  const Icon = icon || Inbox;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--secondary)]/50 py-16 text-center">
      <div className="rounded-2xl bg-[var(--primary-light)] p-4">
        <Icon size={32} className="text-[var(--primary)]" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-[var(--muted-foreground)]">
        {description}
      </p>
      {actionText && (
        <Button className="mt-6" onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

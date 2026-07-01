import { TriangleAlert } from "lucide-react";
import Button from "./Button";

const ErrorState = ({
  title = "Something went wrong",
  description = "Please try again later.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger-light)] py-16 text-center">
      <div className="rounded-2xl bg-[var(--danger)]/10 p-4">
        <TriangleAlert size={32} className="text-[var(--danger)]" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-[var(--muted-foreground)]">
        {description}
      </p>
      {onRetry && (
        <Button variant="danger" className="mt-6" onClick={onRetry} size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;

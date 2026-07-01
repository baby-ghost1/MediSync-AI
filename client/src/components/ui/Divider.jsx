import { cn } from "@/utils/cn";

const Divider = ({ text, className }) => {
  if (text) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-xs font-medium text-[var(--muted-foreground)] whitespace-nowrap">
          {text}
        </span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>
    );
  }

  return <hr className={cn("border-[var(--border)]", className)} />;
};

export default Divider;

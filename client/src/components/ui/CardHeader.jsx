import { cn } from "@/utils/cn";

const CardHeader = ({ title, subtitle, action, className }) => {
  return (
    <div
      className={cn(
        "mb-5 flex items-start justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default CardHeader;

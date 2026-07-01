import { cn } from "@/utils/cn";

const shimmer = "animate-pulse bg-[var(--surface-hover)] rounded-lg";

const CardSkeleton = ({ className }) => (
  <div
    className={cn(
      "rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5",
      className
    )}
  >
    <div className={cn(shimmer, "mb-3 h-4 w-1/3")} />
    <div className={cn(shimmer, "mb-2 h-7 w-2/3")} />
    <div className={cn(shimmer, "h-3 w-1/2")} />
  </div>
);

const StatCardSkeleton = () => (
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
    <div className="mb-3 flex items-center gap-3">
      <div className={cn(shimmer, "h-10 w-10 rounded-xl")} />
      <div className="flex-1 space-y-2">
        <div className={cn(shimmer, "h-3 w-20")} />
        <div className={cn(shimmer, "h-5 w-16")} />
      </div>
    </div>
    <div className={cn(shimmer, "h-3 w-24")} />
  </div>
);

const TableSkeleton = ({ rows = 5, cols = 4, className }) => (
  <div className={cn("space-y-3", className)}>
    <div className={cn(shimmer, "h-10 w-full rounded-xl")} />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <div
            key={j}
            className={cn(shimmer, "h-8 rounded-lg", j === 0 ? "w-1/3" : "flex-1")}
          />
        ))}
      </div>
    ))}
  </div>
);

const FormSkeleton = ({ fields = 4, className }) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i}>
        <div className={cn(shimmer, "mb-2 h-3 w-24")} />
        <div className={cn(shimmer, "h-10 w-full rounded-xl")} />
      </div>
    ))}
    <div className={cn(shimmer, "mt-5 h-10 w-32 rounded-xl")} />
  </div>
);

const ListSkeleton = ({ items = 4, className }) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: items }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
      >
        <div className={cn(shimmer, "h-12 w-12 shrink-0 rounded-xl")} />
        <div className="flex-1 space-y-2">
          <div className={cn(shimmer, "h-4 w-2/3")} />
          <div className={cn(shimmer, "h-3 w-1/3")} />
        </div>
        <div className={cn(shimmer, "h-8 w-20 shrink-0 rounded-lg")} />
      </div>
    ))}
  </div>
);

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className={cn(shimmer, "h-20 w-20 rounded-full")} />
      <div className="space-y-2 text-center sm:text-left">
        <div className={cn(shimmer, "mx-auto h-5 w-40 sm:mx-0")} />
        <div className={cn(shimmer, "mx-auto h-3 w-28 sm:mx-0")} />
      </div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div className={cn(shimmer, "mb-2 h-3 w-20")} />
          <div className={cn(shimmer, "h-10 w-full rounded-xl")} />
        </div>
      ))}
    </div>
  </div>
);

const ChartSkeleton = ({ className }) => (
  <div
    className={cn(
      "rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5",
      className
    )}
  >
    <div className={cn(shimmer, "mb-5 h-4 w-32")} />
    <div className="flex items-end gap-2.5" style={{ height: 180 }}>
      {[45, 72, 58, 85, 63, 90, 50, 78].map((h, i) => (
        <div
          key={i}
          className={cn(shimmer, "flex-1 rounded-t-lg")}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
);

export {
  CardSkeleton,
  StatCardSkeleton,
  TableSkeleton,
  FormSkeleton,
  ListSkeleton,
  ProfileSkeleton,
  ChartSkeleton,
};

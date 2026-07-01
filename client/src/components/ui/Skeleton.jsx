import { cn } from "@/utils/cn";

const Skeleton = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[var(--surface-hover)]",
        className
      )}
    />
  );
};

export default Skeleton;

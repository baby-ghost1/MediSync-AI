import { LoaderCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const sizes = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-10 w-10",
  xl: "h-14 w-14",
};

const Spinner = ({
  size = "md",
  text,
  fullscreen = false,
  overlay = false,
  className,
}) => {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <LoaderCircle
        className={cn(
          "animate-spin text-[var(--primary)]",
          sizes[size]
        )}
        strokeWidth={2}
      />
      {text && (
        <p className="text-sm font-medium text-[var(--muted-foreground)]">
          {text}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)]/60 backdrop-blur-2xl">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-[var(--background)]/50 backdrop-blur-xl">
        {content}
      </div>
    );
  }

  return content;
};

export default Spinner;

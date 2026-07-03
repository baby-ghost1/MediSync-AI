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
          "animate-spin text-[var(--primary)] drop-shadow-sm",
          sizes[size]
        )}
        style={{ animationDuration: "1.2s" }}
        strokeWidth={2.5}
      />
      {text && (
        <p className="animate-pulse text-sm font-semibold tracking-wide text-[var(--muted-foreground)]">
          {text}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--background)]/60">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center rounded-[inherit] bg-[var(--background)]/60 backdrop-blur-sm supports-[backdrop-filter]:bg-[var(--background)]/40 transition-all">
        {content}
      </div>
    );
  }

  return content;
};

export default Spinner;
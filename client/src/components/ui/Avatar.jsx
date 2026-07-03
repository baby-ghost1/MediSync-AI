import { User } from "lucide-react";
import { cn } from "@/utils/cn";

const sizes = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-20 w-20 text-xl",
};

const Avatar = ({
  src,
  alt = "Avatar",
  name = "",
  size = "md",
  className,
}) => {
  const initials = name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        "border border-[var(--border)]",
        "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]",
        "shadow-[0_4px_14px_rgba(15,23,42,.08)]",
        "transition-all duration-300",
        "ring-1 ring-[var(--border)]/40",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      ) : initials ? (
        <div className="flex h-full w-full items-center justify-center font-semibold tracking-tight text-[var(--primary-foreground)]">
          {initials}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <User
            size={
              size === "xs"
                ? 12
                : size === "sm"
                ? 14
                : size === "lg"
                ? 20
                : size === "xl"
                ? 34
                : 18
            }
            className="text-[var(--primary-foreground)]"
          />
        </div>
      )}
    </div>
  );
};

export default Avatar;
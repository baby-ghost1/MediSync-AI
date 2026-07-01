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
        "relative overflow-hidden rounded-full bg-gradient-to-br from-[var(--primary)]/90 to-[var(--accent)]/80 flex items-center justify-center font-medium text-white shrink-0 ring-1 ring-white/10",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : initials ? (
        <span className="leading-none tracking-wide">{initials}</span>
      ) : (
        <User size={size === "xs" ? 12 : size === "sm" ? 14 : 18} className="opacity-80" />
      )}
    </div>
  );
};

export default Avatar;

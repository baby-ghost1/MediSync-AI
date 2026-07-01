import { cn } from "@/utils/cn";

const CardFooter = ({ children, className }) => {
  return (
    <div
      className={cn(
        "mt-5 flex items-center justify-end gap-2",
        className
      )}
    >
      {children}
    </div>
  );
};

export default CardFooter;

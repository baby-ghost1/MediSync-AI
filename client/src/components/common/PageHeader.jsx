import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Badge from "@/components/ui/Badge";

const PageHeader = ({
  title,
  description,
  badge,
  actions,
  className,
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "flex flex-col gap-6",
        "lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {badge && (
          <div className="mb-3">
            <Badge size="sm" variant="primary">
              {badge}
            </Badge>
          </div>
        )}

        <h1
          className={cn(
            "text-[30px] font-semibold tracking-[-0.03em]",
            "leading-tight",
            "text-[var(--foreground)]",
            "sm:text-[34px]",
            "lg:text-[42px]"
          )}
        >
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              "mt-3 max-w-3xl",
              "text-[15px] leading-7",
              "text-[var(--muted-foreground)]",
              "sm:text-base"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div
          className={cn(
            "flex w-full flex-wrap items-center justify-start gap-3",
            "lg:w-auto lg:justify-end"
          )}
        >
          {actions}
        </div>
      )}
    </motion.header>
  );
};

export default PageHeader;
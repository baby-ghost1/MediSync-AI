import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";

const PageHeader = ({ title, description, badge, actions, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col justify-between gap-6 lg:flex-row lg:items-end ${className || ""}`}
    >
      <div className="max-w-2xl">
        {badge && <Badge variant="primary">{badge}</Badge>}
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </motion.div>
  );
};

export default PageHeader;

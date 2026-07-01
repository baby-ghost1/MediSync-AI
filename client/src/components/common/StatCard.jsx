import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "@/components/ui/Card";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendLabel,
  onClick,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card onClick={onClick} className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" hover={!!onClick} paddingSize="md">
        <div
          className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${color} opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.12]`}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
              {title}
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)] lg:text-3xl tabular-nums">
              {value}
            </h3>
          </div>
          {Icon && (
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg shadow-black/10`}
            >
              <Icon size={20} />
            </div>
          )}
        </div>
        {(trend !== undefined || trendLabel) && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
            {trend > 0 ? (
              <ArrowUpRight size={14} className="text-[var(--success)]" />
            ) : trend < 0 ? (
              <ArrowDownRight size={14} className="text-[var(--danger)]" />
            ) : (
              <span className="inline-block h-3.5 w-3.5" />
            )}
            {trend !== undefined && (
              <span
                className={
                  trend > 0
                    ? "text-[var(--success)]"
                    : trend < 0
                    ? "text-[var(--danger)]"
                    : "text-[var(--muted-foreground)]"
                }
              >
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            )}
            {trendLabel && (
              <span className="text-[var(--muted-foreground)]">
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default StatCard;

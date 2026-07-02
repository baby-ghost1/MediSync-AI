import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card
        hover={!!onClick}
        onClick={onClick}
        paddingSize="md"
        className="group relative overflow-hidden"
      >
        <div
          className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${color} opacity-[0.06] blur-3xl transition-opacity duration-300 group-hover:opacity-[0.10]`}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              {title}
            </p>

            <h3 className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
              {value}
            </h3>

            {(trend !== undefined || trendLabel) && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                {trend > 0 ? (
                  <ArrowUpRight
                    size={15}
                    className="text-[var(--success)]"
                  />
                ) : trend < 0 ? (
                  <ArrowDownRight
                    size={15}
                    className="text-[var(--danger)]"
                  />
                ) : (
                  <span className="h-[15px] w-[15px]" />
                )}

                {trend !== undefined && (
                  <span
                    className={
                      trend > 0
                        ? "font-semibold text-[var(--success)]"
                        : trend < 0
                        ? "font-semibold text-[var(--danger)]"
                        : "font-semibold text-[var(--muted-foreground)]"
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
          </div>

          {Icon && (
            <div
              className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-[0_10px_24px_rgba(15,23,42,.10)]`}
            >
              <Icon size={21} />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/cn";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";

const DataTable = ({
  columns,
  data,
  loading,
  error,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  keyExtractor = (row, i) => row._id || i,
}) => {
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner size="lg" text="Loading data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-[var(--danger)]">{error}</p>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title={emptyTitle || "No data found"}
        description={emptyDescription || "There is nothing to display."}
        icon={emptyIcon}
      />
    );
  }

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return <ChevronsUpDown size={14} className="text-[var(--muted-foreground)]" />;
    return sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--secondary)]/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]",
                  col.sortable && "cursor-pointer select-none hover:text-[var(--foreground)]",
                  col.className
                )}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && <SortIcon column={col.key} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {data.map((row, i) => (
            <motion.tr
              key={keyExtractor(row, i)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "transition-colors duration-150",
                onRowClick && "cursor-pointer hover:bg-[var(--surface-hover)]"
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-5 py-3.5 text-sm text-[var(--foreground)]", col.cellClassName)}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

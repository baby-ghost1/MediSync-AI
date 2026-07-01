import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { cn } from "@/utils/cn";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const FilterPanel = ({
  filters = [],
  values = {},
  onChange,
  onReset,
  onApply,
  title = "Filters",
  className,
}) => {
  const [open, setOpen] = useState(false);

  const handleChange = (key, val) => {
    onChange?.({ ...values, [key]: val });
  };

  const hasActiveFilters = Object.values(values).some((v) => v !== "" && v !== undefined && v !== null);

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant={hasActiveFilters ? "primary" : "outline"}
          size="sm"
          leftIcon={hasActiveFilters ? <Filter size={16} /> : <SlidersHorizontal size={16} />}
          onClick={() => setOpen(!open)}
        >
          {title}
          {hasActiveFilters && (
            <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-xs font-bold">
              {Object.values(values).filter((v) => v !== "" && v !== undefined && v !== null).length}
            </span>
          )}
        </Button>
        {hasActiveFilters && (
          <button onClick={onReset} className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--danger)]">
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-50 mt-2 w-[360px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl dark:shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
              <button onClick={() => setOpen(false)} className="rounded-md p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-5 space-y-4">
              {filters.map((filter) => (
                <div key={filter.key}>
                  {filter.type === "search" && (
                    <Input
                      label={filter.label}
                      placeholder={filter.placeholder || "Search..."}
                      leftIcon={<Search size={16} />}
                      value={values[filter.key] || ""}
                      onChange={(e) => handleChange(filter.key, e.target.value)}
                    />
                  )}
                  {filter.type === "select" && (
                    <Select
                      label={filter.label}
                      placeholder={filter.placeholder || "All"}
                      options={filter.options || []}
                      value={values[filter.key]}
                      onChange={(val) => handleChange(filter.key, val.value)}
                    />
                  )}
                  {filter.type === "range" && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">{filter.label}</label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          placeholder={filter.minPlaceholder || "Min"}
                          value={values[`${filter.key}Min`] || ""}
                          onChange={(e) => handleChange(`${filter.key}Min`, e.target.value)}
                          containerClassName="flex-1"
                        />
                        <span className="text-[var(--muted-foreground)]">-</span>
                        <Input
                          type="number"
                          placeholder={filter.maxPlaceholder || "Max"}
                          value={values[`${filter.key}Max`] || ""}
                          onChange={(e) => handleChange(`${filter.key}Max`, e.target.value)}
                          containerClassName="flex-1"
                        />
                      </div>
                    </div>
                  )}
                  {filter.type === "date" && (
                    <Input
                      type="date"
                      label={filter.label}
                      value={values[filter.key] || ""}
                      onChange={(e) => handleChange(filter.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] px-5 py-3.5">
              <Button variant="outline" size="sm" onClick={() => { onReset?.(); setOpen(false); }}>
                Reset
              </Button>
              <Button variant="primary" size="sm" onClick={() => { onApply?.(values); setOpen(false); }}>
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;

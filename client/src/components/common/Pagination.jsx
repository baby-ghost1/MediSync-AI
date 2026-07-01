import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

const Pagination = ({ page, totalPages, onPageChange, total }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);

    pages.push(1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <p className="text-sm text-[var(--muted-foreground)]">
        Page {page} of {totalPages}
        {total !== undefined && ` (${total} total)`}
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-2.5"
        >
          <ChevronLeft size={16} />
        </Button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-[var(--muted-foreground)]">...</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "primary" : "outline"}
              size="sm"
              onClick={() => onPageChange(p)}
              className={p === page ? "min-w-[36px] shadow-sm" : "min-w-[36px]"}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-2.5"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

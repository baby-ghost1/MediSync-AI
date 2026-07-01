import { useState, useMemo } from "react";

export function usePagination({ defaultPage = 1, defaultLimit = 10 } = {}) {
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultLimit);

  const reset = () => setPage(1);

  const queryParams = useMemo(() => ({ page, limit }), [page, limit]);

  return {
    page,
    limit,
    setPage,
    setLimit,
    reset,
    queryParams,
  };
}

export default usePagination;

interface PaginationParams {
  page: number;
  limit: number;
  totalItems: number;
}

interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function pagination<T>({
  page = 1,
  limit = 10,
  totalItems,
}: PaginationParams): PaginatedResult<T> {
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.min(Math.max(page, 1), totalPages); // Make sure page is within range
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    data: [], // data would be populated from your query
    totalItems,
    totalPages,
    currentPage,
    hasNextPage,
    hasPrevPage,
  };
}

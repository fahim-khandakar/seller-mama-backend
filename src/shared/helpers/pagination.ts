interface PaginationParams {
  page: number;
  limit: number;
  totalItems: number;
}

interface PaginatedResult<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export function pagination<T>({
  page = 1,
  limit = 10,
  totalItems,
}: PaginationParams): PaginatedResult<T> {
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.min(Math.max(page, 1), totalPages); // Make sure page is within range

  return {
    totalItems,
    totalPages,
    currentPage,
  };
}

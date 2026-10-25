import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProductQueryParams } from "../types";

export interface UrlProductFilters {
  q: string;
  category: string;
  page: number;
  limit: number;
  skip: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface UseUrlProductFiltersReturn {
  filters: UrlProductFilters;
  queryParams: ProductQueryParams;
  setSearch: (q: string) => void;
  setCategory: (category: string) => void;
  setPage: (page: number) => void;
  setSort: (sortBy?: string, order?: "asc" | "desc") => void;
  resetFilters: () => void;
}

const DEFAULT_PAGE_LIMIT = 20;

export function useUrlProductFilters(): UseUrlProductFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const sortBy = searchParams.get("sortBy") || undefined;
  const rawOrder = searchParams.get("order");
  const order: "asc" | "desc" | undefined =
    rawOrder === "desc" || rawOrder === "asc" ? rawOrder : undefined;

  const limit = DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;

  const filters: UrlProductFilters = useMemo(
    () => ({
      q,
      category,
      page,
      limit,
      skip,
      sortBy,
      order,
    }),
    [q, category, page, limit, skip, sortBy, order],
  );

  const queryParams: ProductQueryParams = useMemo(
    () => ({
      q: q.trim() || undefined,
      category: category.trim() || undefined,
      limit,
      skip,
      sortBy,
      order,
    }),
    [q, category, limit, skip, sortBy, order],
  );

  const setSearch = useCallback(
    (newQuery: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const trimmed = newQuery.trim();
          if (trimmed) {
            next.set("q", trimmed);
          } else {
            next.delete("q");
          }
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setCategory = useCallback(
    (newCategory: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const trimmed = newCategory.trim();
          if (trimmed && trimmed !== "all") {
            next.set("category", trimmed);
          } else {
            next.delete("category");
          }
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newPage > 1) {
            next.set("page", String(newPage));
          } else {
            next.delete("page");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSort = useCallback(
    (newSortBy?: string, newOrder?: "asc" | "desc") => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newSortBy) {
            next.set("sortBy", newSortBy);
            if (newOrder) {
              next.set("order", newOrder);
            } else {
              next.delete("order");
            }
          } else {
            next.delete("sortBy");
            next.delete("order");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    filters,
    queryParams,
    setSearch,
    setCategory,
    setPage,
    setSort,
    resetFilters,
  };
}

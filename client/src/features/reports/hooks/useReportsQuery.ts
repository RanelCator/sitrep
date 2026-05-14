// src/features/reports/hooks/useReportsQuery.ts

import { useQuery } from "@tanstack/react-query"

import { getGeneratedReportsRequest } from "@/features/reports/services/reports.service"

interface UseReportsQueryParams {
  page: number
  limit: number
  search?: string
}

export function useReportsQuery({
  page,
  limit,
  search,
}: UseReportsQueryParams) {
  return useQuery({
    queryKey: [
      "generated-reports",
      page,
      limit,
      search,
    ],

    queryFn: () =>
      getGeneratedReportsRequest({
        page,
        limit,
        search,
      }),
  })
}
// src/features/reported-incidents/hooks/useReportedIncidentsQuery.ts
import { useQuery } from "@tanstack/react-query"

import { getReportedIncidentsRequest } from "@/features/reported-incidents/services/reported-incidents.service"

interface UseReportedIncidentsQueryParams {
  page: number
  limit: number
  search?: string
}

export function useReportedIncidentsQuery({
  page,
  limit,
  search,
}: UseReportedIncidentsQueryParams) {
  return useQuery({
    queryKey: ["reported-incidents", page, limit, search],
    queryFn: () =>
      getReportedIncidentsRequest({
        page,
        limit,
        search,
      }),
  })
}
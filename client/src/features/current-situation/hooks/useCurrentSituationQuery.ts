// src/features/current-situation/hooks/useCurrentSituationQuery.ts
import { useQuery } from "@tanstack/react-query"

import {
  getAreaConcernsRequest,
  getCommitteesRequest,
  getCurrentSituationsRequest,
} from "@/features/current-situation/services/current-situation.service"

interface QueryParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

interface AreaConcernQueryParams extends QueryParams {
  committeeId?: string
}

export function useCurrentSituationsQuery(params: QueryParams) {
  return useQuery({
    queryKey: [
      "current-situations",
      params.page,
      params.limit,
      params.search,
      params.sortBy,
      params.sortOrder,
    ],
    queryFn: () => getCurrentSituationsRequest(params),
  })
}

export function useCommitteesQuery(params: QueryParams) {
  return useQuery({
    queryKey: [
      "committees",
      params.page,
      params.limit,
      params.search,
      params.sortBy,
      params.sortOrder,
    ],
    queryFn: () => getCommitteesRequest(params),
  })
}

export function useAreaConcernsQuery(params: AreaConcernQueryParams) {
  return useQuery({
    queryKey: [
      "area-concerns",
      params.page,
      params.limit,
      params.search,
      params.committeeId,
      params.sortBy,
      params.sortOrder,
    ],
    queryFn: () => getAreaConcernsRequest(params),
  })
}
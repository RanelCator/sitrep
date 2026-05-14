// src/features/other-delegation/hooks/useOtherDelegationQuery.ts
import { useQuery } from "@tanstack/react-query"

import { getOtherDelegationsRequest } from "@/features/other-delegation/services/other-delegation.service"

interface UseOtherDelegationQueryParams {
  page: number
  limit: number
  search?: string
}

export function useOtherDelegationQuery({
  page,
  limit,
  search,
}: UseOtherDelegationQueryParams) {
  return useQuery({
    queryKey: ["other-delegation", page, limit, search],
    queryFn: () =>
      getOtherDelegationsRequest({
        page,
        limit,
        search,
      }),
  })
}
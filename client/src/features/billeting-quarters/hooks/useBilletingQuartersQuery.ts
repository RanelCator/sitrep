// src/features/billeting-quarters/hooks/useBilletingQuartersQuery.ts
import { useQuery } from "@tanstack/react-query"

import { getBilletingQuartersRequest } from "@/features/billeting-quarters/services/billeting-quarters.service"

interface UseBilletingQuartersQueryParams {
  page: number
  limit: number
  search?: string
}

export function useBilletingQuartersQuery({
  page,
  limit,
  search,
}: UseBilletingQuartersQueryParams) {
  return useQuery({
    queryKey: ["billeting-quarters", page, limit, search],
    queryFn: () =>
      getBilletingQuartersRequest({
        page,
        limit,
        search,
      }),
  })
}
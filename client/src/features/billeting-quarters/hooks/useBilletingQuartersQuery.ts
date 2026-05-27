// src/features/billeting-quarters/hooks/useBilletingQuartersQuery.ts

import { useQuery } from "@tanstack/react-query"

import { getBilletingQuartersRequest } from "@/features/billeting-quarters/services/billeting-quarters.service"

interface UseBilletingQuartersQueryParams {
  page: number
  limit: number
  search?: string
}

export const billetingQuarterQueryKeys = {
  all: ["billeting-quarters"] as const,

  lists: () =>
    [...billetingQuarterQueryKeys.all, "list"] as const,

  list: (
    params: UseBilletingQuartersQueryParams,
  ) =>
    [
      ...billetingQuarterQueryKeys.lists(),
      params,
    ] as const,
}

export function useBilletingQuartersQuery({
  page,
  limit,
  search,
}: UseBilletingQuartersQueryParams) {
  return useQuery({
    queryKey: billetingQuarterQueryKeys.list({
      page,
      limit,
      search,
    }),

    queryFn: () =>
      getBilletingQuartersRequest({
        page,
        limit,
        search,
      }),
  })
}
// src/features/other-information/hooks/useOtherInformationQuery.ts
import { useQuery } from "@tanstack/react-query"

import { getOtherInformationRequest } from "@/features/other-information/services/other-information.service"

interface UseOtherInformationQueryParams {
  page: number
  limit: number
  search?: string
}

export function useOtherInformationQuery({
  page,
  limit,
  search,
}: UseOtherInformationQueryParams) {
  return useQuery({
    queryKey: [
      "other-information",
      page,
      limit,
      search,
    ],

    queryFn: () =>
      getOtherInformationRequest({
        page,
        limit,
        search,
      }),
  })
}
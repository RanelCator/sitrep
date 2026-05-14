import { useQuery } from "@tanstack/react-query"

import { getHighlightsRequest } from "@/features/highlights/services/highlights.service"

interface UseHighlightsQueryParams {
  page: number
  limit: number
  search?: string
}

export function useHighlightsQuery({
  page,
  limit,
  search,
}: UseHighlightsQueryParams) {
  return useQuery({
    queryKey: [
      "highlights",
      page,
      limit,
      search,
    ],

    queryFn: () =>
      getHighlightsRequest({
        page,
        limit,
        search,
      }),
  })
}
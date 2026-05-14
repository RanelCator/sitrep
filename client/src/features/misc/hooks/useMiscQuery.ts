// src/features/misc/hooks/useMiscQuery.ts
import { useQuery } from "@tanstack/react-query"

import { getMiscRequest } from "@/features/misc/services/misc.service"

export function useMiscQuery() {
  return useQuery({
    queryKey: ["misc"],
    queryFn: getMiscRequest,
  })
}
// src/features/reports/hooks/useReportViewQuery.ts
import { useQuery } from "@tanstack/react-query"

import { getGeneratedReportByIdRequest } from "@/features/reports/services/reports.service"

export function useReportViewQuery(id: string) {
  return useQuery({
    queryKey: ["generated-report", id],
    queryFn: () => getGeneratedReportByIdRequest(id),
    enabled: Boolean(id),
  })
}
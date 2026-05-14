// src/features/dashboard/hooks/useDashboardSummaryQuery.ts

import { useQuery } from "@tanstack/react-query"

import { getDashboardSummaryRequest } from "@/features/dashboard/services/dashboard.service"

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: ["dashboard-summary"],

    queryFn: getDashboardSummaryRequest,
  })
}
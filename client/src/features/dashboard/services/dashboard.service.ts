// src/features/dashboard/services/dashboard.service.ts

import { api } from "@/shared/lib/api"

import type { DashboardSummaryResponse } from "@/features/dashboard/types/dashboard.types"

export async function getDashboardSummaryRequest() {
  const { data } =
    await api.get<DashboardSummaryResponse>(
      "/dashboard/summary",
    )

  return data
}
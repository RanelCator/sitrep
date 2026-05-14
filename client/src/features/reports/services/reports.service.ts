// src/features/reports/services/reports.service.ts

import { api } from "@/shared/lib/api"

import type {
  GenerateDailyReportPayload,
  GeneratedReportsResponse,
  SingleGeneratedReportResponse,
} from "@/features/reports/types/reports.types"

interface FetchGeneratedReportsParams {
  page: number
  limit: number
  search?: string
}

export async function getGeneratedReportsRequest(
  params: FetchGeneratedReportsParams,
) {
  const { data } =
    await api.get<GeneratedReportsResponse>(
      "/reports",
      {
        params,
      },
    )

  return data
}

export async function generateDailyReportRequest(
  payload: GenerateDailyReportPayload,
) {
  const { data } = await api.post(
    "/reports/daily/generate",
    payload,
  )

  return data
}

export async function getGeneratedReportRequest(
  reportDate: string,
) {
  const { data } =
    await api.get<SingleGeneratedReportResponse>(
      `/reports/daily/${reportDate}`,
    )

  return data
}

export async function getGeneratedReportByIdRequest(id: string) {
  const { data } =
    await api.get<SingleGeneratedReportResponse>(
      `/reports/${id}`,
    )

  return data
}
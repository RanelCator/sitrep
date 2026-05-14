// src/features/reported-incidents/services/reported-incidents.service.ts
import { api } from "@/shared/lib/api"

import type {
  CreateReportedIncidentPayload,
  ReportedIncidentsResponse,
} from "@/features/reported-incidents/types/reported-incidents.types"

interface FetchReportedIncidentsParams {
  page: number
  limit: number
  search?: string
}

export async function getReportedIncidentsRequest(
  params: FetchReportedIncidentsParams,
) {
  const { data } = await api.get<ReportedIncidentsResponse>(
    "/reported-incidents",
    { params },
  )

  return data
}

export async function createReportedIncidentRequest(
  payload: CreateReportedIncidentPayload,
) {
  const { data } = await api.post("/reported-incidents", payload)
  return data
}

export async function updateReportedIncidentRequest(
  id: string,
  payload: CreateReportedIncidentPayload,
) {
  const { data } = await api.put(`/reported-incidents/${id}`, payload)
  return data
}

export async function deleteReportedIncidentRequest(id: string) {
  const { data } = await api.delete(`/reported-incidents/${id}`)
  return data
}
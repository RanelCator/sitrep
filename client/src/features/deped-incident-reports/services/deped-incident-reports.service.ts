import { api } from "@/shared/lib/api"
import type {
  CreateDepedIncidentReportInput,
  DepedIncidentReportsResponse,
  UpdateDepedIncidentReportInput,
} from "../types/deped-incident-reports.types"

const BASE_URL = "/deped-incident-reports"

export async function getDepedIncidentReportsRequest(params: {
  page: number
  limit: number
}) {
  const { data } =
    await api.get<DepedIncidentReportsResponse>(BASE_URL, {
      params,
    })

  return data
}

export async function createDepedIncidentReportRequest(
  payload: CreateDepedIncidentReportInput,
) {
  const { data } = await api.post(BASE_URL, payload)
  return data
}

export async function updateDepedIncidentReportRequest(
  id: string,
  payload: UpdateDepedIncidentReportInput,
) {
  const { data } = await api.patch(`${BASE_URL}/${id}`, payload)
  return data
}

export async function deleteDepedIncidentReportRequest(id: string) {
  const { data } = await api.delete(`${BASE_URL}/${id}`)
  return data
}
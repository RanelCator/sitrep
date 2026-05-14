// src/features/billeting-quarters/services/billeting-quarters.service.ts
import { api } from "@/shared/lib/api"

import type {
  BilletingQuartersResponse,
  CreateBilletingQuarterPayload,
} from "@/features/billeting-quarters/types/billeting-quarters.types"

interface FetchBilletingQuartersParams {
  page: number
  limit: number
  search?: string
}

export async function getBilletingQuartersRequest(
  params: FetchBilletingQuartersParams,
) {
  const { data } = await api.get<BilletingQuartersResponse>(
    "/billeting-quarters",
    { params },
  )

  return data
}

export async function createBilletingQuarterRequest(
  payload: CreateBilletingQuarterPayload,
) {
  const { data } = await api.post("/billeting-quarters", payload)
  return data
}

export async function updateBilletingQuarterRequest(
  id: string,
  payload: CreateBilletingQuarterPayload,
) {
  const { data } = await api.put(`/billeting-quarters/${id}`, payload)
  return data
}

export async function deleteBilletingQuarterRequest(id: string) {
  const { data } = await api.delete(`/billeting-quarters/${id}`)
  return data
}

export async function setBilletingQuarterStatusRequest(
  id: string,
  isActive: boolean,
) {
  const { data } = await api.patch(`/billeting-quarters/${id}/status`, {
    isActive,
  })

  return data
}
// src/features/other-delegation/services/other-delegation.service.ts
import { api } from "@/shared/lib/api"

import type {
  CreateOtherDelegationPayload,
  OtherDelegationResponse,
  SingleOtherDelegationResponse,
} from "@/features/other-delegation/types/other-delegation.types"

interface FetchOtherDelegationParams {
  page: number
  limit: number
  search?: string
}

export async function getOtherDelegationsRequest(
  params: FetchOtherDelegationParams,
) {
  const { data } = await api.get<OtherDelegationResponse>(
    "/other-delegation",
    { params },
  )

  return data
}

export async function createOtherDelegationRequest(
  payload: CreateOtherDelegationPayload,
) {
  const { data } = await api.post<SingleOtherDelegationResponse>(
    "/other-delegation",
    payload,
  )

  return data
}

export async function updateOtherDelegationRequest(
  id: string,
  payload: CreateOtherDelegationPayload,
) {
  const { data } = await api.put<SingleOtherDelegationResponse>(
    `/other-delegation/${id}`,
    payload,
  )

  return data
}

export async function setOtherDelegationStatusRequest(
  id: string,
  isActive: boolean,
) {
  const { data } = await api.patch<SingleOtherDelegationResponse>(
    `/other-delegation/${id}/status`,
    { isActive },
  )

  return data
}

export async function deleteOtherDelegationRequest(id: string) {
  const { data } = await api.delete(`/other-delegation/${id}`)

  return data
}
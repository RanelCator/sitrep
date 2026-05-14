// src/features/other-information/services/other-information.service.ts
import { api } from "@/shared/lib/api"

import type {
  CreateOtherInformationPayload,
  OtherInformationResponse,
} from "@/features/other-information/types/other-information.types"

interface FetchOtherInformationParams {
  page: number
  limit: number
  search?: string
}

export async function getOtherInformationRequest(
  params: FetchOtherInformationParams,
) {
  const { data } =
    await api.get<OtherInformationResponse>(
      "/other-information",
      { params },
    )

  return data
}

export async function createOtherInformationRequest(
  payload: CreateOtherInformationPayload,
) {
  const { data } = await api.post(
    "/other-information",
    payload,
  )

  return data
}

export async function updateOtherInformationRequest(
  id: string,
  payload: CreateOtherInformationPayload,
) {
  const { data } = await api.put(
    `/other-information/${id}`,
    payload,
  )

  return data
}

export async function deleteOtherInformationRequest(
  id: string,
) {
  const { data } = await api.delete(
    `/other-information/${id}`,
  )

  return data
}
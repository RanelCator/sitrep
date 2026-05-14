import { api } from "@/shared/lib/api"

import type {
  CreateHighlightPayload,
  HighlightsResponse,
} from "@/features/highlights/types/highlights.types"

interface FetchHighlightsParams {
  page: number
  limit: number
  search?: string
}

export async function getHighlightsRequest(
  params: FetchHighlightsParams,
) {
  const { data } = await api.get<HighlightsResponse>(
    "/highlights",
    {
      params,
    },
  )

  return data
}

export async function createHighlightRequest(
  payload: CreateHighlightPayload,
) {
  const { data } = await api.post(
    "/highlights",
    payload,
  )

  return data
}

export async function updateHighlightRequest(
  id: string,
  payload: CreateHighlightPayload,
) {
  const { data } = await api.put(
    `/highlights/${id}`,
    payload,
  )

  return data
}

export async function deleteHighlightRequest(id: string) {
  const { data } = await api.delete(
    `/highlights/${id}`,
  )

  return data
}
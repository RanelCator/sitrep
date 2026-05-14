// src/features/current-situation/services/current-situation.service.ts
import { api } from "@/shared/lib/api"

import type {
  AreaConcern,
  Committee,
  CreateAreaConcernPayload,
  CreateCommitteePayload,
  CreateCurrentSituationPayload,
  CurrentSituation,
  PaginatedResponse,
  SingleResponse,
} from "@/features/current-situation/types/current-situation.types"

interface FetchParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

interface FetchAreaConcernParams extends FetchParams {
  committeeId?: string
}

export async function getCurrentSituationsRequest(params: FetchParams) {
  const { data } = await api.get<PaginatedResponse<CurrentSituation>>(
    "/current-situations",
    { params },
  )

  return data
}

export async function createCurrentSituationRequest(
  payload: CreateCurrentSituationPayload,
) {
  const { data } = await api.post<SingleResponse<CurrentSituation>>(
    "/current-situations",
    payload,
  )

  return data
}

export async function updateCurrentSituationRequest(
  id: string,
  payload: CreateCurrentSituationPayload,
) {
  const { data } = await api.put<SingleResponse<CurrentSituation>>(
    `/current-situations/${id}`,
    payload,
  )

  return data
}

export async function deleteCurrentSituationRequest(id: string) {
  const { data } = await api.delete(`/current-situations/${id}`)
  return data
}

export async function getCommitteesRequest(params: FetchParams) {
  const { data } = await api.get<PaginatedResponse<Committee>>(
    "/current-situations/committees",
    { params },
  )

  return data
}

export async function createCommitteeRequest(
  payload: CreateCommitteePayload,
) {
  const { data } = await api.post<SingleResponse<Committee>>(
    "/current-situations/committees",
    payload,
  )

  return data
}

export async function updateCommitteeRequest(
  id: string,
  payload: CreateCommitteePayload,
) {
  const { data } = await api.put<SingleResponse<Committee>>(
    `/current-situations/committees/${id}`,
    payload,
  )

  return data
}

export async function deleteCommitteeRequest(id: string) {
  const { data } = await api.delete(
    `/current-situations/committees/${id}`,
  )

  return data
}

export async function getAreaConcernsRequest(
  params: FetchAreaConcernParams,
) {
  const { data } = await api.get<PaginatedResponse<AreaConcern>>(
    "/current-situations/area-concerns",
    { params },
  )

  return data
}

export async function createAreaConcernRequest(
  payload: CreateAreaConcernPayload,
) {
  const { data } = await api.post<SingleResponse<AreaConcern>>(
    "/current-situations/area-concerns",
    payload,
  )

  return data
}

export async function updateAreaConcernRequest(
  id: string,
  payload: CreateAreaConcernPayload,
) {
  const { data } = await api.put<SingleResponse<AreaConcern>>(
    `/current-situations/area-concerns/${id}`,
    payload,
  )

  return data
}

export async function deleteAreaConcernRequest(id: string) {
  const { data } = await api.delete(
    `/current-situations/area-concerns/${id}`,
  )

  return data
}
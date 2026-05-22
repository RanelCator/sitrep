import { api } from "@/shared/lib/api"

import type {
  CreateWeatherUpdateInput,
  UpdateWeatherUpdateInput,
  WeatherUpdatesResponse,
} from "../types/weather-updates.types"

const BASE_URL = "/weather-updates"

export async function getWeatherUpdatesRequest(params: {
  page: number
  limit: number
}) {
  const { data } =
    await api.get<WeatherUpdatesResponse>(BASE_URL, {
      params,
    })

  return data
}

export async function createWeatherUpdateRequest(
  payload: CreateWeatherUpdateInput,
) {
  const { data } = await api.post(BASE_URL, payload)
  return data
}

export async function updateWeatherUpdateRequest(
  id: string,
  payload: UpdateWeatherUpdateInput,
) {
  const { data } = await api.patch(
    `${BASE_URL}/${id}`,
    payload,
  )

  return data
}

export async function deleteWeatherUpdateRequest(
  id: string,
) {
  const { data } = await api.delete(
    `${BASE_URL}/${id}`,
  )

  return data
}
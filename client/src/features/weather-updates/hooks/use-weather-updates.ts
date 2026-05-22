import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  createWeatherUpdateRequest,
  deleteWeatherUpdateRequest,
  getWeatherUpdatesRequest,
  updateWeatherUpdateRequest,
} from "../services/weather-updates.service"

export const weatherUpdateQueryKeys = {
  all: ["weather-updates"] as const,

  list: (params: {
    page: number
    limit: number
  }) =>
    [
      ...weatherUpdateQueryKeys.all,
      "list",
      params,
    ] as const,
}

export function useWeatherUpdates(params: {
  page: number
  limit: number
}) {
  return useQuery({
    queryKey: weatherUpdateQueryKeys.list(params),

    queryFn: () =>
      getWeatherUpdatesRequest(params),
  })
}

export function useCreateWeatherUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWeatherUpdateRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: weatherUpdateQueryKeys.all,
      })
    },
  })
}

export function useUpdateWeatherUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: any
    }) =>
      updateWeatherUpdateRequest(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: weatherUpdateQueryKeys.all,
      })
    },
  })
}

export function useDeleteWeatherUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteWeatherUpdateRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: weatherUpdateQueryKeys.all,
      })
    },
  })
}
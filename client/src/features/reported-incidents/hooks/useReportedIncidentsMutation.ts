// src/features/reported-incidents/hooks/useReportedIncidentsMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createReportedIncidentRequest,
  deleteReportedIncidentRequest,
  updateReportedIncidentRequest,
} from "@/features/reported-incidents/services/reported-incidents.service"

export function useCreateReportedIncidentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReportedIncidentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reported-incidents"],
      })
    },
  })
}

export function useUpdateReportedIncidentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: any
    }) => updateReportedIncidentRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reported-incidents"],
      })
    },
  })
}

export function useDeleteReportedIncidentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteReportedIncidentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reported-incidents"],
      })
    },
  })
}
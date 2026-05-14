// src/features/other-information/hooks/useOtherInformationMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createOtherInformationRequest,
  deleteOtherInformationRequest,
  updateOtherInformationRequest,
} from "@/features/other-information/services/other-information.service"

export function useCreateOtherInformationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOtherInformationRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["other-information"],
      })
    },
  })
}

export function useUpdateOtherInformationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: any
    }) =>
      updateOtherInformationRequest(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["other-information"],
      })
    },
  })
}

export function useDeleteOtherInformationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteOtherInformationRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["other-information"],
      })
    },
  })
}
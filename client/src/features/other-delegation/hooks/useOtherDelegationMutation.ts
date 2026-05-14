// src/features/other-delegation/hooks/useOtherDelegationMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createOtherDelegationRequest,
  deleteOtherDelegationRequest,
  setOtherDelegationStatusRequest,
  updateOtherDelegationRequest,
} from "@/features/other-delegation/services/other-delegation.service"

export function useCreateOtherDelegationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOtherDelegationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["other-delegation"],
      })
    },
  })
}

export function useUpdateOtherDelegationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: any
    }) => updateOtherDelegationRequest(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["other-delegation"],
      })
    },
  })
}

export function useSetOtherDelegationStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: string
      isActive: boolean
    }) => setOtherDelegationStatusRequest(id, isActive),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["other-delegation"],
      })
    },
  })
}

export function useDeleteOtherDelegationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteOtherDelegationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["other-delegation"],
      })
    },
  })
}
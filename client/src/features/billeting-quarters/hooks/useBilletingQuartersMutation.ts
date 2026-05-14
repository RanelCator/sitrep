// src/features/billeting-quarters/hooks/useBilletingQuartersMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createBilletingQuarterRequest,
  deleteBilletingQuarterRequest,
  setBilletingQuarterStatusRequest,
  updateBilletingQuarterRequest,
} from "@/features/billeting-quarters/services/billeting-quarters.service"

export function useCreateBilletingQuarterMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBilletingQuarterRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["billeting-quarters"],
      })
    },
  })
}

export function useUpdateBilletingQuarterMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: any
    }) => updateBilletingQuarterRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["billeting-quarters"],
      })
    },
  })
}

export function useDeleteBilletingQuarterMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBilletingQuarterRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["billeting-quarters"],
      })
    },
  })
}

export function useSetBilletingQuarterStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: string
      isActive: boolean
    }) => setBilletingQuarterStatusRequest(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["billeting-quarters"],
      })
    },
  })
}
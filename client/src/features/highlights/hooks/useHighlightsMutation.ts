import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createHighlightRequest,
  deleteHighlightRequest,
  updateHighlightRequest,
} from "@/features/highlights/services/highlights.service"

export function useCreateHighlightMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createHighlightRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["highlights"],
      })
    },
  })
}

export function useUpdateHighlightMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: any
    }) =>
      updateHighlightRequest(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["highlights"],
      })
    },
  })
}

export function useDeleteHighlightMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteHighlightRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["highlights"],
      })
    },
  })
}
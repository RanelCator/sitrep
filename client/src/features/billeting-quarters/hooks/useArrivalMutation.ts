// src/features/billeting-quarters/hooks/useArrivalMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateBilletingQuarterArrivalRequest } from "@/features/billeting-quarters/services/arrival.service"

export function useUpdateArrivalMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: {
        DateTimeEntered?: string
        athletes: number
        coaches: number
        advance_party: number
        trainers: number
      }
    }) => updateBilletingQuarterArrivalRequest(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["billeting-quarters"],
      })
    },
  })
}
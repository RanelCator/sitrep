// src/features/billeting-quarters/hooks/useDepartureMutation.ts

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateDepartureRequest } from "@/features/billeting-quarters/services/departure.service"

import { billetingQuarterQueryKeys } from "@/features/billeting-quarters/hooks/useBilletingQuartersQuery"

export function useUpdateDepartureMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateDepartureRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: billetingQuarterQueryKeys.all,
      })
    },
  })
}
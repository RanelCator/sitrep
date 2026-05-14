// src/features/misc/hooks/useMiscMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateMiscRequest } from "@/features/misc/services/misc.service"

export function useUpdateMiscMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMiscRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["misc"],
      })
    },
  })
}
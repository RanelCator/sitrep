// src/features/reports/hooks/useReportsMutation.ts

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { generateDailyReportRequest } from "@/features/reports/services/reports.service"

export function useGenerateDailyReportMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateDailyReportRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["generated-reports"],
      })
    },
  })
}
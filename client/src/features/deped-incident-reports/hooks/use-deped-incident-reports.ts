import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createDepedIncidentReportRequest,
  deleteDepedIncidentReportRequest,
  getDepedIncidentReportsRequest,
  updateDepedIncidentReportRequest,
} from "../services/deped-incident-reports.service"

export const depedIncidentReportQueryKeys = {
  all: ["deped-incident-reports"] as const,
  list: (params: { page: number; limit: number }) =>
    [...depedIncidentReportQueryKeys.all, "list", params] as const,
}

export function useDepedIncidentReports(params: {
  page: number
  limit: number
}) {
  return useQuery({
    queryKey: depedIncidentReportQueryKeys.list(params),
    queryFn: () => getDepedIncidentReportsRequest(params),
  })
}

export function useCreateDepedIncidentReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDepedIncidentReportRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: depedIncidentReportQueryKeys.all,
      })
    },
  })
}

export function useUpdateDepedIncidentReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: any
    }) => updateDepedIncidentReportRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: depedIncidentReportQueryKeys.all,
      })
    },
  })
}

export function useDeleteDepedIncidentReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDepedIncidentReportRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: depedIncidentReportQueryKeys.all,
      })
    },
  })
}
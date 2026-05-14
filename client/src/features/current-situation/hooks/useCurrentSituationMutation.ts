// src/features/current-situation/hooks/useCurrentSituationMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createAreaConcernRequest,
  createCommitteeRequest,
  createCurrentSituationRequest,
  deleteAreaConcernRequest,
  deleteCommitteeRequest,
  deleteCurrentSituationRequest,
  updateAreaConcernRequest,
  updateCommitteeRequest,
  updateCurrentSituationRequest,
} from "@/features/current-situation/services/current-situation.service"

export function useCreateCurrentSituationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCurrentSituationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-situations"] })
    },
  })
}

export function useUpdateCurrentSituationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateCurrentSituationRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-situations"] })
    },
  })
}

export function useDeleteCurrentSituationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCurrentSituationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-situations"] })
    },
  })
}

export function useCreateCommitteeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCommitteeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["committees"] })
    },
  })
}

export function useUpdateCommitteeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateCommitteeRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["committees"] })
    },
  })
}

export function useDeleteCommitteeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCommitteeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["committees"] })
      queryClient.invalidateQueries({ queryKey: ["area-concerns"] })
    },
  })
}

export function useCreateAreaConcernMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAreaConcernRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["area-concerns"] })
    },
  })
}

export function useUpdateAreaConcernMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateAreaConcernRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["area-concerns"] })
    },
  })
}

export function useDeleteAreaConcernMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAreaConcernRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["area-concerns"] })
    },
  })
}
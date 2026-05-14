import type { FetchCurrentSituationParams } from "../types/current-situation.params"

export const currentSituationQueryKeys = {
  all: ["current-situations"] as const,

  lists: () => [...currentSituationQueryKeys.all, "list"] as const,

  list: (params: FetchCurrentSituationParams) =>
    [...currentSituationQueryKeys.lists(), params] as const,

  details: () => [...currentSituationQueryKeys.all, "detail"] as const,

  detail: (id: string) => [...currentSituationQueryKeys.details(), id] as const,
}
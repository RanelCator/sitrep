// src/features/misc/services/misc.service.ts
import { api } from "@/shared/lib/api"

import type {
  MiscResponse,
  UpdateMiscPayload,
} from "@/features/misc/types/misc.types"

export async function getMiscRequest() {
  const { data } = await api.get<MiscResponse>("/misc")
  return data
}

export async function updateMiscRequest(payload: UpdateMiscPayload) {
  const { data } = await api.patch<MiscResponse>("/misc", payload)
  return data
}
// src/features/billeting-quarters/services/arrival.service.ts
import { api } from "@/shared/lib/api"

import type { UpdateArrivalPayload } from "@/features/billeting-quarters/types/arrival.types"

export async function updateBilletingQuarterArrivalRequest(
  id: string,
  payload: UpdateArrivalPayload,
) {
  const { data } = await api.patch(
    `/billeting-quarters/${id}/arrival`,
    payload,
  )

  return data
}
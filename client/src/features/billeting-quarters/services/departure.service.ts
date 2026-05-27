// src/features/billeting-quarters/services/departure.service.ts

import { api } from "@/shared/lib/api"

import type { UpdateDeparturePayload } from "@/features/billeting-quarters/types/departure.types"

export async function updateDepartureRequest({
  id,
  payload,
}: {
  id: string
  payload: UpdateDeparturePayload
}) {
  const response = await api.patch(
    `/billeting-quarters/${id}/departure`,
    payload,
  )

  return response.data
}
// src/features/misc/types/misc.types.ts
export interface Misc {
  _id: string
  infrastructure: number
  infrastructure_description: string
  peripherals: number
  peripherals_description: string
  sports_equipment: number
  sports_equipment_description: string
  billeting_quarters_assigned: number
  identified_billeting_quarters: number
  identified_billeting_quarters_text: string
}

export interface MiscResponse {
  success: boolean
  message: string
  data: Misc
}

export interface UpdateMiscPayload {
  infrastructure?: number
  infrastructure_description?: string
  peripherals?: number
  peripherals_description?: string
  sports_equipment?: number
  sports_equipment_description?: string
  billeting_quarters_assigned?: number
  identified_billeting_quarters?: number
  identified_billeting_quarters_text?: string
}
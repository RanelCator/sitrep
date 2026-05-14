// src/features/billeting-quarters/types/billeting-quarters.types.ts

export interface BilletingQuarter {
  _id: string
  Billeting_Quarters: string
  Delegation: string
  Preparedness_Rating: number
  expected_delegates: number
  isActive: boolean
arrived?: {
    DateTimeEntered: string
    athletes: number
    coaches: number
    advance_party: number
    trainers: number
}
  AddedBy?: {
    userId?: string
    name: string
    username: string
    role: string
  }

  createdAt: string
  updatedAt: string
}


export interface BilletingQuartersResponse {
  success: boolean
  message: string
  data: BilletingQuarter[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateBilletingQuarterPayload {
  Billeting_Quarters: string
  Delegation: string
  Preparedness_Rating: number
  expected_delegates: number
  isActive?: boolean
}
// src/features/other-delegation/types/other-delegation.types.ts

export interface OtherDelegation {
  _id: string
  description: string
  expected_delegates: number
  arrived: number
  isActive: boolean

  AddedBy?: {
    name: string
    username: string
    role: string
  }

  createdAt: string
  updatedAt: string
}

export interface OtherDelegationResponse {
  success: boolean
  message: string
  data: OtherDelegation[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SingleOtherDelegationResponse {
  success: boolean
  message: string
  data: OtherDelegation
}

export interface CreateOtherDelegationPayload {
  description: string
  expected_delegates: number
  arrived: number
  isActive?: boolean
}
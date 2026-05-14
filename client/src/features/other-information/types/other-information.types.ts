// src/features/other-information/types/other-information.types.ts

export interface OtherInformation {
  _id: string

  description: string

  AddedBy?: {
    name: string
    username: string
    role: string
  }

  createdAt: string
  updatedAt: string
}

export interface OtherInformationResponse {
  success: boolean
  message: string
  data: OtherInformation[]

  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateOtherInformationPayload {
  description: string
}
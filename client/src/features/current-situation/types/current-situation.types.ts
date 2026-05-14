// src/features/current-situation/types/current-situation.types.ts

export interface Committee {
  _id: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AreaConcern {
  _id: string
  name: string
  committeeId: string
  committeeName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CurrentSituation {
  _id: string
  DateTimeEntered: string
  Committee: string
  area_concern: string
  cuurent_situation: string
  issues_concerns?: string
  actions_undertaken?: string
  recommendations?: string
  AddedBy?: {
    name: string
    username: string
    role: string
  }
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SingleResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface CreateCurrentSituationPayload {
  DateTimeEntered: string
  Committee: string
  area_concern: string
  cuurent_situation: string
  issues_concerns?: string
  actions_undertaken?: string
  recommendations?: string
}

export interface CreateCommitteePayload {
  name: string
  isActive?: boolean
}

export interface CreateAreaConcernPayload {
  name: string
  committeeId: string
  isActive?: boolean
}
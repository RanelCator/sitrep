// src/features/auth/types/auth.types.ts

export type AuthUser = {
  userId: string
  sqlServerUserId: string
  username: string
  name: string
  role: string
  regionID?: number
  groupID?: number
  arsIds?: number[]
  isActive: boolean
}

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: AuthUser
  }
}

export interface LogoutResponse {
  success: boolean
  message: string
}
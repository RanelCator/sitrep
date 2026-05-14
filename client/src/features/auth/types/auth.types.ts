// src/features/auth/types/auth.types.ts

export interface AuthUser {
  userId: string
  sqlServerUserId: string
  username: string
  name: string
  role: string
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
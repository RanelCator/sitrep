// src/auth/types/auth-request.type.ts
import type { Request } from 'express'

export interface AuthUser {
  userId: string
  sqlServerUserId: string
  username: string
  name: string
  role: string
  permissions: string[]
}

export interface AuthRequest extends Request {
  user: AuthUser
}
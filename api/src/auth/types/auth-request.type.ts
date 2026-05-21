// src/auth/types/auth-request.type.ts
import type { Request } from 'express'

export interface AuthUser {
  userId: string
  sqlServerUserId: string
  username: string
  name: string
  role: string
  regionID?: number
  groupID?: number
  arsIds?: number[]
  permissions: string[]
}

export interface AuthRequest extends Request {
  user: AuthUser
}
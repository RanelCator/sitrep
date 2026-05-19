// src/features/auth/services/auth.service.ts

import { api } from "@/shared/lib/api"

import type {
  AuthResponse,
  LoginPayload,
  LogoutResponse,
} from "@/features/auth/types/auth.types"

export async function loginRequest(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/login",
    payload,
  )

  return data
}

export async function arsLoginRequest(
  id: number,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/ars-login",
    {
      id,
    },
  )

  return data
}

export async function getCurrentUserRequest(): Promise<AuthResponse> {
  const { data } = await api.get<AuthResponse>(
    "/auth/me",
  )

  return data
}

export async function logoutRequest(): Promise<LogoutResponse> {
  const { data } = await api.post<LogoutResponse>(
    "/auth/logout",
  )

  return data
}
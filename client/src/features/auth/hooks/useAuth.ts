// src/features/auth/hooks/useAuth.ts
import { useCallback } from "react"

import { authStore } from "@/features/auth/services/auth-store"
import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
} from "@/features/auth/services/auth.service"

export function useAuth() {
  const initialize = useCallback(async () => {
    try {
      const result = await getCurrentUserRequest()

      if (result.success && result.data?.user) {
        authStore.setUser(result.data.user)
      } else {
        authStore.clear()
      }
    } catch {
      authStore.clear()
    }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const result = await loginRequest({
      username,
      password,
    })

    if (result.success && result.data?.user) {
      authStore.setUser(result.data.user)
    } else {
      authStore.clear()
    }

    return result
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      authStore.clear()
    }
  }, [])

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isInitialized: authStore.isInitialized,
    initialize,
    login,
    logout,
  }
}
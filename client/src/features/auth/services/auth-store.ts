// src/features/auth/services/auth-store.ts
import { getCurrentUserRequest } from "@/features/auth/services/auth.service"
import type { AuthUser } from "@/features/auth/types/auth.types"

class AuthStore {
  user: AuthUser | null = null
  isAuthenticated = false
  isInitialized = false

  setUser(user: AuthUser) {
    this.user = user
    this.isAuthenticated = true
    this.isInitialized = true
  }

  clear() {
    this.user = null
    this.isAuthenticated = false
    this.isInitialized = true
  }

  async initialize() {
    try {
      const result = await getCurrentUserRequest()

      if (result.success && result.data?.user) {
        this.setUser(result.data.user)
      } else {
        this.clear()
      }
    } catch {
      this.clear()
    }
  }
}

export const authStore = new AuthStore()
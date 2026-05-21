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

  hasArsAccess(arsId: number) {
    return this.user?.arsIds?.includes(arsId) ?? false
  }

  hasAnyArsAccess(arsIds: number[]) {
    return arsIds.some((arsId) =>
      this.user?.arsIds?.includes(arsId),
    )
  }

  hasGroup(groupID: number) {
    return this.user?.groupID === groupID
  }

  async initialize() {
    if (this.isInitialized) {
      return
    }

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

  async reload() {
    this.isInitialized = false
    await this.initialize()
  }
}

export const authStore = new AuthStore()
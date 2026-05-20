// src/app/guards/auth.guard.ts

import { redirect } from "@tanstack/react-router"

import { authStore } from "@/features/auth/services/auth-store"

export function requireAuth() {
  return async () => {
    await authStore.initialize()

    if (!authStore.isAuthenticated) {
      throw redirect({
        to: "/unauthorized",
      })
    }
  }
}
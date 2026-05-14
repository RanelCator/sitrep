// src/features/app/layouts/AppLayout.tsx
import { Outlet } from "@tanstack/react-router"

import { useAuth } from "@/features/auth/hooks/useAuth"

export default function AppLayout() {
  const { isInitialized } = useAuth()

  if (!isInitialized) return null

  return (
    <main className="min-h-screen bg-background p-6">
      <Outlet />
    </main>
  )
}
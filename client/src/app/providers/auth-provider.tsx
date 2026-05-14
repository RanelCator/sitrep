// src/providers/auth-provider.tsx
import { useEffect, type PropsWithChildren } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function AuthProvider({ children }: PropsWithChildren) {
  const { initialize } = useAuth()

  useEffect(() => {
    void initialize()
  }, [initialize])

  return children
}
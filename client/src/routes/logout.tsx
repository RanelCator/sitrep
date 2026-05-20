// src/routes/logout.tsx

import { createFileRoute, redirect } from "@tanstack/react-router"

import { api } from "@/shared/lib/api"

export const Route = createFileRoute("/logout")({
  beforeLoad: async () => {
    try {
      await api.post("/auth/logout")
    } catch {
      // ignore logout errors
    }

    throw redirect({
      to: "/login",
    })
  },

  component: () => null,
})
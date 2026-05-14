// src/routes/_authenticated/route.tsx
import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '@/app/guards/auth.guard'
import AppLayout from '@/features/app/layout/AppLayout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: requireAuth(),
  component: AppLayout,
})
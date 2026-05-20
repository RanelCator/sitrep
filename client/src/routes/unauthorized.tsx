import { UnauthorizedPage } from '@/shared/components/errors/unauthorized'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/unauthorized')({
  component: UnauthorizedPage,
})

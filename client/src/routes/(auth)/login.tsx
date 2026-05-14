import LoginPageWhole from '@/features/auth/pages/log-whole'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-screen w-full bg-background">
      <LoginPageWhole />
    </div>
  )
}

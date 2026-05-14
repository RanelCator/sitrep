// src/routes/_authenticated/other-delegation/index.tsx
import { createFileRoute } from "@tanstack/react-router"

import { OtherDelegationPage } from "@/features/other-delegation/pages/OtherDelegationPage"

export const Route = createFileRoute("/_authenticated/other-delegation/")({
  component: OtherDelegationPage,
})
// src/routes/_authenticated/current-situation/index.tsx
import { createFileRoute } from "@tanstack/react-router"

import { CurrentSituationPage } from "@/features/current-situation/pages/CurrentSituationListPage"

export const Route = createFileRoute("/_authenticated/current-situation/")({
  component: CurrentSituationPage,
})
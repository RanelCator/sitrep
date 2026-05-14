// src/routes/_authenticated/reported-incidents/index.tsx
import { createFileRoute } from "@tanstack/react-router"

import { ReportedIncidentsPage } from "@/features/reported-incidents/pages/ReportedIncidentsPage"

export const Route = createFileRoute(
  "/_authenticated/reported-incidents/",
)({
  component: ReportedIncidentsPage,
})
// src/routes/_authenticated/reports/$id/view.tsx
import { createFileRoute } from "@tanstack/react-router"

import { DailySitRepPrintPage } from "@/features/reports/pages/DailySitRepPrintPage"

export const Route = createFileRoute(
  "/_authenticated/reports/$id/view",
)({
  component: DailySitRepPrintPage,
})
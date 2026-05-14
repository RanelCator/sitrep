// src/routes/_authenticated/reports/$date.tsx

import { createFileRoute } from "@tanstack/react-router"

import { DailyReportViewPage } from "@/features/reports/pages/DailyReportViewPage"

export const Route = createFileRoute(
  "/_authenticated/reports/$date",
)({
  component: DailyReportViewPage,
})
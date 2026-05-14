// src/features/reports/pages/DailyReportViewPage.tsx

import { useParams } from "@tanstack/react-router"

export function DailyReportViewPage() {
  const { date } = useParams({
    from: "/_authenticated/reports/$date",
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Daily SitRep Report
      </h1>

      <p>{date}</p>
    </div>
  )
}
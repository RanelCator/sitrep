// src/features/reports/tables/reports.columns.tsx

import type { ColumnDef } from "@tanstack/react-table"

import {
  Eye,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"

import type { GeneratedReport } from "@/features/reports/types/reports.types"

interface ReportsColumnsProps {
  onView: (
    item: GeneratedReport,
  ) => void
}

function formatDate(value?: string) {
  if (!value) return "—"

  return new Date(value).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  )
}

export function getReportsColumns({
  onView,
}: ReportsColumnsProps): ColumnDef<GeneratedReport>[] {
  return [
    {
      accessorKey: "entryDate",
      header: "Report Date",
      cell: ({ row }) =>
        formatDate(
          row.original.entryDate,
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Generated At",
      cell: ({ row }) =>
        new Date(
          row.original.createdAt,
        ).toLocaleString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() =>
              onView(row.original)
            }
          >
            <Eye className="size-4" />
          </Button>

          {/* <Button
            size="icon"
            variant="outline"
          >
            <FileText className="size-4" />
          </Button> */}
        </div>
      ),
    },
  ]
}
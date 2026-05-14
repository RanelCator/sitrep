// src/features/reported-incidents/tables/reported-incidents.columns.tsx
import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/shared/components/ui/button"

import type { ReportedIncident } from "@/features/reported-incidents/types/reported-incidents.types"

interface ReportedIncidentsColumnsProps {
  onEdit: (item: ReportedIncident) => void
  onDelete: (item: ReportedIncident) => void
}

function Preview({ text }: { text?: string }) {
  if (!text) return "—"

  return (
    <div className="line-clamp-3 max-w-[260px] text-sm">
      {text}
    </div>
  )
}

export function getReportedIncidentsColumns({
  onEdit,
  onDelete,
}: ReportedIncidentsColumnsProps): ColumnDef<ReportedIncident>[] {
  return [
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "Date",
      header: "Date",
      cell: ({ row }) => {
        const value = row.original.Date

        if (!value) return "—"

        return new Date(value).toLocaleDateString()
      },
    },
    {
      accessorKey: "Time",
      header: "Time",
    },
    {
      accessorKey: "venue_location",
      header: "Venue / Location",
    },
    {
      accessorKey: "Incident",
      header: "Incident",
      cell: ({ row }) => (
        <Preview text={row.original.Incident} />
      ),
    },
    {
      accessorKey: "persons_involved",
      header: "Persons Involved",
      cell: ({ row }) => (
        <Preview text={row.original.persons_involved} />
      ),
    },
    {
      accessorKey: "initial_action_taken",
      header: "Initial Action Taken",
      cell: ({ row }) => (
        <Preview text={row.original.initial_action_taken} />
      ),
    },
    {
      accessorKey: "current_status",
      header: "Current Status",
      cell: ({ row }) => (
        <Preview text={row.original.current_status} />
      ),
    },
    {
      accessorKey: "Remarks",
      header: "Remarks",
      cell: ({ row }) => (
        <Preview text={row.original.Remarks} />
      ),
    },
    
  ]
}
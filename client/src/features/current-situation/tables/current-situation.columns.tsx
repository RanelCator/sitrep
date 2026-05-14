// src/features/current-situation/tables/current-situation.columns.tsx
import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/shared/components/ui/button"

import type { CurrentSituation } from "@/features/current-situation/types/current-situation.types"

interface CurrentSituationColumnsProps {
  onEdit: (item: CurrentSituation) => void
  onDelete: (item: CurrentSituation) => void
}

function HtmlPreview({ html }: { html?: string }) {
  if (!html) return <span className="text-muted-foreground">—</span>

  return (
    <div
      className="line-clamp-3 max-w-[280px] text-sm text-slate-700 [&_*]:m-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function formatDate(value?: string) {
  if (!value) return "—"

  return new Date(value).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  )
}

export function getCurrentSituationColumns({
  onEdit,
  onDelete,
}: CurrentSituationColumnsProps): ColumnDef<CurrentSituation>[] {
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
      accessorKey: "DateTimeEntered",
      header: "Date",
      cell: ({ row }) =>
        formatDate(
          row.original.DateTimeEntered,
        ),
    },
    {
      accessorKey: "Committee",
      header: "Committee",
    },
    {
      accessorKey: "area_concern",
      header: "Area / Concern",
    },
    {
      accessorKey: "cuurent_situation",
      header: "Current Situation",
      cell: ({ row }) => (
        <HtmlPreview html={row.original.cuurent_situation} />
      ),
    },
    {
      accessorKey: "issues_concerns",
      header: "Issues / Concerns",
      cell: ({ row }) => (
        <HtmlPreview html={row.original.issues_concerns} />
      ),
    },
    {
      accessorKey: "actions_undertaken",
      header: "Actions Undertaken",
      cell: ({ row }) => (
        <HtmlPreview html={row.original.actions_undertaken} />
      ),
    },
    {
      accessorKey: "recommendations",
      header: "Recommendations",
      cell: ({ row }) => (
        <HtmlPreview html={row.original.recommendations} />
      ),
    },
    {
      accessorKey: "AddedBy.name",
      header: "Added By",
      cell: ({ row }) => row.original.AddedBy?.name ?? "—",
    },
    
  ]
}
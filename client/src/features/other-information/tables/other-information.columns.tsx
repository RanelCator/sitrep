// src/features/other-information/tables/other-information.columns.tsx
import type { ColumnDef } from "@tanstack/react-table"

import {
  Pencil,
  Trash2,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"

import type { OtherInformation } from "@/features/other-information/types/other-information.types"

interface OtherInformationColumnsProps {
  onEdit: (
    item: OtherInformation,
  ) => void

  onDelete: (
    item: OtherInformation,
  ) => void
}

function HtmlPreview({
  html,
}: {
  html?: string
}) {
  if (!html) {
    return (
      <span className="text-muted-foreground">
        —
      </span>
    )
  }

  return (
    <div
      className="line-clamp-4 max-w-[600px] text-sm text-slate-700 [&_*]:m-0"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}

export function getOtherInformationColumns({
  onEdit,
  onDelete,
}: OtherInformationColumnsProps): ColumnDef<OtherInformation>[] {
  return [
    {
      id: "actions",

      header: "Actions",

      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() =>
              onEdit(row.original)
            }
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="destructive"
            onClick={() =>
              onDelete(row.original)
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "description",

      header: "Description",

      cell: ({ row }) => (
        <HtmlPreview
          html={
            row.original.description
          }
        />
      ),
    },

    {
      accessorKey: "AddedBy.name",

      header: "Added By",

      cell: ({ row }) =>
        row.original.AddedBy?.name ??
        "—",
    },

    {
      accessorKey: "createdAt",

      header: "Created",

      cell: ({ row }) =>
        new Date(
          row.original.createdAt,
        ).toLocaleString(),
    },

    
  ]
}
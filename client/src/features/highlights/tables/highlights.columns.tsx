import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/shared/components/ui/button"

import type { Highlight } from "@/features/highlights/types/highlights.types"

interface HighlightsColumnsProps {
  onEdit: (highlight: Highlight) => void
  onDelete: (highlight: Highlight) => void
}

export function getHighlightsColumns({
  onEdit,
  onDelete,
}: HighlightsColumnsProps): ColumnDef<Highlight>[] {
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
  cell: ({ row }) => {
    return new Date(
      row.original.DateTimeEntered,
    ).toLocaleDateString()
  },
},

    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: row.original.description,
          }}
        />
      ),
    },

    {
      accessorKey: "AddedBy.name",
      header: "Added By",
      cell: ({ row }) => {
        return row.original.AddedBy?.name
      },
    },

  ]
}
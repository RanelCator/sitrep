// src/features/billeting-quarters/tables/billeting-quarters.columns.tsx

import type { ColumnDef } from "@tanstack/react-table"

import {
  Bus,
  ClipboardList,
  Pencil,
  Trash2,
} from "lucide-react"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"

import type { BilletingQuarter } from "@/features/billeting-quarters/types/billeting-quarters.types"

interface BilletingQuartersColumnsProps {
  onEdit: (item: BilletingQuarter) => void
  onDelete: (item: BilletingQuarter) => void
  onToggleStatus: (
    item: BilletingQuarter,
  ) => void

  onArrival: (
    item: BilletingQuarter,
  ) => void

  onDeparture: (
    item: BilletingQuarter,
  ) => void

  isToggling?: boolean
}

function getPreparednessBadge(
  rating: number,
) {
  if (rating >= 95) {
    return "bg-[#1E8E3E] text-white hover:bg-[#1E8E3E]"
  }

  if (rating >= 85) {
    return "bg-[#9ACD32] text-black hover:bg-[#9ACD32]"
  }

  return "bg-[#F4A000] text-black hover:bg-[#F4A000]"
}

export function getBilletingQuartersColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  onArrival,
  onDeparture,
  isToggling,
}: BilletingQuartersColumnsProps): ColumnDef<BilletingQuarter>[] {
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
              onArrival(row.original)
            }
            title="Arrival"
          >
            <ClipboardList className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() =>
              onDeparture(row.original)
            }
            title="Departure"
          >
            <Bus className="size-4" />
          </Button>

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
      accessorKey: "Billeting_Quarters",

      header: "Billeting Quarter",
    },

    {
      accessorKey: "Delegation",

      header: "Delegation",
    },

    {
      accessorKey: "Preparedness_Rating",

      header: "Preparedness Rating",

      cell: ({ row }) => {
        const rating =
          row.original.Preparedness_Rating

        return (
          <Badge
            className={getPreparednessBadge(
              rating,
            )}
          >
            {rating}%
          </Badge>
        )
      },
    },

    {
      accessorKey: "expected_delegates",

      header: "Expected Delegates",

      cell: ({ row }) =>
        row.original.expected_delegates.toLocaleString(),
    },

    {
      accessorKey: "isActive",

      header: "Active",

      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          disabled={isToggling}
          onCheckedChange={() =>
            onToggleStatus(row.original)
          }
        />
      ),
    },
  ]
}
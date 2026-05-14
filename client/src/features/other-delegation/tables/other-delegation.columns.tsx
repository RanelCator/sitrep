// src/features/other-delegation/tables/other-delegation.columns.tsx
import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"

import type { OtherDelegation } from "@/features/other-delegation/types/other-delegation.types"

interface OtherDelegationColumnsProps {
  isToggling?: boolean
  onEdit: (item: OtherDelegation) => void
  onDelete: (item: OtherDelegation) => void
  onToggleStatus: (item: OtherDelegation) => void
}

function getArrivalRate(expected: number, arrived: number) {
  if (!expected) return "0.00%"

  return `${((arrived / expected) * 100).toFixed(2)}%`
}

export function getOtherDelegationColumns({
  isToggling,
  onEdit,
  onDelete,
  onToggleStatus,
}: OtherDelegationColumnsProps): ColumnDef<OtherDelegation>[] {
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
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "expected_delegates",
      header: "Expected Delegates",
      cell: ({ row }) => row.original.expected_delegates.toLocaleString(),
    },
    {
      accessorKey: "arrived",
      header: "Arrived",
      cell: ({ row }) => row.original.arrived.toLocaleString(),
    },
    {
      id: "arrival_rate",
      header: "Arrival Rate",
      cell: ({ row }) =>
        getArrivalRate(row.original.expected_delegates, row.original.arrived),
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          disabled={isToggling}
          onCheckedChange={() => onToggleStatus(row.original)}
        />
      ),
    },
    
  ]
}
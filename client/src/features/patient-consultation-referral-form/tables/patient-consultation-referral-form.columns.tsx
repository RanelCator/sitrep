// src/features/patient-consultation-referral-form/tables/patient-consultation-referral-form.columns.tsx

import type { ColumnDef } from "@tanstack/react-table"

import {
  Pencil,
  Printer,
  Trash2,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"

import type {
  PatientConsultationReferralFormtype,
} from "@/features/patient-consultation-referral-form/types/patient-consultation-referral-form.types"

interface GetPatientConsultationReferralFormColumnsProps {
  onEdit: (
    item: PatientConsultationReferralFormtype,
  ) => void

  onDelete: (
    item: PatientConsultationReferralFormtype,
  ) => void

  onPrint: (
    item: PatientConsultationReferralFormtype,
  ) => void
}

export function getPatientConsultationReferralFormColumns({
  onEdit,
  onDelete,
  onPrint,
}: GetPatientConsultationReferralFormColumnsProps): ColumnDef<PatientConsultationReferralFormtype>[] {
  return [
    {
      id: "actions",

      header: "Actions",

      cell: ({ row }) => {
        const item = row.original

        return (
          <div className="flex justify-start gap-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                onPrint(item)
              }
            >
              <Printer className="size-4" />
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                onEdit(item)
              }
            >
              <Pencil className="size-4" />
            </Button>

            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() =>
                onDelete(item)
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )
      },
    },

    {
      accessorKey: "formDate",

      header: "Date",

      cell: ({ row }) =>
        row.original.formDate
          ? new Date(
              row.original.formDate,
            ).toLocaleDateString()
          : "-",
    },

    {
      accessorKey: "patientName",

      header: "Patient Name",
    },

    {
      accessorKey: "delegationType",

      header: "Delegation",
    },

    {
      accessorKey: "region",

      header: "Region",

      cell: ({ row }) =>
        row.original.region || "-",
    },

    {
      accessorKey: "division",

      header: "Division",

      cell: ({ row }) =>
        row.original.division || "-",
    },

    {
      accessorKey: "sportsEvent",

      header: "Sports Event",

      cell: ({ row }) =>
        row.original.sportsEvent || "-",
    },
  ]
}
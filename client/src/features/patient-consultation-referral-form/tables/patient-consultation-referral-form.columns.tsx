import type { ColumnDef } from "@tanstack/react-table"

import {
  Check,
  Eye,
  Pencil,
  Printer,
  RotateCcw,
  Trash2,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"

import type {
  PatientConsultationReferralFormtype,
} from "@/features/patient-consultation-referral-form/types/patient-consultation-referral-form.types"

interface GetPatientConsultationReferralFormColumnsProps {
  onView: (item: PatientConsultationReferralFormtype) => void
  onEdit: (item: PatientConsultationReferralFormtype) => void
  onDelete: (item: PatientConsultationReferralFormtype) => void
  onPrint: (item: PatientConsultationReferralFormtype) => void
  onTagEncoded: (item: PatientConsultationReferralFormtype) => void
}

export function getPatientConsultationReferralFormColumns({
  onView,
  onEdit,
  onDelete,
  onPrint,
  onTagEncoded,
}: GetPatientConsultationReferralFormColumnsProps): ColumnDef<PatientConsultationReferralFormtype>[] {
  return [
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original
        const isEncoded = Boolean(item.isEncoded)

        return (
          <div className="flex justify-start gap-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onView(item)}
            >
              <Eye className="size-4" />
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onPrint(item)}
            >
              <Printer className="size-4" />
            </Button>

            <Button
              type="button"
              size="sm"
              variant={isEncoded ? "outline" : "default"}
              className={
                isEncoded
                  ? "text-amber-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }
              onClick={() => onTagEncoded(item)}
            >
              {isEncoded ? (
                <RotateCcw className="size-4" />
              ) : (
                <Check className="size-4" />
              )}
            </Button>

            {!isEncoded && (
  <>
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() => onEdit(item)}
    >
      <Pencil className="size-4" />
    </Button>

    <Button
      type="button"
      size="sm"
      variant="destructive"
      onClick={() => onDelete(item)}
    >
      <Trash2 className="size-4" />
    </Button>
  </>
)}
           
          </div>
        )
      },
    },

    {
      accessorKey: "formDate",
      header: "Date",
      cell: ({ row }) =>
        row.original.formDate
          ? new Date(row.original.formDate).toLocaleDateString()
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
      cell: ({ row }) => row.original.region || "-",
    },

    {
      accessorKey: "division",
      header: "Division",
      cell: ({ row }) => row.original.division || "-",
    },

    {
      accessorKey: "sportsEvent",
      header: "Sports Event",
      cell: ({ row }) => row.original.sportsEvent || "-",
    },

    {
      accessorKey: "isEncoded",
      header: "Status",
      cell: ({ row }) =>
        row.original.isEncoded ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Encoded
          </span>
        ) : (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Pending
          </span>
        ),
    },
  ]
}
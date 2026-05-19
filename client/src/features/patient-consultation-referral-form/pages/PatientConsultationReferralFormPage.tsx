// src/features/patient-consultation-referral-form/pages/PatientConsultationReferralFormPage.tsx

import { useMemo, useState } from "react"
import type { PaginationState, SortingState } from "@tanstack/react-table"
import { Plus } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { FormDialog } from "@/shared/components/dialog/FormDialog"
import { SearchBar } from "@/shared/components/table/SearchBar"
import { ServerTable } from "@/shared/components/table/ServerTable"
import {
  alertError,
  alertSuccess,
  confirmDanger,
  showAlertWithDialogHidden,
} from "@/shared/lib/alert"

import { PatientConsultationReferralForm } from "@/features/patient-consultation-referral-form/components/PatientConsultationReferralForm"
import { usePatientConsultationReferralFormQuery } from "@/features/patient-consultation-referral-form/hooks/usePatientConsultationReferralFormQuery"
import {
  useCreatePatientConsultationReferralFormMutation,
  useDeletePatientConsultationReferralFormMutation,
  useUpdatePatientConsultationReferralFormMutation,
} from "@/features/patient-consultation-referral-form/hooks/usePatientConsultationReferralFormMutation"
import { getPatientConsultationReferralFormColumns } from "@/features/patient-consultation-referral-form/tables/patient-consultation-referral-form.columns"

import type {
  CreatePatientConsultationReferralFormPayload,
  PatientConsultationReferralFormtype,
} from "@/features/patient-consultation-referral-form/types/patient-consultation-referral-form.types"
import { ScanHeader } from "@/shared/components/layout/ScanHeader"

export function PatientConsultationReferralFormPage() {
  const [search, setSearch] = useState("")
  const [openForm, setOpenForm] = useState(false)

  const [selectedItem, setSelectedItem] =
    useState<PatientConsultationReferralFormtype | null>(null)

  const [draftPayload, setDraftPayload] =
    useState<CreatePatientConsultationReferralFormPayload | null>(null)

  const [pagination, setPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

  const [sorting, setSorting] =
    useState<SortingState>([])

  const query = usePatientConsultationReferralFormQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  })

  const createMutation =
    useCreatePatientConsultationReferralFormMutation()

  const updateMutation =
    useUpdatePatientConsultationReferralFormMutation()

  const deleteMutation =
    useDeletePatientConsultationReferralFormMutation()

  const items = query.data?.data ?? []
  const total = query.data?.meta?.total ?? 0

const columns = useMemo(
  () =>
    getPatientConsultationReferralFormColumns({
      onEdit: (item) => {
        setDraftPayload(null)
        setSelectedItem(item)
        setOpenForm(true)
      },

      onPrint: (item) => {
        window.open(
          `/patient-consultation-referral-form/${item._id}/print`,
          "_blank",
        )
      },

      onDelete: async (item) => {
        const confirmed = await confirmDanger({
          title: "Delete Patient Form?",
          text: "This action cannot be undone.",
        })

        if (!confirmed) return

        try {
          await deleteMutation.mutateAsync(item._id)

          await alertSuccess({
            title: "Deleted Successfully",
            timer: 1200,
            showConfirmButton: false,
          })
        } catch {
          await alertError({
            title: "Delete Failed",
            text: "Unable to delete patient form.",
          })
        }
      },
    }),
  [deleteMutation],
)

  const handleAdd = () => {
    setSelectedItem(null)
    setDraftPayload(null)
    setOpenForm(true)
  }

  const handleSubmit = async (
    payload: CreatePatientConsultationReferralFormPayload,
  ) => {
    setDraftPayload(payload)

    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({
          id: selectedItem._id,
          payload,
        })

        await alertSuccess({
          title: "Updated Successfully",
          timer: 1200,
          showConfirmButton: false,
        })
      } else {
        await createMutation.mutateAsync(payload)

        await alertSuccess({
          title: "Created Successfully",
          timer: 1200,
          showConfirmButton: false,
        })
      }

      setOpenForm(false)
      setSelectedItem(null)
      setDraftPayload(null)
    } catch {
      await showAlertWithDialogHidden(
        () => setOpenForm(false),
        () => setOpenForm(true),
        () =>
          alertError({
            title: "Save Failed",
            text: "Unable to save patient consultation/referral form.",
          }),
      )
    }
  }

  const handleOpenChange = (open: boolean) => {
    setOpenForm(open)

    if (!open) {
      setSelectedItem(null)
      setDraftPayload(null)
    }
  }

  const formInitialData =
    draftPayload
      ? ({
          ...selectedItem,
          ...draftPayload,
          _id: selectedItem?._id ?? "",
          isActive: selectedItem?.isActive ?? true,
          createdAt: selectedItem?.createdAt ?? "",
          updatedAt: selectedItem?.updatedAt ?? "",
        } as PatientConsultationReferralFormtype)
      : selectedItem

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <ScanHeader title="Patient Consultation / Referral Form" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPagination((prev) => ({
              ...prev,
              pageIndex: 0,
            }))
          }}
          placeholder="Search patient form..."
        />

        <Button type="button" onClick={handleAdd}>
          <Plus className="mr-2 size-4" />
          Add Patient Form
        </Button>
      </div>

      <ServerTable
        data={items}
        columns={columns}
        total={total}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={query.isLoading}
      />

      <FormDialog
        open={openForm}
        onOpenChange={handleOpenChange}
        title={selectedItem ? "Edit Patient Form" : "Add Patient Form"}
        description="Encode patient consultation and referral details."
      >
        <PatientConsultationReferralForm
          key={selectedItem?._id ?? "create"}
          initialData={formInitialData}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </FormDialog>
    </div>
  )
}
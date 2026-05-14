// src/features/reported-incidents/pages/ReportedIncidentsPage.tsx
import { useMemo, useState } from "react"
import type {
  PaginationState,
  SortingState,
} from "@tanstack/react-table"
import { Plus } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { FormDialog } from "@/shared/components/dialog/FormDialog"
import { PageHeader } from "@/shared/components/layout/PageHeader"
import { SearchBar } from "@/shared/components/table/SearchBar"
import { ServerTable } from "@/shared/components/table/ServerTable"

import {
  alertError,
  alertSuccess,
  confirmDanger,
  showAlertWithDialogHidden,
} from "@/shared/lib/alert"

import { ReportedIncidentForm } from "@/features/reported-incidents/components/ReportedIncidentForm"

import { useReportedIncidentsQuery } from "@/features/reported-incidents/hooks/useReportedIncidentsQuery"

import {
  useCreateReportedIncidentMutation,
  useDeleteReportedIncidentMutation,
  useUpdateReportedIncidentMutation,
} from "@/features/reported-incidents/hooks/useReportedIncidentsMutation"

import { getReportedIncidentsColumns } from "@/features/reported-incidents/tables/reported-incidents.columns"

import type {
  CreateReportedIncidentPayload,
  ReportedIncident,
} from "@/features/reported-incidents/types/reported-incidents.types"

export function ReportedIncidentsPage() {
  const [search, setSearch] = useState("")

  const [openForm, setOpenForm] = useState(false)

  const [selectedItem, setSelectedItem] =
    useState<ReportedIncident | null>(null)

  const [pagination, setPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

  const [sorting, setSorting] =
    useState<SortingState>([])

  const incidentsQuery = useReportedIncidentsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  })

  const createMutation =
    useCreateReportedIncidentMutation()

  const updateMutation =
    useUpdateReportedIncidentMutation()

  const deleteMutation =
    useDeleteReportedIncidentMutation()

  const items = incidentsQuery.data?.data ?? []

  const total =
    incidentsQuery.data?.meta?.total ?? 0

  const columns = useMemo(
    () =>
      getReportedIncidentsColumns({
        onEdit: (item) => {
          setSelectedItem(item)
          setOpenForm(true)
        },

        onDelete: async (item) => {
          const confirmed = await confirmDanger({
            title: "Delete Incident?",
            text: "This action cannot be undone.",
          })

          if (!confirmed) return

          try {
            await deleteMutation.mutateAsync(
              item._id,
            )

            await alertSuccess({
              title: "Deleted Successfully",
              timer: 1200,
              showConfirmButton: false,
            })
          } catch {
            await alertError({
              title: "Delete Failed",
              text: "Unable to delete incident.",
            })
          }
        },
      }),
    [deleteMutation],
  )

  const handleAdd = () => {
    setSelectedItem(null)
    setOpenForm(true)
  }

  const handleSubmit = async (
    payload: CreateReportedIncidentPayload,
  ) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({
          id: selectedItem._id,
          payload,
        })
      } else {
        await createMutation.mutateAsync(payload)
      }

      setOpenForm(false)
      setSelectedItem(null)

      await alertSuccess({
        title: "Saved Successfully",
        timer: 1200,
        showConfirmButton: false,
      })
    } catch {
      await showAlertWithDialogHidden(
        () => setOpenForm(false),
        () => setOpenForm(true),
        () =>
          alertError({
            title: "Save Failed",
            text: "Unable to save incident.",
          }),
      )
    }
  }

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader title="Reported Incidents" />

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
          placeholder="Search reported incidents..."
        />

        <Button onClick={handleAdd}>
          <Plus className="mr-2 size-4" />
          Add Incident
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
        isLoading={incidentsQuery.isLoading}
      />

      <FormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        title={
          selectedItem
            ? "Edit Incident"
            : "Add Incident"
        }
        description="Encode incident reports and current status."
      >
        <ReportedIncidentForm
          key={selectedItem?._id ?? "create"}
          initialData={selectedItem}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </FormDialog>
    </div>
  )
}
// src/features/billeting-quarters/pages/BilletingQuartersPage.tsx
import { useMemo, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import type { PaginationState, SortingState } from "@tanstack/react-table"
import { Plus, UsersRound } from "lucide-react"

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

import { BilletingQuarterForm } from "@/features/billeting-quarters/components/BilletingQuarterForm"
import { ArrivalForm } from "@/features/billeting-quarters/components/ArrivalForm"

import {
  useCreateBilletingQuarterMutation,
  useDeleteBilletingQuarterMutation,
  useSetBilletingQuarterStatusMutation,
  useUpdateBilletingQuarterMutation,
} from "@/features/billeting-quarters/hooks/useBilletingQuartersMutation"
import { useUpdateArrivalMutation } from "@/features/billeting-quarters/hooks/useArrivalMutation"
import { useBilletingQuartersQuery } from "@/features/billeting-quarters/hooks/useBilletingQuartersQuery"

import { getBilletingQuartersColumns } from "@/features/billeting-quarters/tables/billeting-quarters.columns"

import type {
  BilletingQuarter,
  CreateBilletingQuarterPayload,
} from "@/features/billeting-quarters/types/billeting-quarters.types"
import type { UpdateArrivalPayload } from "@/features/billeting-quarters/types/arrival.types"

export function BilletingQuartersPage() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [openForm, setOpenForm] = useState(false)
  const [selectedItem, setSelectedItem] =
    useState<BilletingQuarter | null>(null)

  const [openArrivalForm, setOpenArrivalForm] = useState(false)
  const [selectedArrivalItem, setSelectedArrivalItem] =
    useState<BilletingQuarter | null>(null)

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const [sorting, setSorting] = useState<SortingState>([])

  const query = useBilletingQuartersQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  })

  const createMutation = useCreateBilletingQuarterMutation()
  const updateMutation = useUpdateBilletingQuarterMutation()
  const deleteMutation = useDeleteBilletingQuarterMutation()
  const statusMutation = useSetBilletingQuarterStatusMutation()
  const arrivalMutation = useUpdateArrivalMutation()

  const items = query.data?.data ?? []
  const total = query.data?.meta?.total ?? 0

  const columns = useMemo(
    () =>
      getBilletingQuartersColumns({
        isToggling: statusMutation.isPending,

        onEdit: (item) => {
          setSelectedItem(item)
          setOpenForm(true)
        },

        onArrival: (item) => {
          setSelectedArrivalItem(item)
          setOpenArrivalForm(true)
        },

        onDelete: async (item) => {
          const confirmed = await confirmDanger({
            title: "Delete Billeting Quarter?",
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
              text: "Unable to delete billeting quarter.",
            })
          }
        },

        onToggleStatus: async (item) => {
          try {
            await statusMutation.mutateAsync({
              id: item._id,
              isActive: !item.isActive,
            })
          } catch {
            await alertError({
              title: "Update Failed",
              text: "Unable to update status.",
            })
          }
        },
      }),
    [deleteMutation, statusMutation],
  )

  const handleAdd = () => {
    setSelectedItem(null)
    setOpenForm(true)
  }

  const handleSubmit = async (payload: CreateBilletingQuarterPayload) => {
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
    } catch {
      await showAlertWithDialogHidden(
        () => setOpenForm(false),
        () => setOpenForm(true),
        () =>
          alertError({
            title: "Save Failed",
            text: "Unable to save billeting quarter.",
          }),
      )
    }
  }

  const handleArrivalSubmit = async (payload: UpdateArrivalPayload) => {
    if (!selectedArrivalItem) return

    try {
      await arrivalMutation.mutateAsync({
        id: selectedArrivalItem._id,
        payload,
      })

      await alertSuccess({
        title: "Arrival Updated",
        timer: 1200,
        showConfirmButton: false,
      })

      setOpenArrivalForm(false)
      setSelectedArrivalItem(null)
    } catch {
      await showAlertWithDialogHidden(
        () => setOpenArrivalForm(false),
        () => setOpenArrivalForm(true),
        () =>
          alertError({
            title: "Save Failed",
            text: "Unable to save arrival data.",
          }),
      )
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader title="Billeting Quarters" />

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
          placeholder="Search billeting quarters..."
        />

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/other-delegation" })}
          >
            <UsersRound className="mr-2 size-4" />
            Add Other Delegation
          </Button>

          <Button type="button" onClick={handleAdd}>
            <Plus className="mr-2 size-4" />
            Add Billeting Quarter
          </Button>
        </div>
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
        onOpenChange={setOpenForm}
        title={selectedItem ? "Edit Billeting Quarter" : "Add Billeting Quarter"}
        description="Encode billeting quarter assignment and preparedness details."
      >
        <BilletingQuarterForm
          key={selectedItem?._id ?? "create"}
          initialData={selectedItem}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </FormDialog>

      <FormDialog
        open={openArrivalForm}
        onOpenChange={setOpenArrivalForm}
        title="Update Delegation Arrival"
        description="Encode arrival count for this billeting quarter."
      >
        {selectedArrivalItem && (
          <ArrivalForm
            key={selectedArrivalItem._id}
            billetingQuarter={selectedArrivalItem}
            isSubmitting={arrivalMutation.isPending}
            onSubmit={handleArrivalSubmit}
          />
        )}
      </FormDialog>
    </div>
  )
}
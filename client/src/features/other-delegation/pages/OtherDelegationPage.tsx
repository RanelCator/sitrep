// src/features/other-delegation/pages/OtherDelegationPage.tsx
import { useMemo, useState } from "react"
import type { PaginationState, SortingState } from "@tanstack/react-table"
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

import { OtherDelegationForm } from "@/features/other-delegation/components/OtherDelegationForm"
import { useOtherDelegationQuery } from "@/features/other-delegation/hooks/useOtherDelegationQuery"
import {
  useCreateOtherDelegationMutation,
  useDeleteOtherDelegationMutation,
  useSetOtherDelegationStatusMutation,
  useUpdateOtherDelegationMutation,
} from "@/features/other-delegation/hooks/useOtherDelegationMutation"
import { getOtherDelegationColumns } from "@/features/other-delegation/tables/other-delegation.columns"

import type {
  CreateOtherDelegationPayload,
  OtherDelegation,
} from "@/features/other-delegation/types/other-delegation.types"

export function OtherDelegationPage() {
  const [search, setSearch] = useState("")
  const [openForm, setOpenForm] = useState(false)
  const [selectedItem, setSelectedItem] =
    useState<OtherDelegation | null>(null)

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [sorting, setSorting] = useState<SortingState>([])

  const query = useOtherDelegationQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  })

  const createMutation = useCreateOtherDelegationMutation()
  const updateMutation = useUpdateOtherDelegationMutation()
  const deleteMutation = useDeleteOtherDelegationMutation()
  const statusMutation = useSetOtherDelegationStatusMutation()

  const items = query.data?.data ?? []
  const total = query.data?.meta?.total ?? 0

  const columns = useMemo(
    () =>
      getOtherDelegationColumns({
        isToggling: statusMutation.isPending,

        onEdit: (item) => {
          setSelectedItem(item)
          setOpenForm(true)
        },

        onDelete: async (item) => {
          const confirmed = await confirmDanger({
            title: "Delete Other Delegation?",
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
              text: "Unable to delete other delegation.",
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

  const handleSubmit = async (payload: CreateOtherDelegationPayload) => {
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
            text: "Unable to save other delegation.",
          }),
      )
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader title="Other Delegation" />

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
          placeholder="Search other delegation..."
        />

        <Button type="button" onClick={handleAdd}>
          <Plus className="mr-2 size-4" />
          Add Other Delegation
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
        onOpenChange={setOpenForm}
        title={selectedItem ? "Edit Other Delegation" : "Add Other Delegation"}
        description="Encode other delegation expected and arrived counts."
      >
        <OtherDelegationForm
          key={selectedItem?._id ?? "create"}
          initialData={selectedItem}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </FormDialog>
    </div>
  )
}
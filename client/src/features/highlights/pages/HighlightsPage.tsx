// src/features/highlights/pages/HighlightsPage.tsx
import { useMemo, useState } from "react"
import type { PaginationState, SortingState } from "@tanstack/react-table"
import { Plus } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { FormDialog } from "@/shared/components/dialog/FormDialog"
import { PageHeader } from "@/shared/components/layout/PageHeader"
import { SearchBar } from "@/shared/components/table/SearchBar"
import { ServerTable } from "@/shared/components/table/ServerTable"
import { alertError, alertSuccess, confirmDanger } from "@/shared/lib/alert"

import { HighlightForm } from "@/features/highlights/components/HighlightForm"
import {
  useCreateHighlightMutation,
  useDeleteHighlightMutation,
  useUpdateHighlightMutation,
} from "@/features/highlights/hooks/useHighlightsMutation"
import { useHighlightsQuery } from "@/features/highlights/hooks/useHighlightsQuery"
import { getHighlightsColumns } from "@/features/highlights/tables/highlights.columns"
import type {
  CreateHighlightPayload,
  Highlight,
} from "@/features/highlights/types/highlights.types"

export function HighlightsPage() {
  const [search, setSearch] = useState("")
  const [openForm, setOpenForm] = useState(false)
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(
    null,
  )

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [sorting, setSorting] = useState<SortingState>([])

//   const activeSort = sorting[0]

  const highlightsQuery = useHighlightsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  })

  const createMutation = useCreateHighlightMutation()
  const updateMutation = useUpdateHighlightMutation()
  const deleteMutation = useDeleteHighlightMutation()

  const items = highlightsQuery.data?.data ?? []
  const total = highlightsQuery.data?.meta?.total ?? 0

  const columns = useMemo(
    () =>
      getHighlightsColumns({
        onEdit: (highlight) => {
          setSelectedHighlight(highlight)
          setOpenForm(true)
        },
        onDelete: async (highlight) => {
          const confirmed = await confirmDanger({
            title: "Delete Highlight?",
            text: "This action cannot be undone.",
          })

          if (!confirmed) return

          try {
            await deleteMutation.mutateAsync(highlight._id)

            await alertSuccess({
              title: "Deleted Successfully",
              timer: 1200,
              showConfirmButton: false,
            })
          } catch {
            await alertError({
              title: "Delete Failed",
              text: "Unable to delete highlight.",
            })
          }
        },
      }),
    [deleteMutation],
  )

  const handleAdd = () => {
    setSelectedHighlight(null)
    setOpenForm(true)
  }

  const handleSubmit = async (payload: CreateHighlightPayload) => {
    try {
      if (selectedHighlight) {
        await updateMutation.mutateAsync({
          id: selectedHighlight._id,
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
      setSelectedHighlight(null)
    } catch {
      await alertError({
        title: "Save Failed",
        text: "Unable to save highlight.",
      })
    }
  }

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader title="Highlights" />

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
          placeholder="Search highlights..."
        />

        <Button onClick={handleAdd}>
          <Plus className="mr-2 size-4" />
          Add Highlight
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
        isLoading={highlightsQuery.isLoading}
      />

      <FormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        title={selectedHighlight ? "Edit Highlight" : "Add Highlight"}
        description="Encode the daily highlight details."
      >
        <HighlightForm
          key={selectedHighlight?._id ?? "create"}
          initialData={selectedHighlight}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </FormDialog>
    </div>
  )
}
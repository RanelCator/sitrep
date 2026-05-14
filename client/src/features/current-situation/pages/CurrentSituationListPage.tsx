// src/features/current-situation/pages/CurrentSituationPage.tsx
import { useMemo, useState } from "react"
import type { PaginationState, SortingState } from "@tanstack/react-table"
import { ListPlus, Plus, Settings2 } from "lucide-react"

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

import { CurrentSituationForm } from "@/features/current-situation/components/CurrentSituationForm"
import { LookupManager } from "@/features/current-situation/components/LookupManager"
import {
  useAreaConcernsQuery,
  useCommitteesQuery,
  useCurrentSituationsQuery,
} from "@/features/current-situation/hooks/useCurrentSituationQuery"
import {
  useCreateCurrentSituationMutation,
  useDeleteCurrentSituationMutation,
  useUpdateCurrentSituationMutation,
} from "@/features/current-situation/hooks/useCurrentSituationMutation"
import { getCurrentSituationColumns } from "@/features/current-situation/tables/current-situation.columns"

import type {
  CreateCurrentSituationPayload,
  CurrentSituation,
} from "@/features/current-situation/types/current-situation.types"

export function CurrentSituationPage() {
  const [search, setSearch] = useState("")

  const [openForm, setOpenForm] = useState(false)
  const [openCommitteeManager, setOpenCommitteeManager] = useState(false)
  const [openAreaConcernManager, setOpenAreaConcernManager] = useState(false)

  const [selectedItem, setSelectedItem] =
    useState<CurrentSituation | null>(null)

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [sorting, setSorting] = useState<SortingState>([])

  const currentSituationsQuery = useCurrentSituationsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  })

  const committeesQuery = useCommitteesQuery({
    page: 1,
    limit: 1000,
  })

  const areaConcernsQuery = useAreaConcernsQuery({
    page: 1,
    limit: 1000,
  })

  const createMutation = useCreateCurrentSituationMutation()
  const updateMutation = useUpdateCurrentSituationMutation()
  const deleteMutation = useDeleteCurrentSituationMutation()

  const items = currentSituationsQuery.data?.data ?? []
  const total = currentSituationsQuery.data?.meta?.total ?? 0

  const committees = committeesQuery.data?.data ?? []
  const areaConcerns = areaConcernsQuery.data?.data ?? []

  const columns = useMemo(
    () =>
      getCurrentSituationColumns({
        onEdit: (item) => {
          setSelectedItem(item)
          setOpenForm(true)
        },
        onDelete: async (item) => {
          const confirmed = await confirmDanger({
            title: "Delete Current Situation?",
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
              text: "Unable to delete current situation.",
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
    payload: CreateCurrentSituationPayload,
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
            text: "Unable to save current situation.",
          }),
      )
    }
  }

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader title="Current Situation" />

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPagination((prev) => ({
              ...prev,
              pageIndex: 0,
            }))
          }}
          placeholder="Search current situation..."
        />

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenCommitteeManager(true)}
          >
            <Settings2 className="mr-2 size-4" />
            Manage Committees
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenAreaConcernManager(true)}
          >
            <ListPlus className="mr-2 size-4" />
            Manage Area Concern
          </Button>

          <Button type="button" onClick={handleAdd}>
            <Plus className="mr-2 size-4" />
            Add Current Situation
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
        isLoading={currentSituationsQuery.isLoading}
      />

      <FormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        title={
          selectedItem
            ? "Edit Current Situation"
            : "Add Current Situation"
        }
        description="Encode committee updates, concerns, actions, and recommendations."
      >
        <CurrentSituationForm
          key={selectedItem?._id ?? "create"}
          committees={committees}
          areaConcerns={areaConcerns}
          initialData={selectedItem}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </FormDialog>

      <FormDialog
        open={openCommitteeManager}
        onOpenChange={setOpenCommitteeManager}
        title="Manage Committees"
        description="Create, edit, or remove committee lookup values."
      >
        <LookupManager type="committee" />
      </FormDialog>

      <FormDialog
        open={openAreaConcernManager}
        onOpenChange={setOpenAreaConcernManager}
        title="Manage Area of Concern"
        description="Create, edit, or remove area of concern lookup values."
      >
        <LookupManager type="area-concern" />
      </FormDialog>
    </div>
  )
}
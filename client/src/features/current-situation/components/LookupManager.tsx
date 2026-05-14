// src/features/current-situation/components/LookupManager.tsx
import { useMemo, useState } from "react"
import type { PaginationState, SortingState } from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Plus, Trash2 } from "lucide-react"

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

import { CommitteeForm } from "./CommitteeForm"
import { AreaConcernForm } from "./AreaConcernForm"

import {
  useAreaConcernsQuery,
  useCommitteesQuery,
} from "@/features/current-situation/hooks/useCurrentSituationQuery"
import {
  useCreateAreaConcernMutation,
  useCreateCommitteeMutation,
  useDeleteAreaConcernMutation,
  useDeleteCommitteeMutation,
  useUpdateAreaConcernMutation,
  useUpdateCommitteeMutation,
} from "@/features/current-situation/hooks/useCurrentSituationMutation"

import type {
  AreaConcern,
  Committee,
  CreateAreaConcernPayload,
  CreateCommitteePayload,
} from "@/features/current-situation/types/current-situation.types"

interface LookupManagerProps {
  type: "committee" | "area-concern"
}

export function LookupManager({ type }: LookupManagerProps) {
  const isCommittee = type === "committee"

  const [search, setSearch] = useState("")
  const [openForm, setOpenForm] = useState(false)
  const [selectedCommittee, setSelectedCommittee] =
    useState<Committee | null>(null)
  const [selectedAreaConcern, setSelectedAreaConcern] =
    useState<AreaConcern | null>(null)

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [sorting, setSorting] = useState<SortingState>([])

  const committeesQuery = useCommitteesQuery({
    page: isCommittee ? pagination.pageIndex + 1 : 1,
    limit: isCommittee ? pagination.pageSize : 1000,
    search: isCommittee ? search : undefined,
  })

  const areaConcernsQuery = useAreaConcernsQuery({
    page: !isCommittee ? pagination.pageIndex + 1 : 1,
    limit: !isCommittee ? pagination.pageSize : 1000,
    search: !isCommittee ? search : undefined,
  })

  const createCommitteeMutation = useCreateCommitteeMutation()
  const updateCommitteeMutation = useUpdateCommitteeMutation()
  const deleteCommitteeMutation = useDeleteCommitteeMutation()

  const createAreaConcernMutation = useCreateAreaConcernMutation()
  const updateAreaConcernMutation = useUpdateAreaConcernMutation()
  const deleteAreaConcernMutation = useDeleteAreaConcernMutation()

  const committees = committeesQuery.data?.data ?? []
  const data = isCommittee
    ? committeesQuery.data?.data ?? []
    : areaConcernsQuery.data?.data ?? []

  const total = isCommittee
    ? committeesQuery.data?.meta?.total ?? 0
    : areaConcernsQuery.data?.meta?.total ?? 0

  const columns = useMemo(() => {
    if (isCommittee) {
      return [
        {
          accessorKey: "name",
          header: "Committee",
        },
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => {
            const item = row.original as Committee

            return (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setSelectedCommittee(item)
                    setOpenForm(true)
                  }}
                >
                  <Pencil className="size-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={async () => {
                    const confirmed = await confirmDanger({
                      title: "Delete Committee?",
                      text: "This will fail if area concerns still use it.",
                    })

                    if (!confirmed) return

                    try {
                      await deleteCommitteeMutation.mutateAsync(item._id)

                      await alertSuccess({
                        title: "Deleted Successfully",
                        timer: 1200,
                        showConfirmButton: false,
                      })
                    } catch {
                      await alertError({
                        title: "Delete Failed",
                        text: "Unable to delete committee.",
                      })
                    }
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )
          },
        },
      ] satisfies ColumnDef<Committee>[]
    }

    return [
      {
        accessorKey: "committeeName",
        header: "Committee",
      },
      {
        accessorKey: "name",
        header: "Area of Concern",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original as AreaConcern

          return (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  setSelectedAreaConcern(item)
                  setOpenForm(true)
                }}
              >
                <Pencil className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="destructive"
                onClick={async () => {
                  const confirmed = await confirmDanger({
                    title: "Delete Area Concern?",
                    text: "This action cannot be undone.",
                  })

                  if (!confirmed) return

                  try {
                    await deleteAreaConcernMutation.mutateAsync(item._id)

                    await alertSuccess({
                      title: "Deleted Successfully",
                      timer: 1200,
                      showConfirmButton: false,
                    })
                  } catch {
                    await alertError({
                      title: "Delete Failed",
                      text: "Unable to delete area concern.",
                    })
                  }
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )
        },
      },
    ] satisfies ColumnDef<AreaConcern>[]
  }, [
    isCommittee,
    deleteCommitteeMutation,
    deleteAreaConcernMutation,
  ])

  const handleAdd = () => {
    setSelectedCommittee(null)
    setSelectedAreaConcern(null)
    setOpenForm(true)
  }

  const handleCommitteeSubmit = async (
    payload: CreateCommitteePayload,
  ) => {
    try {
      if (selectedCommittee) {
        await updateCommitteeMutation.mutateAsync({
          id: selectedCommittee._id,
          payload,
        })
      } else {
        await createCommitteeMutation.mutateAsync(payload)
      }

      setOpenForm(false)

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
            text: "Unable to save committee.",
          }),
      )
    }
  }

  const handleAreaConcernSubmit = async (
    payload: CreateAreaConcernPayload,
  ) => {
    try {
      if (selectedAreaConcern) {
        await updateAreaConcernMutation.mutateAsync({
          id: selectedAreaConcern._id,
          payload,
        })
      } else {
        await createAreaConcernMutation.mutateAsync(payload)
      }

      setOpenForm(false)

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
            text: "Unable to save area concern.",
          }),
      )
    }
  }

  const isSubmitting =
    createCommitteeMutation.isPending ||
    updateCommitteeMutation.isPending ||
    createAreaConcernMutation.isPending ||
    updateAreaConcernMutation.isPending

  return (
    <div className="space-y-5">
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
          placeholder={
            isCommittee
              ? "Search committees..."
              : "Search area concerns..."
          }
        />

        <Button onClick={handleAdd}>
          <Plus className="mr-2 size-4" />
          {isCommittee ? "Add Committee" : "Add Area Concern"}
        </Button>
      </div>

      <ServerTable
        data={data}
        columns={columns as ColumnDef<any>[]}
        total={total}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={
          isCommittee
            ? committeesQuery.isLoading
            : areaConcernsQuery.isLoading
        }
      />

      <FormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        title={
          isCommittee
            ? selectedCommittee
              ? "Edit Committee"
              : "Add Committee"
            : selectedAreaConcern
              ? "Edit Area Concern"
              : "Add Area Concern"
        }
        description="Manage lookup values for current situation reports."
      >
        {isCommittee ? (
          <CommitteeForm
            key={selectedCommittee?._id ?? "create"}
            initialData={selectedCommittee}
            isSubmitting={isSubmitting}
            onSubmit={handleCommitteeSubmit}
          />
        ) : (
          <AreaConcernForm
            key={selectedAreaConcern?._id ?? "create"}
            committees={committees}
            initialData={selectedAreaConcern}
            isSubmitting={isSubmitting}
            onSubmit={handleAreaConcernSubmit}
          />
        )}
      </FormDialog>
    </div>
  )
}
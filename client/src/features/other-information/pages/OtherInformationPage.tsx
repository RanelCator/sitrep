// src/features/other-information/pages/OtherInformationPage.tsx
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

import { OtherInformationForm } from "@/features/other-information/components/OtherInformationForm"

import { useOtherInformationQuery } from "@/features/other-information/hooks/useOtherInformationQuery"

import {
  useCreateOtherInformationMutation,
  useDeleteOtherInformationMutation,
  useUpdateOtherInformationMutation,
} from "@/features/other-information/hooks/useOtherInformationMutation"

import { getOtherInformationColumns } from "@/features/other-information/tables/other-information.columns"

import type {
  CreateOtherInformationPayload,
  OtherInformation,
} from "@/features/other-information/types/other-information.types"

export function OtherInformationPage() {
  const [search, setSearch] =
    useState("")

  const [openForm, setOpenForm] =
    useState(false)

  const [selectedItem, setSelectedItem] =
    useState<OtherInformation | null>(
      null,
    )

  const [pagination, setPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

  const [sorting, setSorting] =
    useState<SortingState>([])

  const query =
    useOtherInformationQuery({
      page:
        pagination.pageIndex + 1,

      limit: pagination.pageSize,

      search,
    })

  const createMutation =
    useCreateOtherInformationMutation()

  const updateMutation =
    useUpdateOtherInformationMutation()

  const deleteMutation =
    useDeleteOtherInformationMutation()

  const items = query.data?.data ?? []

  const total =
    query.data?.meta?.total ?? 0

  const columns = useMemo(
    () =>
      getOtherInformationColumns({
        onEdit: (item) => {
          setSelectedItem(item)
          setOpenForm(true)
        },

        onDelete: async (item) => {
          const confirmed =
            await confirmDanger({
              title:
                "Delete Information?",
              text:
                "This action cannot be undone.",
            })

          if (!confirmed) return

          try {
            await deleteMutation.mutateAsync(
              item._id,
            )

            await alertSuccess({
              title:
                "Deleted Successfully",

              timer: 1200,

              showConfirmButton: false,
            })
          } catch {
            await alertError({
              title:
                "Delete Failed",

              text:
                "Unable to delete information.",
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
    payload: CreateOtherInformationPayload,
  ) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync(
          {
            id: selectedItem._id,
            payload,
          },
        )
      } else {
        await createMutation.mutateAsync(
          payload,
        )
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

            text:
              "Unable to save information.",
          }),
      )
    }
  }

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader title="Other Information" />

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
          placeholder="Search information..."
        />

        <Button onClick={handleAdd}>
          <Plus className="mr-2 size-4" />
          Add Information
        </Button>
      </div>

      <ServerTable
        data={items}
        columns={columns}
        total={total}
        pagination={pagination}
        onPaginationChange={
          setPagination
        }
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={query.isLoading}
      />

      <FormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        title={
          selectedItem
            ? "Edit Information"
            : "Add Information"
        }
        description="Encode additional situational information and updates."
      >
        <OtherInformationForm
          key={
            selectedItem?._id ??
            "create"
          }
          initialData={selectedItem}
          isSubmitting={
            isSubmitting
          }
          onSubmit={handleSubmit}
        />
      </FormDialog>
    </div>
  )
}
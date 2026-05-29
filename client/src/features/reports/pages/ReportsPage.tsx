// src/features/reports/pages/ReportsPage.tsx

import {
  useMemo,
  useState,
} from "react"

import type {
  PaginationState,
  SortingState,
} from "@tanstack/react-table"

import {
  Calendar,
  Clock,
  FilePlus2,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { PageHeader } from "@/shared/components/layout/PageHeader"
import { ServerTable } from "@/shared/components/table/ServerTable"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

import {
  alertError,
  alertSuccess,
} from "@/shared/lib/alert"

import { useReportsQuery } from "@/features/reports/hooks/useReportsQuery"
import { useGenerateDailyReportMutation } from "@/features/reports/hooks/useReportsMutation"
import { getReportsColumns } from "@/features/reports/tables/reports.columns"

type ReportCutoff =
  | "8am"
  | "5pm"
  | "--"
  | "current-day"

export function ReportsPage() {
  const [reportDate, setReportDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0],
    )

  const [reportCutoff, setReportCutoff] =
    useState<ReportCutoff>("5pm")

  const [pagination, setPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

  const [sorting, setSorting] =
    useState<SortingState>([])

  const reportsQuery = useReportsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })

  const generateMutation =
    useGenerateDailyReportMutation()

  const reports =
    reportsQuery.data?.data ?? []

  const total =
    reportsQuery.data?.meta?.total ?? 0

  const basePath =
    import.meta.env.BASE_URL.replace(/\/$/, "")

  const columns = useMemo(
    () =>
      getReportsColumns({
        onView: (item) => {
          window.open(
            `${basePath}/reports/${item._id}/view`,
            "_blank",
          )
        },
      }),
    [basePath],
  )

  const handleGenerate = async () => {
    try {
      await generateMutation.mutateAsync({
        ReportDate: reportDate,
        ReportCutoff: reportCutoff,
      })

      await alertSuccess({
        title: "Daily SitRep Generated",
        timer: 1500,
        showConfirmButton: false,
      })
    } catch {
      await alertError({
        title: "Generation Failed",
        text: "Unable to generate daily report.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Generated Daily SitRep Reports" />

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold">
              Generate Daily Situation Report
            </h2>

            <p className="text-sm text-muted-foreground">
              Select report date and cutoff time to generate a report snapshot.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="date"
                value={reportDate}
                onChange={(event) =>
                  setReportDate(event.target.value)
                }
                className="pl-9"
              />
            </div>

            <Select
              value={reportCutoff}
              onValueChange={(value) =>
                setReportCutoff(
                  value as ReportCutoff,
                )
              }
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <Clock className="mr-2 size-4 text-muted-foreground" />
                <SelectValue placeholder="Cutoff" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="8am">
                  8AM Report
                </SelectItem>

                <SelectItem value="5pm">
                  5PM Report
                </SelectItem>

                <SelectItem value="--">
                  Previous Day (Whole Day)
                </SelectItem>

                <SelectItem value="current-day">
                  Current Day (Whole Day)
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
            >
              <FilePlus2 className="mr-2 size-4" />

              {generateMutation.isPending
                ? "Generating..."
                : "Generate Daily SitRep"}
            </Button>
          </div>
        </div>
      </div>

      <ServerTable
        data={reports}
        columns={columns}
        total={total}
        pagination={pagination}
        onPaginationChange={
          setPagination
        }
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={
          reportsQuery.isLoading
        }
      />
    </div>
  )
}
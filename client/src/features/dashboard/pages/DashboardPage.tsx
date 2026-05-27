// src/features/dashboard/pages/DashboardPage.tsx

import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"

import {
  Activity,
  AlertTriangle,
  BedDouble,
  ClipboardList,
  CloudSun,
  FileText,
  HeartPulse,
  Info,
  MapPin,
  Megaphone,
  ShieldAlert,
  Trophy,
  Users,
} from "lucide-react"

import { Badge } from "@/shared/components/ui/badge"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"


import { FormDialog } from "@/shared/components/dialog/FormDialog"

import {
  alertError,
  alertSuccess,
  showAlertWithDialogHidden,
} from "@/shared/lib/alert"


import { cn } from "@/shared/lib/utils"

import { PlayingVenueForm } from "@/features/misc/components/PlayingVenueForm"

import { useMiscQuery } from "@/features/misc/hooks/useMiscQuery"

import { useUpdateMiscMutation } from "@/features/misc/hooks/useMiscMutation"

import type { UpdateMiscPayload } from "@/features/misc/types/misc.types"

import { useDashboardSummaryQuery } from "@/features/dashboard/hooks/useDashboardSummaryQuery"

import { ARS_PERMISSIONS } from '@/shared/constants/ars-permissions'
import { authStore } from '@/features/auth/services/auth-store'

const modules = [
  authStore.hasArsAccess(
    ARS_PERMISSIONS.HIGHLIGHTS,
  ) && {
    title: "Highlights",
    description:
      "Daily report summaries and major updates",
    icon: Megaphone,
    href: "/highlights",
  },

  authStore.hasArsAccess(
    ARS_PERMISSIONS.BILLETING_QUARTERS,
  ) && {
    title: "Billeting Quarters",
    description:
      "Preparedness ratings and delegation assignments",
    icon: BedDouble,
    href: "/billeting-quarters",
  },

  authStore.hasArsAccess(
    ARS_PERMISSIONS.PLAYING_VENUES,
  ) && {
    title: "Playing Venues",
    description:
      "Infrastructure, peripherals, and sports equipment status",
    icon: MapPin,
    href: "/playing-venue",
  },

  authStore.hasArsAccess(
    ARS_PERMISSIONS.CURRENT_SITUATIONS,
  ) && {
    title: "Current Situations",
    description:
      "Committee updates, concerns, and recommendations",
    icon: ClipboardList,
    href: "/current-situation",
  },

  authStore.hasArsAccess(
    ARS_PERMISSIONS.REPORTED_INCIDENTS,
  ) && {
    title: "Reported Incidents",
    description:
      "Incident logs and current status monitoring",
    icon: AlertTriangle,
    href: "/reported-incidents",
  },

  authStore.hasArsAccess(
    ARS_PERMISSIONS.OTHER_INFORMATION,
  ) && {
    title: "Other Information",
    description:
      "Additional notes and operational reminders",
    icon: Info,
    href: "/other-information",
  },

  authStore.hasArsAccess(
    ARS_PERMISSIONS.PATIENT_REFERRAL,
  ) && {
    title: "Patient Referral",
    description:
      "Patient referral information and tracking",
    icon: Activity,
    href: "/patient-consultation-referral-form",
  },

  authStore.hasArsAccess(
    ARS_PERMISSIONS.DepED_INCIDENT_REPORT,
  ) && {
    title: "DepED Incident Reports",
    description:
      "Manage submitted incident reports",
    icon: ShieldAlert,
    href: "/deped-incident-report",
  },

 authStore.hasArsAccess(
    ARS_PERMISSIONS.WEATHER_UPDATES,
  ) && {
    title: "Weather Updates",
    description:
      "Manage weather updates and warnings",
    icon: CloudSun,
    href: "/weather-updates",
  },

   authStore.hasArsAccess(
    ARS_PERMISSIONS.GENERATE_REPORTS,
  ) && {
    title: "Generate Reports",
    description:
      "Create and manage various reports",
    icon: FileText,
    href: "/reports",
  },
  //GENERATE_REPORTS

].filter(Boolean)

export function DashboardPage() {
  const navigate = useNavigate()

  const [openPlayingVenueForm, setOpenPlayingVenueForm] =
    useState(false)

  const miscQuery = useMiscQuery()

  const updateMiscMutation =
    useUpdateMiscMutation()

  const misc = miscQuery.data?.data

  const dashboardQuery =
    useDashboardSummaryQuery()

  const dashboardData =
    dashboardQuery.data?.data

  // const venueStatus = [
  //   {
  //     label: "Infrastructure",

  //     value:
  //       dashboardData?.venueStatus
  //         ?.infrastructure ?? 0,

  //     description:
  //       misc?.infrastructure_description ??
  //       "",

  //     icon: Building2,

  //     tone: "text-emerald-700",
  //   },

  //   {
  //     label: "Peripherals",

  //     value:
  //       dashboardData?.venueStatus
  //         ?.peripherals ?? 0,

  //     description:
  //       misc?.peripherals_description ??
  //       "",

  //     icon: Megaphone,

  //     tone: "text-orange-600",
  //   },

  //   {
  //     label: "Sports Equipment",

  //     value:
  //       dashboardData?.venueStatus
  //         ?.sports_equipment ?? 0,

  //     description:
  //       misc?.sports_equipment_description ??
  //       "",

  //     icon: Trophy,

  //     tone: "text-blue-700",
  //   },
  // ]

  // const summaryCards = [
  //   {
  //     title:
  //       "Expected Number of Delegates",

  //     value:
  //       dashboardData?.expectedDelegates?.toLocaleString() ??
  //       "0",

  //     icon: Users,

  //     accent:
  //       "bg-blue-50 text-blue-700",
  //   },

  //   {
  //     title: "Total Arrived",

  //     value:
  //       dashboardData?.totalArrived?.toLocaleString() ??
  //       "0",

  //     icon: Users,

  //     accent:
  //       "bg-emerald-50 text-emerald-700",
  //   },

  //   {
  //     title: "Remaining Delegates",

  //     value:
  //       dashboardData?.remainingDelegates?.toLocaleString() ??
  //       "0",

  //     icon: Users,

  //     accent:
  //       "bg-violet-50 text-violet-700",
  //   },

  //   {
  //     title: "Overall Arrival Rate",

  //     value: `${
  //       dashboardData?.overallArrivalRate ??
  //       0
  //     }%`,

  //     icon: Trophy,

  //     accent:
  //       "bg-amber-50 text-amber-700",
  //   },

  //   {
  //     title: "Highest Arrival Rate",

  //     value: `${
  //       dashboardData
  //         ?.highestArrivalRate?.rate ??
  //       0
  //     }%`,

  //     subtitle:
  //       dashboardData
  //         ?.highestArrivalRate
  //         ?.region ?? "N/A",

  //     icon: Trophy,

  //     accent:
  //       "bg-cyan-50 text-cyan-700",
  //   },
  // ]

  const summaryCards = [
  {
    title: "Expected Number of Delegates",
    value:
      dashboardData?.expectedDelegates?.toLocaleString() ??
      "0",
    icon: Users,
    accent: "bg-blue-50 text-blue-700",
  },

  {
    title: "Total Arrived",
    value:
      dashboardData?.totalArrived?.toLocaleString() ??
      "0",
    icon: Users,
    accent: "bg-emerald-50 text-emerald-700",
  },

  {
    title: "Total Departed",
    value:
      dashboardData?.totalDeparted?.toLocaleString() ??
      "0",
    icon: Users,
    accent: "bg-red-50 text-red-700",
  },

  {
    title: "Remaining After Departure",
    value:
      dashboardData?.remainingAfterDeparture?.toLocaleString() ??
      "0",
    icon: Users,
    accent: "bg-violet-50 text-violet-700",
  },

  {
    title: "Overall Departure Rate",
    value: `${dashboardData?.overallDepartureRate ?? 0}%`,
    icon: Trophy,
    accent: "bg-orange-50 text-orange-700",
  },

  {
    title: "Highest Departure Rate",
    value: `${
      dashboardData?.highestDepartureRate?.rate ?? 0
    }%`,
    subtitle:
      dashboardData?.highestDepartureRate?.region ?? "N/A",
    icon: Trophy,
    accent: "bg-cyan-50 text-cyan-700",
  },
]

  const handlePlayingVenueSubmit =
    async (
      payload: UpdateMiscPayload,
    ) => {
      try {
        await updateMiscMutation.mutateAsync(
          payload,
        )

        setOpenPlayingVenueForm(false)

        await alertSuccess({
          title:
            "Updated Successfully",

          timer: 1200,

          showConfirmButton: false,
        })
      } catch {
        await showAlertWithDialogHidden(
          () =>
            setOpenPlayingVenueForm(
              false,
            ),

          () =>
            setOpenPlayingVenueForm(
              true,
            ),

          () =>
            alertError({
              title: "Save Failed",

              text:
                "Unable to update playing venue status.",
            }),
        )
      }
    }

  function toLocalDateKey(
    value: string | Date,
  ) {
    const date = new Date(value)

    const year =
      date.getFullYear()

    const month = String(
      date.getMonth() + 1,
    ).padStart(2, "0")

    const day = String(
      date.getDate(),
    ).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  const todayHighlights =
    dashboardData?.latestHighlights?.filter(
      (item: any) => {
        const today =
          toLocalDateKey(
            new Date(),
          )

        const itemDate =
          toLocalDateKey(
            item.DateTimeEntered,
          )

        return (
          itemDate === today
        )
      },
    ) ?? []

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-gradient-to-r from-blue-900 to-emerald-700 p-6 text-white shadow-sm">
          <Badge className="mb-3 bg-white/15 text-white hover:bg-white/20">
            Daily Situation Report
          </Badge>

          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                SITREP Dashboard
              </h1>

              <p className="text-sm text-white/80">
                Palarong Pambansa
                2026 operational
                monitoring
              </p>
            </div>

            <p className="text-xl font-semibold">
              as of{" "}
              {dashboardData?.reportDate
                ? new Date(
                    dashboardData.reportDate,
                  ).toLocaleString()
                : "—"}
            </p>
          </div>
        </header>
  <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {summaryCards.map((item) => {
            const Icon =
              item.icon

            return (
              <Card
                key={item.title}
                className="rounded-2xl border-0 shadow-sm"
              >
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-600">
                      {item.title}
                    </p>

                    <div
                      className={cn(
                        "rounded-xl p-2",
                        item.accent,
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                      {item.value}
                    </h2>

                    {item.subtitle && (
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {
                          item.subtitle
                        }
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="rounded-2xl border-0 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <FileText className="size-5" />
                Highlights
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm leading-7 text-slate-700">
              {todayHighlights.length ? (
                todayHighlights.map(
                  (item: any) => (
                    <div
                      key={item._id}
                      className="rounded-xl border bg-slate-50 p-4"
                    >
                      <div
                        className="[&_*]:m-0"
                        dangerouslySetInnerHTML={{
                          __html:
                            item.description ??
                            "",
                        }}
                      />
                    </div>
                  ),
                )
              ) : (
                <p>
                  No highlights
                  available.
                </p>
              )}
            </CardContent>
          </Card>

<Card className="overflow-hidden rounded-2xl border-0 shadow-sm lg:col-span-3">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-blue-900">
      <HeartPulse className="size-5" />
      Health Dashboard
    </CardTitle>
  </CardHeader>

  <CardContent className="p-0">
    <iframe
      src="https://datastudio.google.com/embed/reporting/25203a54-f63e-463d-b2d9-4369c3480df1/page/p_dondkyrg3d"
      className="h-[620px] w-full border-0"
      allowFullScreen
    />
  </CardContent>
</Card>
        </section>

<section className="grid grid-cols-1 gap-6">
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
    {modules
      .filter(Boolean)
      .map((item: any) => {
        const Icon = item.icon

        return (
          <Card
  key={item.title}
  onClick={() => {
    if (
      item.title ===
      "Playing Venues"
    ) {
      setOpenPlayingVenueForm(
        true,
      )

      return
    }

    navigate({
      to: item.href,
    })
  }}
            className="group cursor-pointer rounded-2xl border-0 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <CardContent className="flex h-full flex-col gap-4 p-5">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-800 transition group-hover:bg-blue-900 group-hover:text-white">
                <Icon className="size-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
  </div>
</section>

<section>
  <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-blue-900">
        <CloudSun className="size-5" />
        Delegation Monitoring Dashboard
      </CardTitle>
    </CardHeader>

    <CardContent className="p-0">
      <iframe
        src="https://datastudio.google.com/embed/reporting/99071ea5-0e18-4d2e-ad12-859d8627ef9f/page/3ecyF"
        className="h-[850px] w-full border-0"
        allowFullScreen
      />
    </CardContent>
  </Card>
</section>

      
      </div>

      <FormDialog
        open={
          openPlayingVenueForm
        }
        onOpenChange={
          setOpenPlayingVenueForm
        }
        title="Playing Venue Status"
        description="Update infrastructure, peripherals, sports equipment, and billeting readiness."
      >
        <PlayingVenueForm
          initialData={misc}
          isSubmitting={
            updateMiscMutation.isPending
          }
          onSubmit={
            handlePlayingVenueSubmit
          }
        />
      </FormDialog>
    </div>
  )
}
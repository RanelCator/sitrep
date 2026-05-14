// src/features/reports/pages/DailySitRepPrintPage.tsx
import { useParams } from "@tanstack/react-router"
import { Printer } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { useReportViewQuery } from "@/features/reports/hooks/useReportViewQuery"

function stripHtml(html?: string) {
  if (!html) return ""

  const div = document.createElement("div")
  div.innerHTML = html
  return div.textContent || div.innerText || ""
}

function formatDate(value?: string) {
  if (!value) return ""

  return new Date(value).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function percent(value?: number) {
  return `${value ?? 0}%`
}

function getPreparednessBadge(
  rating: number,
) {
  if (rating >= 95) {
    return {
      label: "Fully Ready",

      badge:
        "bg-emerald-700 text-white border-emerald-700",

      progress:
        "bg-emerald-600",

      ring:
        "ring-emerald-200",

      card:
        "bg-emerald-50 border-emerald-200",

      text:
        "text-emerald-800",
    }
  }

  if (rating >= 85) {
    return {
      label: "Almost Ready",

      badge:
        "bg-lime-500 text-black border-lime-500",

      progress:
        "bg-lime-500",

      ring:
        "ring-lime-200",

      card:
        "bg-lime-50 border-lime-200",

      text:
        "text-lime-800",
    }
  }

  if (rating >= 70) {
    return {
      label: "Needs Improvement",

      badge:
        "bg-amber-500 text-black border-amber-500",

      progress:
        "bg-amber-500",

      ring:
        "ring-amber-200",

      card:
        "bg-amber-50 border-amber-200",

      text:
        "text-amber-800",
    }
  }

  return {
    label: "Critical",

    badge:
      "bg-red-600 text-white border-red-600",

    progress:
      "bg-red-500",

    ring:
      "ring-red-200",

    card:
      "bg-red-50 border-red-200",

    text:
      "text-red-800",
  }
}

export function DailySitRepPrintPage() {
  const { id } = useParams({
    from: "/_authenticated/reports/$id/view",
  })

  const query = useReportViewQuery(id)
  const report = query.data?.data
  const data = report?.data

  const delegationArrival = data?.delegationArrival
  const billeting = data?.billetingQuartersStatus
  const playingVenue = data?.playingVenueStatus

  if (query.isLoading) {
    return <div className="p-6">Loading report...</div>
  }

  if (!data) {
    return <div className="p-6">Report not found.</div>
  }

  return (
    <div className="bg-slate-100 p-6 print:bg-white print:p-0">
      <div className="mb-4 flex justify-end print:hidden">
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 size-4" />
          Print / Export PDF
        </Button>
      </div>

      <div className="mx-auto bg-white text-black shadow print:shadow-none">
        <section className="report-page page-1">
          <div className="grid grid-cols-[42%_58%] gap-4">
            <div>
              <h1 className="text-[20px] font-black uppercase leading-none">
                Daily Situation Report
              </h1>

              <p className="mt-1 text-[14px] font-semibold italic">
                {formatDate(data.report?.reportDate)}
              </p>

              <h2 className="mt-6 text-[15px] font-black">
                I. Highlights
              </h2>

              <div className="mt-4 space-y-3 text-justify text-[14px] leading-[1.25]">
                {data.highlights?.length ? (
                  data.highlights.map((item: any) => (
                    <div
                        key={item._id}
                        className="report-html space-y-3 text-justify"
                        dangerouslySetInnerHTML={{
                            __html: item.description ?? "",
                        }}
                    />
                  ))
                ) : (
                  <p>No highlights encoded for this report date.</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-t-md bg-[#004C97] px-4 py-2 text-center text-[16px] font-black uppercase text-white">
                Status of Playing Venue
              </div>

              <div className="space-y-2">
                <VenueRow
                  label="Infrastructure"
                  value={playingVenue?.infrastructure ?? 0}
                  color="#12a04a"
                  description={playingVenue?.infrastructure_description}
                />

                <VenueRow
                  label="Peripherals"
                  value={playingVenue?.peripherals ?? 0}
                  color="#f39c12"
                  description={playingVenue?.peripherals_description}
                />

                <VenueRow
                  label="Sports Equipment"
                  value={playingVenue?.sports_equipment ?? 0}
                  color="#0070c0"
                  description={playingVenue?.sports_equipment_description}
                />
              </div>

              <div className="rounded-t-md bg-[#008037] px-4 py-2 text-center text-[16px] font-black uppercase text-white">
                Status of Billeting Quarters
              </div>

              <table className="w-full border-collapse text-[8.5px]">
                <thead>
                  <tr className="bg-[#008037] text-white">
                    <th className="border p-1">Billeting Quarter</th>
                    <th className="border p-1">Delegation</th>
                    <th className="border p-1">Preparedness Rating</th>
                  </tr>
                </thead>
                <tbody>
  {billeting?.list?.map((item: any, index: number) => {
    const rating = item.preparedness_rating ?? 0
    const status = getPreparednessBadge(rating)

    return (
      <tr key={`${item.billeting_quarter}-${index}`}>
        <td className="border px-1 py-[2px]">
          {index + 1}. {item.billeting_quarter}
        </td>

        <td className="border px-1 py-[2px]">
          {item.delegation}
        </td>

        <td className="border px-1 py-[2px]">
          <div className="flex items-center gap-1">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full ${status.progress}`}
                style={{
                  width: `${Math.min(rating, 100)}%`,
                }}
              />
            </div>

            <span className="w-8 text-right font-bold">
              {Number(rating).toFixed(2)}
            </span>
          </div>
        </td>
      </tr>
    )
  })}
</tbody>
              </table>

              <div className="rounded-xl border border-emerald-600 bg-emerald-50 px-3 py-2">
  <div className="flex items-center justify-between gap-3">
    <div className="max-w-[120px]">
      <p className="text-left text-[9px] font-black uppercase leading-tight text-emerald-900">
        Overall Average Preparedness Rating
      </p>
    </div>

    <div className="flex items-center gap-2">
      <p className="text-[34px] font-black leading-none text-emerald-700">
        {percent(
          billeting?.overallAveragePreparednessRating,
        )}
      </p>

      <div className="flex size-9 items-center justify-center rounded-full bg-emerald-700 text-[18px] text-white shadow-sm">
        ✓
      </div>
    </div>
  </div>
</div>
<div className="mt-2 flex flex-wrap items-center justify-center gap-1 text-[7px]">
  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-[2px]">
    <div className="size-2 rounded-full bg-emerald-600" />
    <span className="font-bold text-emerald-800">
      95%+
    </span>
  </div>

  <div className="flex items-center gap-1 rounded-full bg-lime-50 px-2 py-[2px]">
    <div className="size-2 rounded-full bg-lime-500" />
    <span className="font-bold text-lime-800">
      85% - 94.99%
    </span>
  </div>

  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-[2px]">
    <div className="size-2 rounded-full bg-amber-500" />
    <span className="font-bold text-amber-800">
      Below 85%
    </span>
  </div>
</div>
            </div>
          </div>
<div className="delegation-arrival-page">
<div className="mt-4 rounded-t-md bg-[#003A78] px-4 py-2 text-center text-[16px] font-black uppercase text-white">
            Status of Delegation Arrival
          </div>

          <div className="mt-2 grid grid-cols-6 gap-2">
            <MetricBox title="Expected Number of Delegates" value={delegationArrival?.totalExpectedDelegates} />
            <MetricBox title="Total Delegates Arrived" value={delegationArrival?.totalArrived} />
            <MetricBox title="Overall Arrival Rate" value={`${delegationArrival?.overallArrivalRate ?? 0}%`} />
            <MetricBox title="Remaining Delegates" value={delegationArrival?.remainingDelegates} />
            <MetricBox
              title="Highest Arrival Rate"
              value={`${delegationArrival?.highestArrivalRate?.rate ?? 0}%`}
              subtitle={delegationArrival?.highestArrivalRate?.region}
            />
            <MetricBox title="Billeting Quarters Assigned" value={billeting?.billetingQuartersAssigned} />
          </div>

<div className="mt-3 space-y-3">
  <table className="w-full border-collapse text-[8px]">
    <thead>
      <tr className="bg-[#003A78] text-white">
        <th className="border p-1">Delegation</th>
        <th className="border p-1">Billeting Quarters</th>
        <th className="border p-1">Expected</th>
        <th className="border p-1">Arrived</th>
        <th className="border p-1">Arrival Rate</th>
      </tr>
    </thead>

    <tbody>
      {delegationArrival?.progressByRegion?.map(
        (item: any, index: number) => (
          <tr key={`${item.delegation}-${index}`}>
            <td className="border px-1 py-[2px]">
              {item.delegation}
            </td>

            <td className="border px-1 py-[2px]">
              {item.billeting_quarter}
            </td>

            <td className="border px-1 py-[2px] text-right">
              {item.expected_delegates?.toLocaleString?.() ??
                item.expected_delegates}
            </td>

            <td className="border px-1 py-[2px] text-right">
              {item.arrived_total?.toLocaleString?.() ??
                item.arrived_total}
            </td>

            <td className="border px-1 py-[2px]">
              <div className="flex items-center gap-1">
                <div className="h-2 flex-1 bg-slate-100">
                  <div
                    className="h-2 bg-[#43a047]"
                    style={{
                      width: `${Math.min(
                        item.arrival_rate ?? 0,
                        100,
                      )}%`,
                    }}
                  />
                </div>

                <span className="w-10 text-right">
                  {Number(item.arrival_rate ?? 0).toFixed(2)}%
                </span>
              </div>
            </td>
          </tr>
        ),
      )}

      {/* TOTAL COMPETING DELEGATIONS */}
  <tr className="bg-[#003A78] font-black text-white">
    <td
      colSpan={2}
      className="border px-2 py-1 uppercase"
    >
      Total Number of Competing Delegations
    </td>

    <td className="border px-2 py-1 text-right">
      {delegationArrival?.totalExpectedDelegates?.toLocaleString?.()}
    </td>

    <td className="border px-2 py-1 text-right">
      {delegationArrival?.totalArrived?.toLocaleString?.()}
    </td>

    <td className="border px-2 py-1 text-right">
      {Number(
        delegationArrival?.overallArrivalRate ?? 0,
      ).toFixed(0)}
      %
    </td>
  </tr>

  {/* OTHER DELEGATIONS */}
  {delegationArrival?.otherDelegations?.map(
    (item: any, index: number) => {
      const rate =
        item.expected_delegates > 0
          ? (
              (item.arrived /
                item.expected_delegates) *
              100
            ).toFixed(0)
          : "0"

      return (
        <tr
          key={`other-${index}`}
          className="bg-slate-50"
        >
          <td
            colSpan={2}
            className="border px-2 py-1"
          >
            {item.description}
          </td>

          <td className="border px-2 py-1 text-right">
            {item.expected_delegates?.toLocaleString?.()}
          </td>

          <td className="border px-2 py-1 text-right">
            {item.arrived?.toLocaleString?.()}
          </td>

          <td className="border px-2 py-1 text-right">
            {rate}%
          </td>
        </tr>
      )
    },
  )}

  {/* GRAND TOTAL */}
  <tr className="bg-[#003A78] font-black text-yellow-300">
    <td
      colSpan={2}
      className="border px-2 py-1 uppercase"
    >
      Total Number of Delegations
    </td>

    <td className="border px-2 py-1 text-right">
      {delegationArrival?.grandTotalExpected?.toLocaleString?.()}
    </td>

    <td className="border px-2 py-1 text-right">
      {delegationArrival?.grandTotalArrived?.toLocaleString?.()}
    </td>

    <td className="border px-2 py-1 text-right">
      {Number(
        delegationArrival?.grandOverallArrivalRate ?? 0,
      ).toFixed(0)}
      %
    </td>
  </tr>
    </tbody>
  </table>

  <div className="grid grid-cols-2 gap-3">
    <div className="rounded-md border p-3">
      <div className="rounded-t-md bg-[#003A78] p-1 text-center text-[12px] font-black uppercase text-white">
        Composition of Arrived Personnel
      </div>

      <div className="mt-3 grid grid-cols-[150px_1fr] items-center gap-3">
  <ArrivalCompositionDonut
    athletes={delegationArrival?.composition?.athletes}
    coaches={delegationArrival?.composition?.coaches}
    advanceParty={delegationArrival?.composition?.advance_party}
    trainers={delegationArrival?.composition?.trainers}
  />

  <div className="grid grid-cols-1 gap-2 text-[10px]">
    <CompositionLegend
      label="Athletes"
      value={delegationArrival?.composition?.athletes}
      total={delegationArrival?.composition?.total}
      color="#0070C0"
    />

    <CompositionLegend
      label="Coaches, Asst. Coaches & Chaperones"
      value={delegationArrival?.composition?.coaches}
      total={delegationArrival?.composition?.total}
      color="#43A047"
    />

    <CompositionLegend
      label="Advance Party, TWO, Delegation Officials"
      value={delegationArrival?.composition?.advance_party}
      total={delegationArrival?.composition?.total}
      color="#F39C12"
    />

    <CompositionLegend
      label="Trainers"
      value={delegationArrival?.composition?.trainers}
      total={delegationArrival?.composition?.total}
      color="#5E35B1"
    />
  </div>
</div>
    </div>

    <div className="rounded-md border p-4 text-center">
      <div className="rounded-t-md bg-[#003A78] p-1 text-[12px] font-black uppercase text-white">
        Billeting Quarters Assignment Summary
      </div>

      <p className="mt-4 text-[11px] font-bold uppercase text-blue-900">
        Total Identified Billeting Quarters
      </p>

      <p className="text-[30px] font-black text-blue-900">
        {billeting?.totalIdentifiedBilletingQuarters ?? 0}
      </p>

      <p className="mt-2 text-[11px] leading-tight">
        {billeting?.identifiedBilletingQuartersText}
      </p>
    </div>
  </div>
</div>
</div>
          
        </section>

        <section className="report-page page-2">
          <h2 className="text-[16px] font-black">
            II. Current Situation
          </h2>

          <table className="mt-3 w-full border-collapse text-[10px]">
            <thead>
              <tr>
                <th className="border border-black p-2">Committee</th>
                <th className="border border-black p-2">AREA/CONCERN</th>
                <th className="border border-black p-2">CURRENT SITUATION</th>
                <th className="border border-black p-2">ISSUES/CONCERNS</th>
                <th className="border border-black p-2">ACTIONS UNDERTAKEN</th>
                <th className="border border-black p-2">RECOMMENDATIONS</th>
              </tr>
            </thead>

            <tbody>
  {data.currentSituation?.length ? (
    groupCurrentSituations(data.currentSituation).flatMap((committeeGroup) =>
      committeeGroup.areaGroups.flatMap((areaGroup, areaIndex) =>
        areaGroup.items.map((item: any, itemIndex: number) => (
          <tr key={item._id}>
            {areaIndex === 0 && itemIndex === 0 && (
              <td
                rowSpan={committeeGroup.totalRows}
                className="border border-black p-2 align-middle text-center font-medium"
              >
                {committeeGroup.committee}
              </td>
            )}

            {itemIndex === 0 && (
              <td
                rowSpan={areaGroup.items.length}
                className="border border-black p-2 align-middle"
              >
                {areaGroup.areaConcern}
              </td>
            )}

            <td className="border border-black p-2 align-top">
              <div
  dangerouslySetInnerHTML={{
    __html: item.cuurent_situation || "—",
  }}
/>
            </td>

            <td className="border border-black p-2 align-top">
              <div
  dangerouslySetInnerHTML={{
    __html: item.issues_concerns || "—",
  }}
/>
            </td>

            <td className="border border-black p-2 align-top">
              <div
  dangerouslySetInnerHTML={{
    __html: item.actions_undertaken || "—",
  }}
/>
            </td>

            <td className="border border-black p-2 align-top">
              <div
  dangerouslySetInnerHTML={{
    __html: item.recommendations || "—",
  }}
/>
            </td>
          </tr>
        )),
      ),
    )
  ) : (
    <EmptyRows columns={6} rows={5} />
  )}
</tbody>
          </table>

          <h2 className="mt-8 text-[16px] font-black">
            III. Reported Incidents
          </h2>

          <table className="mt-3 w-full border-collapse text-[9px]">
            <thead>
              <tr>
                <th className="border border-black p-2">Date</th>
                <th className="border border-black p-2">Time</th>
                <th className="border border-black p-2">Venue/Location</th>
                <th className="border border-black p-2">Incident</th>
                <th className="border border-black p-2">Persons Involved</th>
                <th className="border border-black p-2">Initial Action Taken</th>
                <th className="border border-black p-2">Current Status</th>
                <th className="border border-black p-2">Remarks</th>
              </tr>
            </thead>

            <tbody>
              {data.reportedIncidents?.length ? (
                data.reportedIncidents.map((item: any) => (
                  <tr key={item._id}>
                    <td className="border border-black p-2">
                      {formatDate(item.Date)}
                    </td>
                    <td className="border border-black p-2">{item.Time}</td>
                    <td className="border border-black p-2">{item.venue_location}</td>
                    <td className="border border-black p-2">{item.Incident}</td>
                    <td className="border border-black p-2">{item.persons_involved}</td>
                    <td className="border border-black p-2">{item.initial_action_taken}</td>
                    <td className="border border-black p-2">{item.current_status}</td>
                    <td className="border border-black p-2">{item.Remarks}</td>
                  </tr>
                ))
              ) : (
                <EmptyRows columns={8} rows={5} />
              )}
            </tbody>
          </table>

          <h2 className="mt-8 text-[16px] font-black">
            IV. Other Information
          </h2>

          <ul className="mt-4 list-disc space-y-2 pl-8 text-[12px]">
            {data.otherInformation?.length ? (
              data.otherInformation.map((item: any) => (
                <li key={item._id}>{stripHtml(item.description)}</li>
              ))
            ) : (
              <>
                <li>.</li>
                <li>.</li>
              </>
            )}
          </ul>
        </section>
      </div>
    </div>
  )
}

function CompositionLegend({
  label,
  value = 0,
  total = 0,
  color,
}: {
  label: string
  value?: number
  total?: number
  color: string
}) {
  const percent =
    total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div className="flex items-center gap-2">
      <div
        className="size-4 rounded-full"
        style={{ backgroundColor: color }}
      />

      <div className="leading-tight">
        <p className="text-[9px] font-black uppercase">
          {label}
        </p>

        <p className="text-[9px] font-bold" style={{ color }}>
          {value.toLocaleString()} ({percent}%)
        </p>
      </div>
    </div>
  )
}

function ArrivalCompositionDonut({
  athletes = 0,
  coaches = 0,
  advanceParty = 0,
  trainers = 0,
}: {
  athletes?: number
  coaches?: number
  advanceParty?: number
  trainers?: number
}) {
  const total = athletes + coaches + advanceParty + trainers || 1

  const items = [
    { label: "Athletes", value: athletes, color: "#0070C0" },
    { label: "Coaches", value: coaches, color: "#43A047" },
    { label: "Advance Party", value: advanceParty, color: "#F39C12" },
    { label: "Trainers", value: trainers, color: "#5E35B1" },
  ]

  let current = 0

  return (
    <div className="relative size-36">
      <svg viewBox="0 0 42 42" className="size-36 -rotate-90">
        {items.map((item) => {
          const percent = (item.value / total) * 100
          const dash = `${percent} ${100 - percent}`
          const offset = -current

          current += percent

          return (
            <circle
              key={item.label}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={item.color}
              strokeWidth="9"
              strokeDasharray={dash}
              strokeDashoffset={offset}
            />
          )
        })}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-16 flex-col items-center justify-center rounded-full bg-white text-center shadow">
          <span className="text-[8px] font-black uppercase leading-none">
            Total
          </span>
          <span className="text-[8px] font-black uppercase leading-none">
            Arrived
          </span>
          <span className="text-[18px] font-black text-blue-900">
            {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

function DonutPercent({
  value,
  color,
}: {
  value: number
  color: string
}) {
  const radius = 18

  const circumference =
    2 * Math.PI * radius

  // keeps a visible gap even for very high %
  const visualProgress =
    value >= 95
      ? value - 2
      : value >= 85
        ? value - 1
        : value

  const progress = Math.min(
    Math.max(visualProgress, 0),
    99,
  )

  const dashOffset =
    circumference -
    (progress / 100) *
      circumference

  return (
    <div className="relative size-14">
      <svg
        viewBox="0 0 48 48"
        className="-rotate-90 size-14"
      >
        {/* background track */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="7"
        />

        {/* progress */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition:
              "stroke-dashoffset 0.4s ease",
          }}
        />
      </svg>

      {/* center text */}
      <div
        className="absolute inset-0 flex items-center justify-center text-[8px] font-black"
        style={{
          color,
        }}
      >
        {Number(value).toFixed(2)}%
      </div>
    </div>
  )
}

function groupCurrentSituations(items: any[]) {
  const committeeMap = new Map<string, Map<string, any[]>>()

  items.forEach((item) => {
    const committee = item.Committee || "—"
    const areaConcern = item.area_concern || "—"

    if (!committeeMap.has(committee)) {
      committeeMap.set(committee, new Map())
    }

    const areaMap = committeeMap.get(committee)!

    if (!areaMap.has(areaConcern)) {
      areaMap.set(areaConcern, [])
    }

    areaMap.get(areaConcern)!.push(item)
  })

  return Array.from(committeeMap.entries()).map(([committee, areaMap]) => {
    const areaGroups = Array.from(areaMap.entries()).map(
      ([areaConcern, areaItems]) => ({
        areaConcern,
        items: areaItems,
      }),
    )

    return {
      committee,
      areaGroups,
      totalRows: areaGroups.reduce(
        (sum, group) => sum + group.items.length,
        0,
      ),
    }
  })
}

function VenueRow({
  label,
  value,
  color,
  description,
}: {
  label: string
  value: number
  color: string
  description?: string
}) {
  const textLength =
    description?.length ?? 0

  const textSize =
    textLength > 220
      ? "text-[7px]"
      : textLength > 140
        ? "text-[8px]"
        : "text-[9px]"

  return (
    <div className="grid h-[78px] grid-cols-[72px_1fr] gap-2 rounded-lg border p-2">
      <div className="flex flex-col items-center justify-center gap-1">
        <p className="text-center text-[7px] font-black uppercase leading-tight">
          {label}
        </p>
<DonutPercent value={value} color={color} />
      </div>

      <div
        className="flex h-full items-center justify-center overflow-hidden rounded-lg border px-2 py-1 text-center leading-tight"
        style={{
          borderColor: color,
          backgroundColor: `${color}18`,
          color,
        }}
      >
        <p
          className={`${textSize} line-clamp-4 font-medium`}
        >
          {description || "—"}
        </p>
      </div>
    </div>
  )
}

function MetricBox({
  title,
  value,
  subtitle,
}: {
  title: string
  value?: string | number
  subtitle?: string
}) {
  return (
    <div className="rounded-lg border border-blue-200 bg-white p-2 text-center">
      <p className="text-[9px] font-black uppercase text-blue-900">
        {title}
      </p>
 
      <p className="mt-1 text-[20px] font-black text-blue-800">
  {typeof value === "number"
    ? value.toLocaleString()
    : value ?? 0}
</p>
           {subtitle && (
        <p className="text-[8px] font-bold text-cyan-700">
          {subtitle}
        </p>
      )}
    </div>
  )
}

function CompositionItem({
  label,
  value,
}: {
  label: string
  value?: number
}) {
  return (
    <div className="rounded-lg bg-slate-100 p-2 text-center">
      <p className="text-[9px] font-bold uppercase">{label}</p>
      <p className="text-[18px] font-black">{value ?? 0}</p>
    </div>
  )
}

function EmptyRows({
  columns,
  rows,
}: {
  columns: number
  rows: number
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td
              key={colIndex}
              className="h-8 border border-black p-2"
            />
          ))}
        </tr>
      ))}
    </>
  )
}
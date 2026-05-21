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

function getPreparednessBadge(rating: number) {
  if (rating >= 95) {
    return {
      progress: "bg-emerald-600",
    }
  }

  if (rating >= 85) {
    return {
      progress: "bg-lime-500",
    }
  }

  if (rating >= 70) {
    return {
      progress: "bg-amber-500",
    }
  }

  return {
    progress: "bg-red-500",
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
<style>
  {`
    @page {
      size: A4 landscape;
      margin: 8mm;
    }

    @media print {
      html,
      body {
        background: white;
      }

      .delegation-arrival-section {
        break-before: page;
        page-break-before: always;
        break-inside: auto;
        page-break-inside: auto;
      }

      .delegation-header,
      .delegation-summary {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .report-page {
        width: auto;
        min-height: auto;
        padding: 0;
        box-sizing: border-box;
      }

      .report-page,
.report-page table,
.report-page th,
.report-page td {
  font-family: Arial, Tahoma, sans-serif;
}

.report-html p {
  margin: 0 0 6px 0;
}

      .page-break-before {
        break-before: page;
        page-break-before: always;
      }

      .section-title {
        break-after: avoid;
        page-break-after: avoid;
      }

      .keep-together {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      thead {
        display: table-header-group;
      }

      tfoot {
        display: table-footer-group;
      }

      tr {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }

    @media screen {
      .report-page {
        width: 297mm;
        min-height: 210mm;
        padding: 12mm;
        margin: 0 auto 24px auto;
        box-sizing: border-box;
      }
    }

    .report-html p {
      margin: 0 0 6px 0;
    }

    .report-html ul,
    .report-html ol {
      margin-left: 18px;
    }
  `}
</style>

      <div className="mb-4 flex justify-end print:hidden">
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 size-4" />
          Print / Export PDF
        </Button>
      </div>

      <div className="mx-auto bg-white text-black shadow print:shadow-none">
        <section className="report-page">
          <header className="mb-4 flex items-start justify-between border-b-4 border-[#003A78] pb-3">
            <div>
              <h1 className="text-[24px] font-black uppercase leading-none">
                Daily Situation Report
              </h1>

              <p className="mt-1 text-[15px] font-semibold italic">
                {data.report?.reportDate}
              </p>
            </div>

            <div className="rounded-md bg-[#003A78] px-5 py-2 text-[13px] font-black uppercase text-white">
              Palarong Pambansa 2026
            </div>
          </header>

          <div className="grid grid-cols-[34%_32%_34%] gap-4">
            <section className="avoid-break">
              <SectionTitle title="I. Highlights" color="#003A78" />

              <div className="mt-3 rounded-md border p-3 text-justify text-[12px] leading-[1.3]">
                {data.highlights?.length ? (
                  data.highlights.map((item: any) => (
                    <div
                      key={item._id}
                      className="report-html"
                      dangerouslySetInnerHTML={{
                        __html: item.description ?? "",
                      }}
                    />
                  ))
                ) : (
                  <p>No highlights encoded for this report date.</p>
                )}
              </div>
            </section>

            <section className="avoid-break space-y-3">
              <SectionTitle
                title="Status of Playing Venue"
                color="#004C97"
              />

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
            </section>

            <section className="avoid-break">
              <SectionTitle
                title="Status of Billeting Quarters"
                color="#008037"
              />

              <div className="mt-2 rounded-xl border border-emerald-600 bg-emerald-50 px-3 py-2">
                <p className="text-center text-[9px] font-black uppercase text-emerald-900">
                  Overall Average Preparedness Rating
                </p>

                <p className="text-center text-[34px] font-black leading-none text-emerald-700">
                  {percent(
                    billeting?.overallAveragePreparednessRating,
                  )}
                </p>
              </div>

              <table className="mt-2 w-full border-collapse text-[7.5px]">
                <thead>
                  <tr className="bg-[#008037] text-white">
                    <th className="border p-1">Billeting Quarter</th>
                    <th className="border p-1">Delegation</th>
                    <th className="border p-1">Rating</th>
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

                            <span className="w-7 text-right font-bold">
                              {Number(rating).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </section>
          </div>

      <div className="delegation-arrival-section mt-4">
  <div className="delegation-header">
    <SectionTitle
      title="Status of Delegation Arrival"
      color="#003A78"
    />

    <div className="delegation-summary mt-2 grid grid-cols-6 gap-2">
      <MetricBox
        title="Expected Delegates"
        value={delegationArrival?.totalExpectedDelegates}
      />

      <MetricBox
        title="Total Arrived"
        value={delegationArrival?.totalArrived}
      />

      <MetricBox
        title="Arrival Rate"
        value={`${delegationArrival?.overallArrivalRate ?? 0}%`}
      />

      <MetricBox
        title="Remaining"
        value={delegationArrival?.remainingDelegates}
      />

      <MetricBox
        title="Highest Rate"
        value={`${delegationArrival?.highestArrivalRate?.rate ?? 0}%`}
        subtitle={delegationArrival?.highestArrivalRate?.region}
      />

      <MetricBox
        title="Assigned Billeting"
        value={billeting?.billetingQuartersAssigned}
      />
    </div>
  </div>

            <div className="mt-3 grid grid-cols-[62%_38%] gap-3">
             <table className="w-full table-fixed border-collapse text-[7.5px]">
  <colgroup>
    <col className="w-[36%]" />
    <col className="w-[32%]" />
    <col className="w-[9%]" />
    <col className="w-[8%]" />
    <col className="w-[15%]" />
  </colgroup>

  <thead>
    <tr className="bg-[#003A78] text-white">
      <th className="border p-1">
        Delegation
      </th>

      <th className="border p-1">
        Billeting Quarters
      </th>

      <th className="border p-1">
        Expected
      </th>

      <th className="border p-1">
        Arrived
      </th>

      <th className="border p-1">
        Rate
      </th>
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
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
      <div
        className={`h-2 rounded-full ${
          Number(item.arrival_rate ?? 0) >= 90
            ? "bg-emerald-600"
            : Number(item.arrival_rate ?? 0) >= 70
              ? "bg-lime-500"
              : Number(item.arrival_rate ?? 0) >= 40
                ? "bg-amber-500"
                : "bg-red-500"
        }`}
        style={{
          width: `${Math.min(
            Number(item.arrival_rate ?? 0),
            100,
          )}%`,
        }}
      />
    </div>

    <span className="w-8 text-right font-bold">
      {Number(item.arrival_rate ?? 0).toFixed(0)}%
    </span>
  </div>
</td>
                      </tr>
                    ),
                  )}

                  <tr className="bg-[#003A78] font-black text-white">
                    <td colSpan={2} className="border px-2 py-1 uppercase">
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

                  {delegationArrival?.otherDelegations?.map(
                    (item: any, index: number) => {
                      const rate =
                        item.expected_delegates > 0
                          ? (
                              (item.arrived / item.expected_delegates) *
                              100
                            ).toFixed(0)
                          : "0"

                      return (
                        <tr key={`other-${index}`} className="bg-slate-50">
                          <td colSpan={2} className="border px-2 py-1">
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

                  <tr className="bg-[#003A78] font-black text-yellow-300">
                    <td colSpan={2} className="border px-2 py-1 uppercase">
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

              <div className="space-y-3">
                <div className="rounded-md border p-3">
                  <div className="rounded-t-md bg-[#003A78] p-1 text-center text-[10px] font-black uppercase text-white">
                    Composition of Arrived Personnel
                  </div>

                  <div className="mt-3 grid grid-cols-[120px_1fr] items-center gap-3">
                    <ArrivalCompositionDonut
                      athletes={delegationArrival?.composition?.athletes}
                      coaches={delegationArrival?.composition?.coaches}
                      advanceParty={
                        delegationArrival?.composition?.advance_party
                      }
                      trainers={delegationArrival?.composition?.trainers}
                    />

                    <div className="grid grid-cols-1 gap-2 text-[9px]">
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

                <div className="rounded-md border p-3 text-center">
                  <div className="rounded-t-md bg-[#003A78] p-1 text-[10px] font-black uppercase text-white">
                    Billeting Quarters Assignment Summary
                  </div>

                  <p className="mt-3 text-[10px] font-bold uppercase text-blue-900">
                    Total Identified Billeting Quarters
                  </p>

                  <p className="text-[28px] font-black text-blue-900">
                    {billeting?.totalIdentifiedBilletingQuarters ?? 0}
                  </p>

                  <p className="mt-1 text-[9px] leading-tight">
                    {billeting?.identifiedBilletingQuartersText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="report-page">
          <header className="mb-4 flex items-start justify-between border-b-4 border-[#003A78] pb-3">
            <div>
              <h1 className="text-[20px] font-black uppercase leading-none">
                Daily Situation Report
              </h1>

              <p className="mt-1 text-[13px] font-semibold italic">
                {data.report?.reportDate}
              </p>
            </div>

            <div className="text-[10px] font-bold uppercase text-slate-500">
              Continuation Page
            </div>
          </header>

          <section className="print-section w-full">
            <SectionTitle title="II. Current Situation" color="#003A78" />

            <table className="mt-3 w-full border-collapse text-[10px]">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-black p-1">Committee</th>
                  <th className="border border-black p-1">Area/Concern</th>
                  <th className="border border-black p-1">Current Situation</th>
                  <th className="border border-black p-1">Issues/Concerns</th>
                  <th className="border border-black p-1">Actions Undertaken</th>
                  <th className="border border-black p-1">Recommendations</th>
                </tr>
              </thead>

              <tbody>
                {data.currentSituation?.length ? (
                  groupCurrentSituations(data.currentSituation).flatMap(
                    (committeeGroup) =>
                      committeeGroup.areaGroups.flatMap(
                        (areaGroup, areaIndex) =>
                          areaGroup.items.map(
                            (item: any, itemIndex: number) => (
                              <tr key={item._id}>
                                {areaIndex === 0 && itemIndex === 0 && (
                                  <td
                                    rowSpan={committeeGroup.totalRows}
                                    className="border border-black p-1 align-middle text-center font-medium"
                                  >
                                    {committeeGroup.committee}
                                  </td>
                                )}

                                {itemIndex === 0 && (
                                  <td
                                    rowSpan={areaGroup.items.length}
                                    className="border border-black p-1 align-middle"
                                  >
                                    {areaGroup.areaConcern}
                                  </td>
                                )}

                                <td className="border border-black p-1 align-top">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: item.cuurent_situation || "—",
                                    }}
                                  />
                                </td>

                                <td className="border border-black p-1 align-top">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: item.issues_concerns || "—",
                                    }}
                                  />
                                </td>

                                <td className="border border-black p-1 align-top">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: item.actions_undertaken || "—",
                                    }}
                                  />
                                </td>

                                <td className="border border-black p-1 align-top">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: item.recommendations || "—",
                                    }}
                                  />
                                </td>
                              </tr>
                            ),
                          ),
                      ),
                  )
                ) : (
                  <EmptyRows columns={6} rows={5} />
                )}
              </tbody>
            </table>
          </section>

          <div className="mt-5 space-y-5">
            <section className="print-section w-full">
              <SectionTitle title="III. Reported Incidents" color="#8A1C1C" />

              <table className="mt-3 w-full border-collapse text-[10px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-black p-1">Date</th>
                    <th className="border border-black p-1">Time</th>
                    <th className="border border-black p-1">Venue/Location</th>
                    <th className="border border-black p-1">Incident</th>
                    <th className="border border-black p-1">Persons Involved</th>
                    <th className="border border-black p-1">Initial Action</th>
                    <th className="border border-black p-1">Current Status</th>
                    <th className="border border-black p-1">Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {data.reportedIncidents?.length ? (
                    data.reportedIncidents.map((item: any) => (
                      <tr key={item._id}>
                        <td className="border border-black p-1">
                          {formatDate(item.Date)}
                        </td>

                        <td className="border border-black p-1">
                          {item.Time}
                        </td>

                        <td className="border border-black p-1">
                          {item.venue_location}
                        </td>

                        <td className="border border-black p-1">
                          {item.Incident}
                        </td>

                        <td className="border border-black p-1">
                          {item.persons_involved}
                        </td>

                        <td className="border border-black p-1">
                          {item.initial_action_taken}
                        </td>

                        <td className="border border-black p-1">
                          {item.current_status}
                        </td>

                        <td className="border border-black p-1">
                          {item.Remarks}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <EmptyRows columns={8} rows={5} />
                  )}
                </tbody>
              </table>
            </section>

            <section className="print-section w-full">
              <SectionTitle title="IV. Other Information" color="#444444" />

              <div className="mt-3 rounded-md border p-3">
                <ul className="list-disc space-y-2 pl-5 text-[10px] leading-tight">
                  {data.otherInformation?.length ? (
                    data.otherInformation.map((item: any) => (
                      <li key={item._id}>
                        {stripHtml(item.description)}
                      </li>
                    ))
                  ) : (
                    <>
                      <li>.</li>
                      <li>.</li>
                    </>
                  )}
                </ul>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  )
}

function SectionTitle({
  title,
  color,
}: {
  title: string
  color: string
}) {
  return (
    <div
      className="section-title rounded-t-md px-3 py-1.5 text-center text-[13px] font-black uppercase text-white"
      style={{ backgroundColor: color }}
    >
      {title}
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
        className="size-3 rounded-full"
        style={{ backgroundColor: color }}
      />

      <div className="leading-tight">
        <p className="text-[8px] font-black uppercase">
          {label}
        </p>

        <p className="text-[8px] font-bold" style={{ color }}>
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
    <div className="relative size-28">
      <svg viewBox="0 0 42 42" className="size-28 -rotate-90">
        {items.map((item) => {
          const itemPercent = (item.value / total) * 100
          const dash = `${itemPercent} ${100 - itemPercent}`
          const offset = -current

          current += itemPercent

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
        <div className="flex size-14 flex-col items-center justify-center rounded-full bg-white text-center shadow">
          <span className="text-[7px] font-black uppercase leading-none">
            Total
          </span>

          <span className="text-[7px] font-black uppercase leading-none">
            Arrived
          </span>

          <span className="text-[15px] font-black text-blue-900">
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
  const circumference = 2 * Math.PI * radius

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
    (progress / 100) * circumference

  return (
    <div className="relative size-12">
      <svg viewBox="0 0 48 48" className="size-12 -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="7"
        />

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
        />
      </svg>

      <div
        className="absolute inset-0 flex items-center justify-center text-[7px] font-black"
        style={{ color }}
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

  return Array.from(committeeMap.entries()).map(
    ([committee, areaMap]) => {
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
    },
  )
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
  return (
    <div className="grid h-[66px] grid-cols-[78px_1fr] gap-2 rounded-lg border bg-white p-2">
      <div className="flex flex-col items-center justify-center gap-1">
        <p className="text-center text-[6.5px] font-black uppercase leading-none">
          {label}
        </p>

        <DonutPercent value={value} color={color} />
      </div>

<div
  className="flex h-full items-center justify-center overflow-hidden rounded-lg border px-3 pt-1 pb-4 text-center"
        style={{
          borderColor: color,
          backgroundColor: `${color}12`,
          color,
        }}
      >
        <p className="line-clamp-3 text-[8px] font-bold leading-tight">
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
      <p className="text-[8px] font-black uppercase text-blue-900">
        {title}
      </p>

      <p className="mt-1 text-[18px] font-black text-blue-800">
        {typeof value === "number"
          ? value.toLocaleString()
          : value ?? 0}
      </p>

      {subtitle && (
        <p className="text-[7px] font-bold text-cyan-700">
          {subtitle}
        </p>
      )}
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
              className="h-7 border border-black p-1"
            />
          ))}
        </tr>
      ))}
    </>
  )
}
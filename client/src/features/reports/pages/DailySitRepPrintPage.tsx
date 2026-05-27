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

export function DailySitRepPrintPage() {
  const { id } = useParams({
    from: "/_authenticated/reports/$id/view",
  })

  const query = useReportViewQuery(id)
  const report = query.data?.data
  const data = report?.data

  const delegationArrival = data?.delegationArrival
  const billeting = data?.billetingQuartersStatus

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

            <section className="avoid-break col-span-2">
              <SectionTitle title="Weather Updates" color="#0F766E" />

              <table className="mt-3 w-full border-collapse text-[10px]">
                <thead>
                  <tr className="bg-[#0F766E] text-white">
                    <th className="border p-1">Place</th>
                    <th className="border p-1">Temperature</th>
                    <th className="border p-1">Description</th>
                  </tr>
                </thead>

                <tbody>
                  {data.weatherUpdates?.length ? (
                    data.weatherUpdates.map((item: any, index: number) => {
                      const tempStyle = getWeatherTemperatureStyle(
                        item.warningLevel,
                      )

                      return (
                        <tr key={`${item.place}-${index}`}>
                          <td className="border px-2 py-1 font-bold">
                            {item.place}
                          </td>

                          <td className="border px-2 py-1 text-center">
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-black ${tempStyle}`}
                            >
                              {item.temperature}
                            </span>
                          </td>

                          <td className="border px-2 py-1">
                            {item.description || "—"}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="border px-2 py-4 text-center text-[10px]"
                      >
                        No weather updates encoded for this report date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </div>

          <div className="delegation-arrival-section mt-4">
            <div className="delegation-header">
              <SectionTitle
                title="Status of Delegation Departure"
                color="#003A78"
              />

              <div className="delegation-summary mt-2 grid grid-cols-5 gap-2">
                <MetricBox
                  title="Total Arrived"
                  value={delegationArrival?.totalArrived}
                />

                <MetricBox
                  title="Total Departed"
                  value={delegationArrival?.totalDeparted}
                />

                <MetricBox
                  title="Departure Rate"
                  value={`${delegationArrival?.overallDepartureRate ?? 0}%`}
                />

                <MetricBox
                  title="Remaining After Departure"
                  value={delegationArrival?.remainingAfterDeparture}
                />

                <MetricBox
                  title="Highest Departure Rate"
                  value={`${delegationArrival?.highestDepartureRate?.rate ?? 0}%`}
                  subtitle={delegationArrival?.highestDepartureRate?.region}
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
                    <th className="border p-1">Delegation</th>
                    <th className="border p-1">Billeting Quarters</th>
                    <th className="border p-1">Arrived</th>
                    <th className="border p-1">Departed</th>
                    <th className="border p-1">Departure Rate</th>
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
                          {item.arrived_total?.toLocaleString?.() ??
                            item.arrived_total}
                        </td>

                        <td className="border px-1 py-[2px] text-right">
                          {item.departed_total?.toLocaleString?.() ??
                            item.departed_total ??
                            0}
                        </td>

                        <td className="border px-1 py-[2px]">
                          <div className="flex items-center gap-1">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className={`h-2 rounded-full ${
                                  Number(item.departure_rate ?? 0) >= 90
                                    ? "bg-emerald-600"
                                    : Number(item.departure_rate ?? 0) >= 70
                                      ? "bg-lime-500"
                                      : Number(item.departure_rate ?? 0) >= 40
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    Number(item.departure_rate ?? 0),
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>

                            <span className="w-8 text-right font-bold">
                              {Number(item.departure_rate ?? 0).toFixed(0)}%
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
                      {delegationArrival?.totalArrived?.toLocaleString?.()}
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {delegationArrival?.totalDeparted?.toLocaleString?.()}
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {Number(
                        delegationArrival?.overallDepartureRate ?? 0,
                      ).toFixed(0)}
                      %
                    </td>
                  </tr>

                  <tr className="bg-[#003A78] font-black text-yellow-300 hidden">
                    <td colSpan={2} className="border px-2 py-1 uppercase">
                      Total Number of Delegations
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {delegationArrival?.grandTotalExpected?.toLocaleString?.()}
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {delegationArrival?.totalDeparted?.toLocaleString?.()}
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {Number(
                        delegationArrival?.overallDepartureRate ?? 0,
                      ).toFixed(0)}
                      %
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="space-y-3">
                <div className="rounded-md border p-3">
                  <div className="rounded-t-md bg-[#003A78] p-1 text-center text-[10px] font-black uppercase text-white">
                    Composition of Departed Personnel
                  </div>

                  <div className="mt-3 grid grid-cols-[120px_1fr] items-center gap-3">
                    <PersonnelCompositionDonut
                      label="Departed"
                      athletes={
                        delegationArrival?.composition?.departure?.athletes
                      }
                      coaches={
                        delegationArrival?.composition?.departure?.coaches
                      }
                      advanceParty={
                        delegationArrival?.composition?.departure
                          ?.advance_party
                      }
                      trainers={
                        delegationArrival?.composition?.departure?.trainers
                      }
                    />

                    <div className="grid grid-cols-1 gap-2 text-[9px]">
                      <CompositionLegend
                        label="Athletes"
                        value={
                          delegationArrival?.composition?.departure?.athletes
                        }
                        total={
                          delegationArrival?.composition?.departure?.total
                        }
                        color="#0070C0"
                      />

                      <CompositionLegend
                        label="Coaches, Asst. Coaches & Chaperones"
                        value={
                          delegationArrival?.composition?.departure?.coaches
                        }
                        total={
                          delegationArrival?.composition?.departure?.total
                        }
                        color="#43A047"
                      />

                      <CompositionLegend
                        label="Advance Party, TWO, Delegation Officials"
                        value={
                          delegationArrival?.composition?.departure
                            ?.advance_party
                        }
                        total={
                          delegationArrival?.composition?.departure?.total
                        }
                        color="#F39C12"
                      />

                      <CompositionLegend
                        label="Trainers"
                        value={
                          delegationArrival?.composition?.departure?.trainers
                        }
                        total={
                          delegationArrival?.composition?.departure?.total
                        }
                        color="#5E35B1"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-3 text-center hidden">
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
                  <th className="border border-black p-1">
                    Current Situation
                  </th>
                  <th className="border border-black p-1">
                    Issues/Concerns
                  </th>
                  <th className="border border-black p-1">
                    Actions Undertaken
                  </th>
                  <th className="border border-black p-1">
                    Recommendations
                  </th>
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
                                      __html:
                                        item.cuurent_situation || "—",
                                    }}
                                  />
                                </td>

                                <td className="border border-black p-1 align-top">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        item.issues_concerns || "—",
                                    }}
                                  />
                                </td>

                                <td className="border border-black p-1 align-top">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        item.actions_undertaken || "—",
                                    }}
                                  />
                                </td>

                                <td className="border border-black p-1 align-top">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        item.recommendations || "—",
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
                    <th className="border border-black p-1">
                      Venue/Location
                    </th>
                    <th className="border border-black p-1">Incident</th>
                    <th className="border border-black p-1">
                      Persons Involved
                    </th>
                    <th className="border border-black p-1">Initial Action</th>
                    <th className="border border-black p-1">
                      Current Status
                    </th>
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
              <SectionTitle
                title="IV. DepED Reported Incidents"
                color="#B45309"
              />

              <table className="mt-3 w-full border-collapse text-[9px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-black p-1">Reporter</th>
                    <th className="border border-black p-1">Designation</th>
                    <th className="border border-black p-1">
                      Agency / Region
                    </th>
                    <th className="border border-black p-1">
                      Type of Incident
                    </th>
                    <th className="border border-black p-1">Date & Time</th>
                    <th className="border border-black p-1">
                      Location / Area
                    </th>
                    <th className="border border-black p-1">
                      Brief Description
                    </th>
                    <th className="border border-black p-1">
                      Immediate Actions Taken
                    </th>
                    <th className="border border-black p-1">
                      Current Status
                    </th>
                    <th className="border border-black p-1">Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {data.depedIncidentReports?.length ? (
                    data.depedIncidentReports.map((item: any) => (
                      <tr key={item._id}>
                        <td className="border border-black p-1 align-top">
                          <div className="font-semibold">
                            {item.reporterName}
                          </div>
                          <div className="text-[8px] text-slate-600">
                            {item.mobileNumber}
                          </div>
                        </td>

                        <td className="border border-black p-1 align-top">
                          {item.designationRole}
                        </td>

                        <td className="border border-black p-1 align-top">
                          {item.agencyOfficeRegion}
                        </td>

                        <td className="border border-black p-1 align-top">
                          {item.incidentType === "Others" &&
                          item.incidentTypeOther
                            ? item.incidentTypeOther
                            : item.incidentType}
                        </td>

                        <td className="border border-black p-1 align-top">
                          <div>{formatDate(item.date)}</div>
                          <div className="text-[8px] text-slate-600">
                            {item.time}
                          </div>
                        </td>

                        <td className="border border-black p-1 align-top">
                          <div>
                            {item.location === "Others" &&
                            item.locationOther
                              ? item.locationOther
                              : item.location}
                          </div>

                          <div className="text-[8px] text-slate-600">
                            {item.area === "Others" && item.areaOther
                              ? item.areaOther
                              : item.area}
                          </div>
                        </td>

                        <td className="border border-black p-1 align-top">
                          {item.briefDescription}
                        </td>

                        <td className="border border-black p-1 align-top">
                          {item.immediateActionsTaken}
                        </td>

                        <td className="border border-black p-1 align-top">
                          {item.currentStatus}
                        </td>

                        <td className="border border-black p-1 align-top">
                          {item.remarks}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <EmptyRows columns={10} rows={4} />
                  )}
                </tbody>
              </table>
            </section>

            <section className="print-section w-full">
              <SectionTitle title="V. Other Information" color="#444444" />

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
  const percent = total > 0 ? Math.round((value / total) * 100) : 0

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

function getWeatherTemperatureStyle(warningLevel?: string) {
  switch (warningLevel) {
    case "severe":
      return "bg-red-700 text-white"

    case "high":
      return "bg-orange-500 text-white"

    case "moderate":
      return "bg-amber-400 text-black"

    case "low":
    default:
      return "bg-emerald-100 text-emerald-800"
  }
}

function PersonnelCompositionDonut({
  label,
  athletes = 0,
  coaches = 0,
  advanceParty = 0,
  trainers = 0,
}: {
  label: string
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
            {label}
          </span>

          <span className="text-[15px] font-black text-blue-900">
            {total.toLocaleString()}
          </span>
        </div>
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
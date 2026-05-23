import { useState } from "react"
import type {
  FormEvent,
  HTMLInputTypeAttribute,
  ReactNode,
} from "react"
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

import type {
  CreateDepedIncidentReportInput,
  DepedIncidentReport,
} from "../types/deped-incident-reports.types"
import {
  useCreateDepedIncidentReport,
  useDeleteDepedIncidentReport,
  useDepedIncidentReports,
  useUpdateDepedIncidentReport,
} from "../hooks/use-deped-incident-reports"
import { PLAYING_VENUE_OPTIONS } from "@/shared/constants/area-location"
import { INCIDENT_TYPES } from "@/shared/constants/incident-types"
import { useNavigate } from "@tanstack/react-router"

import {
  alertError,
  alertSuccess,
  confirmDanger,
  showAlertWithDialogHidden,
} from "@/shared/lib/alert"

const emptyForm: CreateDepedIncidentReportInput = {
  email: "",
  reporterName: "",
  designationRole: "",
  mobileNumber: "",
  agencyOfficeRegion: "",

  incidentType: "",
  incidentTypeOther: "",

  date: "",
  time: "",

  location: "",
  locationOther: "",

  area: "",
  areaOther: "",

  briefDescription: "",
  immediateActionsTaken: "",

  currentStatus: "",
  remarks: "",
}



export default function DepedIncidentReportsPage() {
    const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editingItem, setEditingItem] =
    useState<DepedIncidentReport | null>(null)
  const [form, setForm] =
    useState<CreateDepedIncidentReportInput>(emptyForm)

  const reportsQuery = useDepedIncidentReports({
    page,
    limit: 10,
  })

  const createMutation = useCreateDepedIncidentReport()
  const updateMutation = useUpdateDepedIncidentReport()
  const deleteMutation = useDeleteDepedIncidentReport()

  const reports = reportsQuery.data?.data.items ?? []
  const meta = reportsQuery.data?.data.meta

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending

  const selectedLocation = PLAYING_VENUE_OPTIONS.find(
    (item) => item.municipality === form.location,
  )

  function handleChange(
    name: keyof CreateDepedIncidentReportInput,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleLocationChange(value: string) {
    setForm((prev) => ({
      ...prev,
      location: value,
      area: "",
    }))
  }

  function handleAdd() {
    setEditingItem(null)
    setForm(emptyForm)
    setOpen(true)
  }

function handleEdit(item: DepedIncidentReport) {
  setEditingItem(item)

  setForm({
    email: item.email,
    reporterName: item.reporterName,
    designationRole: item.designationRole,
    mobileNumber: item.mobileNumber,
    agencyOfficeRegion: item.agencyOfficeRegion,

    incidentType: item.incidentType,
    incidentTypeOther: item.incidentTypeOther ?? "",

    date: item.date,
    time: item.time,

    location: item.location,
    locationOther: item.locationOther ?? "",

    area: item.area,
    areaOther: item.areaOther ?? "",

    briefDescription: item.briefDescription,
    immediateActionsTaken:
      item.immediateActionsTaken,

    currentStatus:
      item.currentStatus ?? "",

    remarks: item.remarks ?? "",
  })

  setOpen(true)
}

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()

  try {
    if (editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem._id,
        payload: form,
      })

      setOpen(false)
      setEditingItem(null)
      setForm(emptyForm)

      await alertSuccess({
        title: "Updated!",
        text: "DepED incident report updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      })
    } else {
      await createMutation.mutateAsync(form)

      setOpen(false)
      setEditingItem(null)
      setForm(emptyForm)

      await alertSuccess({
        title: "Created!",
        text: "DepED incident report created successfully.",
        timer: 1500,
        showConfirmButton: false,
      })
    }
  } catch {
    await showAlertWithDialogHidden(
      () => setOpen(false),
      () => setOpen(true),
      () =>
        alertError({
          title: "Save failed",
          text: "Please check the form and try again.",
        }),
    )
  }
}

async function handleDelete(item: DepedIncidentReport) {
  const confirmed = await confirmDanger({
    title: "Delete report?",
    text: "This DepED incident report will be permanently deleted.",
    confirmText: "Yes, delete it",
  })

  if (!confirmed) return

  try {
    await deleteMutation.mutateAsync(item._id)

    await alertSuccess({
      title: "Deleted!",
      text: "DepED incident report deleted successfully.",
      timer: 1500,
      showConfirmButton: false,
    })
  } catch {
    await alertError({
      title: "Delete failed",
      text: "Unable to delete the report. Please try again.",
    })
  }
}

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="rounded-2xl border-0 shadow-sm">
<CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div className="flex items-start gap-3">
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="mt-1"
      onClick={() => navigate({ to: "/" })}
    >
      <ArrowLeft className="size-4" />
    </Button>

    <div>
      <CardTitle className="text-2xl font-bold text-blue-900">
        DepED Incident Reports
      </CardTitle>

      <p className="mt-1 text-sm text-slate-500">
        Manage submitted incident reports.
      </p>
    </div>
  </div>

  <Button onClick={handleAdd}>
    <Plus className="mr-2 size-4" />
    Add Report
  </Button>
</CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-xl border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Incident Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="w-[120px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {reportsQuery.isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="h-24 text-center"
                      >
                        Loading reports...
                      </TableCell>
                    </TableRow>
                  ) : reports.length ? (
                    reports.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold">
                              {item.reporterName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.email}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>{item.incidentType}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.time}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.area}</TableCell>
                        <TableCell>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {item.currentStatus || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate">
                          {item.remarks || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                            >
                              <Pencil className="size-4" />
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(item)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="h-24 text-center"
                      >
                        No incident reports found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {meta?.page ?? page} of{" "}
                {meta?.totalPages ?? 1}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  disabled={!meta || page >= meta.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!w-screen !max-w-[100vw] h-screen max-h-screen overflow-hidden rounded-none border-0 p-0">
          <div className="border-b bg-blue-900 px-6 py-5 text-white md:px-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {editingItem
                  ? "Update DepED Incident Report"
                  : "Create DepED Incident Report"}
              </DialogTitle>
            </DialogHeader>

            <p className="mt-2 text-sm text-white/80">
              Please provide the reporter details, incident information,
              and actions taken.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-x-hidden bg-slate-50 px-4 py-6 md:px-8"
          >
            <div className="mx-auto w-full max-w-5xl space-y-6">
              <FormSection title="Reporter Information">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <FormInput
                    label="Email"
                    value={form.email}
                    onChange={(value) =>
                      handleChange("email", value)
                    }
                  />

                  <FormInput
                    label="Name of Reporter"
                    value={form.reporterName}
                    onChange={(value) =>
                      handleChange("reporterName", value)
                    }
                  />

                  <FormInput
                    label="Designation / Role"
                    value={form.designationRole}
                    onChange={(value) =>
                      handleChange("designationRole", value)
                    }
                  />

                  <FormInput
                    label="Mobile Number"
                    value={form.mobileNumber}
                    onChange={(value) =>
                      handleChange("mobileNumber", value)
                    }
                  />

                  <div className="lg:col-span-2">
                    <FormInput
                      label="Agency / Office / Region"
                      value={form.agencyOfficeRegion}
                      onChange={(value) =>
                        handleChange(
                          "agencyOfficeRegion",
                          value,
                        )
                      }
                    />
                  </div>
                </div>
              </FormSection>

              <FormSection title="Incident Details">
  <div className="space-y-5">
    {/* 1st Row */}
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <FormSelect
        label="Type of Incident"
        value={form.incidentType}
        placeholder="Select incident type"
        onChange={(value) =>
          handleChange("incidentType", value)
        }
        options={INCIDENT_TYPES.map((type: string) => ({
          label: type,
          value: type,
        }))}
      />

      {form.incidentType === "Others" && (
        <FormInput
          label="Please specify"
          value={form.incidentTypeOther ?? ""}
          onChange={(value) =>
            handleChange("incidentTypeOther", value)
          }
        />
      )}
    </div>

    {/* 2nd Row */}
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <FormInput
        label="Date"
        type="date"
        value={form.date}
        onChange={(value) => handleChange("date", value)}
      />

      <FormInput
        label="Time"
        type="time"
        value={form.time}
        onChange={(value) => handleChange("time", value)}
      />
    </div>

    {/* 3rd Row */}
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <FormSelect
        label="Location"
        value={form.location}
        placeholder="Select municipality"
        onChange={handleLocationChange}
        options={[
          ...PLAYING_VENUE_OPTIONS.map((item) => ({
            label: item.municipality,
            value: item.municipality,
          })),
          {
            label: "Others",
            value: "Others",
          },
        ]}
      />

      <FormSelect
        label="Area"
        value={form.area}
        placeholder="Select venue / area"
        disabled={!form.location}
        onChange={(value) => handleChange("area", value)}
        options={[
          ...(selectedLocation?.venues.map((venue: string) => ({
            label: venue,
            value: venue,
          })) ?? []),
          {
            label: "Others",
            value: "Others",
          },
        ]}
      />
    </div>

    {/* 4th Row */}
    {(form.location === "Others" || form.area === "Others") && (
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {form.location === "Others" && (
          <FormInput
            label="Specify Other Location"
            value={form.locationOther ?? ""}
            onChange={(value) =>
              handleChange("locationOther", value)
            }
          />
        )}

        {form.area === "Others" && (
          <FormInput
            label="Specify Other Area"
            value={form.areaOther ?? ""}
            onChange={(value) =>
              handleChange("areaOther", value)
            }
          />
        )}
      </div>
    )}
  </div>
</FormSection>

              <FormSection title="Narrative Report">
                <div className="space-y-5">
                  <FormTextarea
                    label="Brief Description of Incident"
                    value={form.briefDescription}
                    onChange={(value) =>
                      handleChange("briefDescription", value)
                    }
                  />

                  <FormTextarea
                    label="Immediate Actions Taken"
                    value={form.immediateActionsTaken}
                    onChange={(value) =>
                      handleChange("immediateActionsTaken", value)
                    }
                  />
                </div>
              </FormSection>
              <FormSection title="Status Information">
  <div className="space-y-5">
    <FormInput
      label="Current Status"
      value={form.currentStatus ?? ""}
      onChange={(value) =>
        handleChange("currentStatus", value)
      }
    />

    <FormTextarea
      label="Remarks"
      value={form.remarks ?? ""}
      onChange={(value) =>
        handleChange("remarks", value)
      }
    />
  </div>
</FormSection>
            </div>

            <div className="sticky bottom-0 -mx-4 -mb-6 mt-6 border-t bg-white px-4 py-4 md:-mx-8 md:px-8">
              <div className="mx-auto flex w-full max-w-5xl justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : editingItem
                      ? "Update Report"
                      : "Create Report"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type FormSectionProps = {
  title: string
  children: ReactNode
}

function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h3 className="mb-6 text-xl font-bold text-slate-900">
        {title}
      </h3>

      {children}
    </section>
  )
}

type FormInputProps = {
  label: string
  value: string
  type?: HTMLInputTypeAttribute
  onChange: (value: string) => void
}

function FormInput({
  label,
  value,
  type = "text",
  onChange,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-slate-700">
        {label}
      </Label>

      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border-slate-300 bg-white"
      />
    </div>
  )
}

type FormTextareaProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

function FormTextarea({
  label,
  value,
  onChange,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-slate-700">
        {label}
      </Label>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-40 rounded-xl border-slate-300 bg-white"
      />
    </div>
  )
}

type FormSelectOption = {
  label: string
  value: string
}

type FormSelectProps = {
  label: string
  value: string
  placeholder: string
  options: FormSelectOption[]
  disabled?: boolean
  onChange: (value: string) => void
}

function FormSelect({
  label,
  value,
  placeholder,
  options,
  disabled,
  onChange,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-slate-700">
        {label}
      </Label>

      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="h-12 rounded-xl border-slate-300 bg-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
import { useState } from "react"
import {
  ArrowLeft,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"

import { useNavigate } from "@tanstack/react-router"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"

import type {
  CreateWeatherUpdateInput,
  WeatherUpdate,
  WeatherWarningLevel,
} from "../types/weather-updates.types"

import {
  useCreateWeatherUpdate,
  useDeleteWeatherUpdate,
  useUpdateWeatherUpdate,
  useWeatherUpdates,
} from "../hooks/use-weather-updates"
import { alertError, alertSuccess, confirmDanger } from "@/shared/lib/alert"

const WEATHER_WARNING_OPTIONS = [
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Moderate",
    value: "moderate",
  },
  {
    label: "High",
    value: "high",
  },
  {
    label: "Severe",
    value: "severe",
  },
]

const emptyForm: CreateWeatherUpdateInput = {
  place: "",
  date: "",
  temperature: "",
  warningLevel: "low" as WeatherWarningLevel,
  description: "",
}

export default function WeatherUpdatesPage() {
  const navigate = useNavigate()

  const [page, setPage] = useState(1)

  const [open, setOpen] = useState(false)

  const [editingItem, setEditingItem] =
    useState<WeatherUpdate | null>(null)

  const [form, setForm] =
    useState<CreateWeatherUpdateInput>(emptyForm)

  const weatherUpdatesQuery =
    useWeatherUpdates({
      page,
      limit: 10,
    })

  const createMutation =
    useCreateWeatherUpdate()

  const updateMutation =
    useUpdateWeatherUpdate()

  const deleteMutation =
    useDeleteWeatherUpdate()

  const weatherUpdates =
    weatherUpdatesQuery.data?.data.items ?? []

  const meta =
    weatherUpdatesQuery.data?.data.meta

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending

  function handleChange(
    name: keyof CreateWeatherUpdateInput,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleAdd() {
    setEditingItem(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function handleEdit(item: WeatherUpdate) {
    setEditingItem(item)

    setForm({
      place: item.place,
      date: item.date,
      temperature: item.temperature,
      warningLevel: item.warningLevel,
      description:
        item.description ?? "",
    })

    setOpen(true)
  }

async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>,
) {
  e.preventDefault()

  try {
    if (!form.date) {
      await alertError({
        title: "Save Failed",

        text:
          "Please select a date.",
      })

      return
    }

    if (editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem._id,
        payload: form,
      })
    } else {
      await createMutation.mutateAsync(form)
    }

    await alertSuccess({
      title: "Saved Successfully",

      timer: 1200,

      showConfirmButton: false,
    })

    setOpen(false)

    setEditingItem(null)

    setForm(emptyForm)
  } catch {
    await alertError({
      title: "Save Failed",

      text:
        "Unable to save information.",
    })
  }
}

async function handleDelete(
  item: WeatherUpdate,
) {
const confirmed = await confirmDanger({
  title: "Delete Weather Update?",

  text:
    "This action cannot be undone.",

  confirmText: "Yes, delete it",

  cancelText: "Cancel",
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

      text:
        "Unable to delete information.",
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
                onClick={() =>
                  navigate({
                    to: "/",
                  })
                }
              >
                <ArrowLeft className="size-4" />
              </Button>

              <div>
                <CardTitle className="text-2xl font-bold text-blue-900">
                  Weather Updates
                </CardTitle>

                <p className="mt-1 text-sm text-slate-500">
                  Manage weather monitoring updates.
                </p>
              </div>
            </div>

            <Button onClick={handleAdd}>
              <Plus className="mr-2 size-4" />
              Add Weather
            </Button>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-xl border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Place</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Warning Level</TableHead>
                    <TableHead>Description</TableHead>

                    <TableHead className="w-[120px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {weatherUpdatesQuery.isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center"
                      >
                        Loading weather updates...
                      </TableCell>
                    </TableRow>
                  ) : weatherUpdates.length ? (
                    weatherUpdates.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">
                          {item.place}
                        </TableCell>

                        <TableCell>
                          {new Date(
                            item.date,
                          ).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          {item.temperature}
                        </TableCell>

                        <TableCell className="capitalize">
                          {item.warningLevel}
                        </TableCell>

                        <TableCell className="max-w-[300px] truncate">
                          {item.description}
                        </TableCell>

                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleEdit(item)
                              }
                            >
                              <Pencil className="size-4" />
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleDelete(item)
                              }
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
                        colSpan={6}
                        className="h-24 text-center"
                      >
                        No weather updates found.
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
                  onClick={() =>
                    setPage((prev) => prev - 1)
                  }
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  disabled={
                    !meta ||
                    page >= meta.totalPages
                  }
                  onClick={() =>
                    setPage((prev) => prev + 1)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? "Update Weather"
                : "Create Weather"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormInput
                label="Place"
                value={form.place}
                onChange={(value) =>
                  handleChange("place", value)
                }
              />

              <FormInput
                label="Date"
                type="date"
                value={form.date}
                onChange={(value) =>
                  handleChange("date", value)
                }
              />

              <FormInput
                label="Temperature"
                value={form.temperature}
                onChange={(value) =>
                  handleChange(
                    "temperature",
                    value,
                  )
                }
              />

              <FormSelect
                label="Warning Level"
                value={form.warningLevel}
                placeholder="Select warning level"
                onChange={(value) =>
                  handleChange(
                    "warningLevel",
                    value,
                  )
                }
                options={
                  WEATHER_WARNING_OPTIONS
                }
              />

              <div className="md:col-span-2">
                <FormTextarea
                  label="Description"
                  value={
                    form.description ?? ""
                  }
                  onChange={(value) =>
                    handleChange(
                      "description",
                      value,
                    )
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : editingItem
                    ? "Update Weather"
                    : "Create Weather"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type FormInputProps = {
  label: string
  value: string
  type?: string
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
      <Label>{label}</Label>

      <Input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
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
      <Label>{label}</Label>

      <Textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="min-h-28"
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
  onChange: (value: string) => void
}

function FormSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={placeholder}
          />
        </SelectTrigger>

        <SelectContent>
          {options.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
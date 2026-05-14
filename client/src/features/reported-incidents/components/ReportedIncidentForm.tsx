// src/features/reported-incidents/components/ReportedIncidentForm.tsx
import { useForm } from "@tanstack/react-form"

import { Button } from "@/shared/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"

import type {
  CreateReportedIncidentPayload,
  ReportedIncident,
} from "@/features/reported-incidents/types/reported-incidents.types"

interface ReportedIncidentFormProps {
  initialData?: ReportedIncident | null
  isSubmitting?: boolean
  onSubmit: (
    payload: CreateReportedIncidentPayload,
  ) => Promise<void>
}

export function ReportedIncidentForm({
  initialData,
  isSubmitting,
  onSubmit,
}: ReportedIncidentFormProps) {
  const form = useForm({
    defaultValues: {
      Date: initialData?.Date
      ? new Date(initialData.Date)
          .toISOString()
          .split("T")[0]
      : "",
      Time: initialData?.Time ?? "",
      venue_location: initialData?.venue_location ?? "",
      Incident: initialData?.Incident ?? "",
      persons_involved:
        initialData?.persons_involved ?? "",
      initial_action_taken:
        initialData?.initial_action_taken ?? "",
      current_status:
        initialData?.current_status ?? "",
      Remarks: initialData?.Remarks ?? "",
    },

    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <form.Field name="Date">
            {(field) => (
              <Field>
                <FieldLabel>Date</FieldLabel>

                <Input
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="Time">
            {(field) => (
              <Field>
                <FieldLabel>Time</FieldLabel>

                <Input
                  type="time"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                />
              </Field>
            )}
          </form.Field>
        </div>

        <form.Field name="venue_location">
          {(field) => (
            <Field>
              <FieldLabel>Venue / Location</FieldLabel>

              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter venue or location..."
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="Incident">
          {(field) => (
            <Field>
              <FieldLabel>Incident</FieldLabel>

              <Textarea
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter incident details..."
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="persons_involved">
          {(field) => (
            <Field>
              <FieldLabel>Persons Involved</FieldLabel>

              <Textarea
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter persons involved..."
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="initial_action_taken">
          {(field) => (
            <Field>
              <FieldLabel>Initial Action Taken</FieldLabel>

              <Textarea
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter initial actions..."
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="current_status">
          {(field) => (
            <Field>
              <FieldLabel>Current Status</FieldLabel>

              <Textarea
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter current status..."
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="Remarks">
          {(field) => (
            <Field>
              <FieldLabel>Remarks</FieldLabel>

              <Textarea
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter remarks..."
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Incident"}
        </Button>
      </div>
    </form>
  )
}
// src/features/misc/components/PlayingVenueForm.tsx
import { useForm } from "@tanstack/react-form"

import { Button } from "@/shared/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Separator } from "@/shared/components/ui/separator"
import { Textarea } from "@/shared/components/ui/textarea"

import type {
  Misc,
  UpdateMiscPayload,
} from "@/features/misc/types/misc.types"

interface PlayingVenueFormProps {
  initialData?: Misc
  isSubmitting?: boolean
  onSubmit: (payload: UpdateMiscPayload) => Promise<void>
}

export function PlayingVenueForm({
  initialData,
  isSubmitting,
  onSubmit,
}: PlayingVenueFormProps) {
  const form = useForm({
    defaultValues: {
      infrastructure: initialData?.infrastructure ?? 0,
      infrastructure_description:
        initialData?.infrastructure_description ?? "",

      peripherals: initialData?.peripherals ?? 0,
      peripherals_description:
        initialData?.peripherals_description ?? "",

      sports_equipment: initialData?.sports_equipment ?? 0,
      sports_equipment_description:
        initialData?.sports_equipment_description ?? "",

      billeting_quarters_assigned:
        initialData?.billeting_quarters_assigned ?? 0,

      identified_billeting_quarters:
        initialData?.identified_billeting_quarters ?? 0,

      identified_billeting_quarters_text:
        initialData?.identified_billeting_quarters_text ?? "",
    },

    onSubmit: async ({ value }) => {
      await onSubmit({
        infrastructure: Number(value.infrastructure),
        infrastructure_description: value.infrastructure_description,

        peripherals: Number(value.peripherals),
        peripherals_description: value.peripherals_description,

        sports_equipment: Number(value.sports_equipment),
        sports_equipment_description:
          value.sports_equipment_description,

        billeting_quarters_assigned: Number(
          value.billeting_quarters_assigned,
        ),

        identified_billeting_quarters: Number(
          value.identified_billeting_quarters,
        ),

        identified_billeting_quarters_text:
          value.identified_billeting_quarters_text,
      })
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
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">
            Playing Venue Status
          </h3>
          <p className="text-sm text-muted-foreground">
            Update infrastructure, peripherals, and sports equipment readiness.
          </p>
        </div>

        <form.Field name="infrastructure">
          {(field) => (
            <Field>
              <FieldLabel>Infrastructure (%)</FieldLabel>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(Number(event.target.value))
                }
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="infrastructure_description">
          {(field) => (
            <Field>
              <FieldLabel>Infrastructure Description</FieldLabel>
              <Textarea
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter infrastructure status/details..."
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="peripherals">
          {(field) => (
            <Field>
              <FieldLabel>Peripherals (%)</FieldLabel>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(Number(event.target.value))
                }
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="peripherals_description">
          {(field) => (
            <Field>
              <FieldLabel>Peripherals Description</FieldLabel>
              <Textarea
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter peripherals status/details..."
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="sports_equipment">
          {(field) => (
            <Field>
              <FieldLabel>Sports Equipment (%)</FieldLabel>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(Number(event.target.value))
                }
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="sports_equipment_description">
          {(field) => (
            <Field>
              <FieldLabel>Sports Equipment Description</FieldLabel>
              <Textarea
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter sports equipment status/details..."
              />
            </Field>
          )}
        </form.Field>

        <Separator className="my-4" />

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">
            Billeting Quarters
          </h3>
          <p className="text-sm text-muted-foreground">
            Encode billeting quarter assignment and identification status.
          </p>
        </div>

        <form.Field name="billeting_quarters_assigned">
          {(field) => (
            <Field>
              <FieldLabel>Billeting Quarters Assigned</FieldLabel>
              <Input
                type="number"
                min={0}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(Number(event.target.value))
                }
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="identified_billeting_quarters">
          {(field) => (
            <Field>
              <FieldLabel>Identified Billeting Quarters</FieldLabel>
              <Input
                type="number"
                min={0}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(Number(event.target.value))
                }
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="identified_billeting_quarters_text">
          {(field) => (
            <Field>
              <FieldLabel>Identified Billeting Quarters Details</FieldLabel>
              <Textarea
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter identified billeting quarter details..."
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Status"}
        </Button>
      </div>
    </form>
  )
}
// src/features/billeting-quarters/components/BilletingQuarterForm.tsx
import { useForm } from "@tanstack/react-form"

import { Button } from "@/shared/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"

import type {
  BilletingQuarter,
  CreateBilletingQuarterPayload,
} from "@/features/billeting-quarters/types/billeting-quarters.types"

interface BilletingQuarterFormProps {
  initialData?: BilletingQuarter | null
  isSubmitting?: boolean
  onSubmit: (payload: CreateBilletingQuarterPayload) => Promise<void>
}

export function BilletingQuarterForm({
  initialData,
  isSubmitting,
  onSubmit,
}: BilletingQuarterFormProps) {
  const form = useForm({
    defaultValues: {
      Billeting_Quarters: initialData?.Billeting_Quarters ?? "",
      Delegation: initialData?.Delegation ?? "",
      Preparedness_Rating: initialData?.Preparedness_Rating ?? 0,
      expected_delegates: initialData?.expected_delegates ?? 0,
      isActive: initialData?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        Billeting_Quarters: value.Billeting_Quarters,
        Delegation: value.Delegation,
        Preparedness_Rating: Number(value.Preparedness_Rating),
        expected_delegates: Number(value.expected_delegates),
        isActive: value.isActive,
      })
    },
  })

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field name="Billeting_Quarters">
          {(field) => (
            <Field>
              <FieldLabel>Billeting Quarter</FieldLabel>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Example: Agusan del Sur NHS"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="Delegation">
          {(field) => (
            <Field>
              <FieldLabel>Delegation</FieldLabel>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Example: Region XIII Caraga"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="Preparedness_Rating">
          {(field) => (
            <Field>
              <FieldLabel>Preparedness Rating (%)</FieldLabel>
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

        <form.Field name="expected_delegates">
          {(field) => (
            <Field>
              <FieldLabel>Expected Delegates</FieldLabel>
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

        <form.Field name="isActive">
          {(field) => (
            <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div>
                <FieldLabel>Active</FieldLabel>
                <p className="text-sm text-muted-foreground">
                  Enable or disable this billeting quarter.
                </p>
              </div>

              <Switch
                checked={field.state.value}
                onCheckedChange={field.handleChange}
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Billeting Quarter"}
        </Button>
      </div>
    </form>
  )
}
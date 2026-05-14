// src/features/billeting-quarters/components/ArrivalForm.tsx
import { useForm } from "@tanstack/react-form"

import { Button } from "@/shared/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"

import type { BilletingQuarter } from "@/features/billeting-quarters/types/billeting-quarters.types"
import type { UpdateArrivalPayload } from "@/features/billeting-quarters/types/arrival.types"

interface ArrivalFormProps {
  billetingQuarter: BilletingQuarter
  isSubmitting?: boolean
  onSubmit: (payload: UpdateArrivalPayload) => Promise<void>
}

export function ArrivalForm({
  billetingQuarter,
  isSubmitting,
  onSubmit,
}: ArrivalFormProps) {
  const arrived = billetingQuarter.arrived

  const form = useForm({
    defaultValues: {
      athletes: arrived?.athletes ?? 0,
      coaches: arrived?.coaches ?? 0,
      advance_party: arrived?.advance_party ?? 0,
      trainers: arrived?.trainers ?? 0,
    },

    onSubmit: async ({ value }) => {
      await onSubmit({
        athletes: Number(value.athletes),
        coaches: Number(value.coaches),
        advance_party: Number(value.advance_party),
        trainers: Number(value.trainers),
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
      <div className="rounded-xl border bg-muted/40 p-4">
        <p className="text-sm text-muted-foreground">Billeting Quarter</p>
        <h3 className="text-lg font-bold">
          {billetingQuarter.Billeting_Quarters}
        </h3>
        <p className="text-sm text-muted-foreground">
          {billetingQuarter.Delegation}
        </p>
      </div>

      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <form.Field name="advance_party">
            {(field) => (
              <Field>
                <FieldLabel>Advance Party, TWG, Delegation Officials</FieldLabel>
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
              <form.Field name="coaches">
            {(field) => (
              <Field>
                <FieldLabel>Coaches, Assistant Coaches & Chaperones</FieldLabel>
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
          <form.Field name="trainers">
            {(field) => (
              <Field>
                <FieldLabel>Trainers</FieldLabel>
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
          <form.Field name="athletes">
            {(field) => (
              <Field>
                <FieldLabel>Athletes</FieldLabel>
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
        </div>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Arrival"}
        </Button>
      </div>
    </form>
  )
}
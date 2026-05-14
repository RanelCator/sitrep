// src/features/other-delegation/components/OtherDelegationForm.tsx
import { useForm } from "@tanstack/react-form"

import { Button } from "@/shared/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"

import type {
  CreateOtherDelegationPayload,
  OtherDelegation,
} from "@/features/other-delegation/types/other-delegation.types"

interface OtherDelegationFormProps {
  initialData?: OtherDelegation | null
  isSubmitting?: boolean
  onSubmit: (payload: CreateOtherDelegationPayload) => Promise<void>
}

export function OtherDelegationForm({
  initialData,
  isSubmitting,
  onSubmit,
}: OtherDelegationFormProps) {
  const form = useForm({
    defaultValues: {
      description: initialData?.description ?? "",
      expected_delegates: initialData?.expected_delegates ?? 0,
      arrived: initialData?.arrived ?? 0,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        description: value.description,
        expected_delegates: Number(value.expected_delegates),
        arrived: Number(value.arrived),
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
        <form.Field name="description">
          {(field) => (
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="e.g. Other delegation / technical officials"
              />
            </Field>
          )}
        </form.Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <form.Field name="arrived">
            {(field) => (
              <Field>
                <FieldLabel>Arrived</FieldLabel>
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
          {isSubmitting ? "Saving..." : "Save Other Delegation"}
        </Button>
      </div>
    </form>
  )
}
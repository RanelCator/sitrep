// src/features/current-situation/components/CommitteeForm.tsx
import { useForm } from "@tanstack/react-form"

import { Button } from "@/shared/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"

import type {
  Committee,
  CreateCommitteePayload,
} from "@/features/current-situation/types/current-situation.types"

interface CommitteeFormProps {
  initialData?: Committee | null
  isSubmitting?: boolean
  onSubmit: (payload: CreateCommitteePayload) => Promise<void>
}

export function CommitteeForm({
  initialData,
  isSubmitting,
  onSubmit,
}: CommitteeFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
    },

    onSubmit: async ({ value }) => {
      await onSubmit({
        name: value.name,
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
        <form.Field name="name">
          {(field) => (
            <Field>
              <FieldLabel>Committee</FieldLabel>

              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter committee name..."
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Committee"}
        </Button>
      </div>
    </form>
  )
}
// src/features/highlights/components/HighlightForm.tsx
import { useForm } from "@tanstack/react-form"

import { RichTextEditor } from "@/shared/components/editor/RichTextEditor"
import { Button } from "@/shared/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"

import type {
  CreateHighlightPayload,
  Highlight,
} from "@/features/highlights/types/highlights.types"

interface HighlightFormProps {
  initialData?: Highlight | null
  isSubmitting?: boolean
  onSubmit: (payload: CreateHighlightPayload) => Promise<void>
}

function toDateInputValue(value?: string) {
  if (!value) return new Date().toISOString().split("T")[0]

  return new Date(value).toISOString().split("T")[0]
}

export function HighlightForm({
  initialData,
  isSubmitting,
  onSubmit,
}: HighlightFormProps) {
  const form = useForm({
    defaultValues: {
      DateTimeEntered: toDateInputValue(initialData?.DateTimeEntered),
      description: initialData?.description ?? "",
    },

    onSubmit: async ({ value }) => {
      await onSubmit({
        DateTimeEntered: value.DateTimeEntered,
        description: value.description,
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
        <form.Field name="DateTimeEntered">
          {(field) => (
            <Field>
              <FieldLabel>Date Entered</FieldLabel>
              <Input
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </Field>
          )}
        </form.Field>

        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
  <span className="font-semibold">
    Note:
  </span>{" "}
  If a highlight entry already exists for the selected date,
  the existing record will be updated automatically.
</div>

        <form.Field name="description">
          {(field) => (
            <Field>
              <FieldLabel>Description</FieldLabel>
              <RichTextEditor
                value={field.state.value}
                onChange={field.handleChange}
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Highlight"}
        </Button>
      </div>
    </form>
  )
}
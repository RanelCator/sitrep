// src/features/other-information/components/OtherInformationForm.tsx
import { useForm } from "@tanstack/react-form"

import { Button } from "@/shared/components/ui/button"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"

import { RichTextEditor } from "@/shared/components/editor/RichTextEditor"

import type {
  CreateOtherInformationPayload,
  OtherInformation,
} from "@/features/other-information/types/other-information.types"

interface OtherInformationFormProps {
  initialData?: OtherInformation | null
  isSubmitting?: boolean

  onSubmit: (
    payload: CreateOtherInformationPayload,
  ) => Promise<void>
}

export function OtherInformationForm({
  initialData,
  isSubmitting,
  onSubmit,
}: OtherInformationFormProps) {
  const form = useForm({
    defaultValues: {
      description:
        initialData?.description ?? "",
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
        <form.Field name="description">
          {(field) => (
            <Field>
              <FieldLabel>
                Description
              </FieldLabel>

              <RichTextEditor
                value={field.state.value}
                onChange={field.handleChange}
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : "Save Information"}
        </Button>
      </div>
    </form>
  )
}
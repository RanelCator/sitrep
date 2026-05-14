// src/features/current-situation/components/AreaConcernForm.tsx
import { useForm } from "@tanstack/react-form"

import { Button } from "@/shared/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

import type {
  AreaConcern,
  Committee,
  CreateAreaConcernPayload,
} from "@/features/current-situation/types/current-situation.types"

interface AreaConcernFormProps {
  committees: Committee[]
  initialData?: AreaConcern | null
  isSubmitting?: boolean
  onSubmit: (payload: CreateAreaConcernPayload) => Promise<void>
}

export function AreaConcernForm({
  committees,
  initialData,
  isSubmitting,
  onSubmit,
}: AreaConcernFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      committeeId: initialData?.committeeId ?? "",
    },

    onSubmit: async ({ value }) => {
      await onSubmit({
        name: value.name,
        committeeId: value.committeeId,
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
        <form.Field name="committeeId">
          {(field) => (
            <Field>
              <FieldLabel>Committee</FieldLabel>

              <Select
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select committee" />
                </SelectTrigger>

                <SelectContent>
                  {committees.map((committee) => (
                    <SelectItem
                      key={committee._id}
                      value={committee._id}
                    >
                      {committee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>

        <form.Field name="name">
          {(field) => (
            <Field>
              <FieldLabel>Area of Concern</FieldLabel>

              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                placeholder="Enter area of concern..."
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Area Concern"}
        </Button>
      </div>
    </form>
  )
}
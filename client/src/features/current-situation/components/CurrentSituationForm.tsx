// src/features/current-situation/components/CurrentSituationForm.tsx
import { useMemo, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { Button } from "@/shared/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

import { RichTextEditor } from "@/shared/components/editor/RichTextEditor"

import type {
  AreaConcern,
  Committee,
  CreateCurrentSituationPayload,
  CurrentSituation,
} from "@/features/current-situation/types/current-situation.types"
import { Input } from "@/shared/components/ui/input"

interface CurrentSituationFormProps {
  committees: Committee[]
  areaConcerns: AreaConcern[]
  initialData?: CurrentSituation | null
  isSubmitting?: boolean
  onSubmit: (
    payload: CreateCurrentSituationPayload,
  ) => Promise<void>
}

function toDateInputValue(value?: string) {
  if (!value) return new Date().toISOString().split("T")[0]
  return new Date(value).toISOString().split("T")[0]
}

export function CurrentSituationForm({
  committees,
  areaConcerns,
  initialData,
  isSubmitting,
  onSubmit,
}: CurrentSituationFormProps) {
  const form = useForm({
  defaultValues: {
    DateTimeEntered: toDateInputValue(initialData?.DateTimeEntered),
    Committee: initialData?.Committee ?? "",
    area_concern: initialData?.area_concern ?? "",
    cuurent_situation: initialData?.cuurent_situation ?? "",
    issues_concerns: initialData?.issues_concerns ?? "",
    actions_undertaken: initialData?.actions_undertaken ?? "",
    recommendations: initialData?.recommendations ?? "",
  },

    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

const [selectedCommittee, setSelectedCommittee] = useState(
  initialData?.Committee ?? "",
)

  const filteredAreaConcerns = useMemo(() => {
    return areaConcerns.filter(
      (item) => item.committeeName === selectedCommittee,
    )
  }, [areaConcerns, selectedCommittee])

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
           <form.Field name="DateTimeEntered">
  {(field) => (
    <Field>
      <FieldLabel>Date Reported</FieldLabel>
      <Input
        type="date"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
    </Field>
  )}
</form.Field>
        </div>
       
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          <form.Field name="Committee">
            {(field) => (
              <Field>
                <FieldLabel>Committee</FieldLabel>

                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
  field.handleChange(value)
  setSelectedCommittee(value)
  form.setFieldValue("area_concern", "")
}}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select committee" />
                  </SelectTrigger>

                  <SelectContent>
                    {committees.map((committee) => (
                      <SelectItem
                        key={committee._id}
                        value={committee.name}
                      >
                        {committee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>

          <form.Field name="area_concern">
            {(field) => (
              <Field>
                <FieldLabel>Area of Concern</FieldLabel>

                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select area concern" />
                  </SelectTrigger>

                  <SelectContent>
                    {filteredAreaConcerns.map((item) => (
                      <SelectItem
                        key={item._id}
                        value={item.name}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>
        </div>

        <form.Field name="cuurent_situation">
          {(field) => (
            <Field>
              <FieldLabel>Current Situation</FieldLabel>

              <RichTextEditor
                value={field.state.value}
                onChange={field.handleChange}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="issues_concerns">
          {(field) => (
            <Field>
              <FieldLabel>Issues / Concerns</FieldLabel>

              <RichTextEditor
                value={field.state.value}
                onChange={field.handleChange}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="actions_undertaken">
          {(field) => (
            <Field>
              <FieldLabel>Actions Undertaken</FieldLabel>

              <RichTextEditor
                value={field.state.value}
                onChange={field.handleChange}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="recommendations">
          {(field) => (
            <Field>
              <FieldLabel>Recommendations</FieldLabel>

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
          {isSubmitting ? "Saving..." : "Save Current Situation"}
        </Button>
      </div>
    </form>
  )
}
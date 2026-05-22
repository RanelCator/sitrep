// src/features/patient-consultation-referral-form/components/PatientConsultationReferralForm.tsx

import { useForm } from "@tanstack/react-form"
import type { CheckedState } from "@radix-ui/react-checkbox"

import { Checkbox } from "@/shared/components/ui/checkbox"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { REGIONS } from "@/shared/constants/regions.constant"

import type {
  CreatePatientConsultationReferralFormPayload,
  PatientConsultationReferralFormtype,
} from "@/features/patient-consultation-referral-form/types/patient-consultation-referral-form.types"
import { authStore } from "@/features/auth/services/auth-store"

interface PatientConsultationReferralFormProps {
  initialData?: PatientConsultationReferralFormtype | null
  isSubmitting?: boolean
  readOnly?: boolean
  readOnlyFields?: string[]
  onSubmit: (payload: CreatePatientConsultationReferralFormPayload) => void
}

export function PatientConsultationReferralForm({
  initialData,
  isSubmitting,
  readOnly = false,
  readOnlyFields = [],
  onSubmit,
}: PatientConsultationReferralFormProps) {
  const form = useForm({
    defaultValues: {
      formDate:
        formatDateInput(initialData?.formDate) ||
        new Date().toISOString().slice(0, 10),
      delegationType: initialData?.delegationType ?? "",
      delegationTypeOther: initialData?.delegationTypeOther ?? "",
      region: initialData?.region ?? "",
      division: initialData?.division ?? "",
      addressAndContactNumber:
        initialData?.addressAndContactNumber ?? "",
      patientName: initialData?.patientName ?? "",
      birthdate: formatDateInput(initialData?.birthdate),
      ageSex: initialData?.ageSex ?? "",
      sportsEvent: initialData?.sportsEvent ?? "",
      natureOfIncident: initialData?.natureOfIncident ?? "",
      placeOfIncident: initialData?.placeOfIncident ?? "",
      incidentDateTime: formatDateTimeInput(initialData?.incidentDateTime),
      chiefComplaints: initialData?.chiefComplaints ?? "",
      peFindings: initialData?.peFindings ?? "",
      allergies: initialData?.allergies ?? "",
      bloodPressure: initialData?.bloodPressure ?? "",
      currentMedications: initialData?.currentMedications ?? "",
      pulseRate: initialData?.pulseRate ?? "",
      pastMedicalHistory: initialData?.pastMedicalHistory ?? "",
      respirationRate: initialData?.respirationRate ?? "",
      lastMealTaken: initialData?.lastMealTaken ?? "",
      temperature: initialData?.temperature ?? "",
      treatmentIntervention: initialData?.treatmentIntervention ?? "",
      impressionDiagnosis: initialData?.impressionDiagnosis ?? "",
      isTreated: initialData?.isTreated ?? false,
      isUnderObservation: initialData?.isUnderObservation ?? false,
      isReferred: initialData?.isReferred ?? false,
      remarks: initialData?.remarks ?? "",
      nodSignature: initialData?.nodSignature ?? "",
      physicianSignature: initialData?.physicianSignature ?? "",
    },
    onSubmit: async ({ value }) => {
      if (readOnly) return

      if (!value.formDate) {
        alert("Please enter Date.")
        return
      }

      if (!value.delegationType) {
        alert("Please select Delegation of Patient.")
        return
      }

      if (!value.patientName.trim()) {
        alert("Please enter Name of Patient.")
        return
      }

      onSubmit({
        ...value,
        delegationTypeOther:
          value.delegationType === "Others"
            ? value.delegationTypeOther
            : "",
      })
    },
  })

  const isFieldReadOnly = (name: string) =>
    readOnly || readOnlyFields.includes(name)

const regionID = authStore.user?.regionID

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()

        if (!readOnly) {
          form.handleSubmit()
        }
      }}
    >
      <div className="rounded-lg border text-sm">
        <div className="border-b p-3 sm:flex sm:justify-end">
          <div className="w-full sm:w-48">
            <div className="font-semibold">
              Date: <RequiredMark />
            </div>
            <div className="text-xs italic">(mm/dd/yyyy)</div>

            <FormInput
              form={form}
              name="formDate"
              type="date"
              readOnly={isFieldReadOnly("formDate")}
            />
          </div>
        </div>

        <FormSection title="I. General Information">
          <div className="grid gap-0 lg:grid-cols-2">
            <FormCell>
              <div className="space-y-3">
                <div>
                  Delegation of Patient{" "}
                  <span className="italic">(Please tick one):</span>{" "}
                  <RequiredMark />
                </div>

                <form.Field name="delegationType">
                  {(field: any) => (
                    <div className="space-y-1">
                      {[
                        "Athlete",
                        "NTWG",
                        "RTWG",
                        "Coach",
                        "Chaperon",
                        "Utility/Driver",
                      ].map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="radio"
                            name="delegationType"
                            disabled={isFieldReadOnly("delegationType")}
                            checked={field.state.value === item}
                            onChange={() => field.handleChange(item)}
                          />
                          {item}
                        </label>
                      ))}

                      <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="delegationType"
                            disabled={isFieldReadOnly("delegationType")}
                            checked={field.state.value === "Others"}
                            onChange={() => field.handleChange("Others")}
                          />
                          Others:
                        </label>

                        <FormInput
                          form={form}
                          name="delegationTypeOther"
                          disabled={
                            field.state.value !== "Others" ||
                            isFieldReadOnly("delegationTypeOther")
                          }
                          readOnly={isFieldReadOnly("delegationTypeOther")}
                        />

                        <span className="text-xs italic">
                          (please specify)
                        </span>
                      </div>
                    </div>
                  )}
                </form.Field>
              </div>
            </FormCell>

            <FormCell>
              <div className="space-y-4">
                <div className="italic">
                  If patient is an athlete/delegation,
                </div>

<div>
  <div>
    Region{" "}
    <span className="text-xs italic">
      (N/A if from CO):
    </span>
  </div>

  <form.Field name="region">
    {(field: any) => (
      <select
        value={field.state.value || ""}
        onChange={(e) =>
          field.handleChange(e.target.value)
        }
        disabled={isFieldReadOnly("region")}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">
          Select Region
        </option>

        {REGIONS
          .filter((region) => {
            // show all if undefined or 0
            console.log("User regionID:", regionID)
            if (
              !regionID ||
              regionID === 0
            ) {
              return true
            }

            // show only matching region
            return (
              region.id ===
              Number(regionID)
            )
          })
          .map((region) => (
            <option
              key={region.id}
              value={region.regionName}
            >
              {region.regionName}
            </option>
          ))}
      </select>
    )}
  </form.Field>
</div>

                <div>
                  <div>
                    Division{" "}
                    <span className="text-xs italic">
                      (N/A if from CO and Region):
                    </span>
                  </div>
                  <FormInput
                    form={form}
                    name="division"
                    readOnly={isFieldReadOnly("division")}
                  />
                </div>

                <div>
                  <div>Complete Address and Contact Number:</div>
                  <div className="text-xs italic">
                    (for Surveillance Purposes):
                  </div>
                  <FormTextarea
                    form={form}
                    name="addressAndContactNumber"
                    readOnly={isFieldReadOnly("addressAndContactNumber")}
                  />
                </div>
              </div>
            </FormCell>
          </div>

          <div className="grid gap-0 lg:grid-cols-[2fr_1fr_1fr]">
            <FormCell>
              <div>
                Name of Patient{" "}
                <span className="text-xs italic">
                  (Last Name, First Name, MI):
                </span>{" "}
                <RequiredMark />
              </div>
              <FormInput
                form={form}
                name="patientName"
                readOnly={isFieldReadOnly("patientName")}
              />
            </FormCell>

            <FormCell>
              <div>
                Birthdate{" "}
                <span className="text-xs italic">(mm/dd/yyyy):</span>
              </div>
              <FormInput
                form={form}
                name="birthdate"
                type="date"
                readOnly={isFieldReadOnly("birthdate")}
              />
            </FormCell>

            <FormCell>
              <div>Age/Sex:</div>
              <FormInput
                form={form}
                name="ageSex"
                readOnly={isFieldReadOnly("ageSex")}
              />
            </FormCell>
          </div>

          <FormCell>
            <div>
              Sports Event{" "}
              <span className="text-xs italic">
                (for athletes and coaches only):
              </span>
            </div>
            <FormInput
              form={form}
              name="sportsEvent"
              readOnly={isFieldReadOnly("sportsEvent")}
            />
          </FormCell>
        </FormSection>

        <div className="grid gap-0 lg:grid-cols-2">
          <FormSection title="II. Details of the Incident">
            <FormCell>
              <div>Nature of Incident:</div>
              <FormTextarea
                form={form}
                name="natureOfIncident"
                readOnly={isFieldReadOnly("natureOfIncident")}
              />
            </FormCell>

            <FormCell>
              <div>Place of Incident:</div>
              <FormTextarea
                form={form}
                name="placeOfIncident"
                readOnly={isFieldReadOnly("placeOfIncident")}
              />
            </FormCell>

            <FormCell>
              <div>Date and Time of Incident:</div>
              <FormInput
                form={form}
                name="incidentDateTime"
                type="datetime-local"
                readOnly={isFieldReadOnly("incidentDateTime")}
              />
            </FormCell>
          </FormSection>

          <FormSection title="III. General Assessment and Findings">
            <FormCell>
              <div>Chief Complaint/s:</div>
              <FormTextarea
                form={form}
                name="chiefComplaints"
                readOnly={isFieldReadOnly("chiefComplaints")}
              />
            </FormCell>

            <FormCell className="lg:min-h-[178px]">
              <div>PE Finding/s:</div>
              <FormTextarea
                form={form}
                name="peFindings"
                readOnly={isFieldReadOnly("peFindings")}
              />
            </FormCell>
          </FormSection>
        </div>

        <FormSection title="IV. Other Findings">
          {[
            ["Allergies", "allergies", "Blood Pressure", "bloodPressure"],
            [
              "Current Medication/s",
              "currentMedications",
              "Pulse Rate",
              "pulseRate",
            ],
            [
              "Past Medical History",
              "pastMedicalHistory",
              "Respiration Rate",
              "respirationRate",
            ],
            [
              "Last Meal Taken",
              "lastMealTaken",
              "Temperature",
              "temperature",
            ],
          ].map(([leftLabel, leftName, rightLabel, rightName]) => (
            <div key={leftName} className="grid gap-0 lg:grid-cols-2">
              <FormCell>
                <div>{leftLabel}:</div>
                <FormInput
                  form={form}
                  name={leftName}
                  readOnly={isFieldReadOnly(leftName)}
                />
              </FormCell>

              <FormCell>
                <div>{rightLabel}:</div>
                <FormInput
                  form={form}
                  name={rightName}
                  readOnly={isFieldReadOnly(rightName)}
                />
              </FormCell>
            </div>
          ))}
        </FormSection>

        <FormSection title="V. Treatment/Intervention">
          <FormCell>
            <FormTextarea
              form={form}
              name="treatmentIntervention"
              readOnly={isFieldReadOnly("treatmentIntervention")}
            />
          </FormCell>
        </FormSection>

        <FormSection title="VI. Impression/Diagnosis">
          <FormCell>
            <FormTextarea
              form={form}
              name="impressionDiagnosis"
              readOnly={isFieldReadOnly("impressionDiagnosis")}
            />
          </FormCell>
        </FormSection>

        <FormSection title="VII. Remarks/Disposition">
          <div className="grid gap-0 lg:grid-cols-2">
            <FormCell>
              <div className="space-y-2">
                <FormCheckbox
                  form={form}
                  name="isTreated"
                  label="Treated"
                  readOnly={isFieldReadOnly("isTreated")}
                />

                <FormCheckbox
                  form={form}
                  name="isUnderObservation"
                  label="Under Observation"
                  readOnly={isFieldReadOnly("isUnderObservation")}
                />

                <FormCheckbox
                  form={form}
                  name="isReferred"
                  label="Referred"
                  readOnly={isFieldReadOnly("isReferred")}
                />
              </div>
            </FormCell>

            <FormCell>
              <div>Remarks:</div>
              <FormTextarea
                form={form}
                name="remarks"
                readOnly={isFieldReadOnly("remarks")}
              />
            </FormCell>
          </div>
        </FormSection>

        <div className="grid gap-0 lg:grid-cols-2">
          <FormCell>
            <div className="font-medium">NOD/Signature</div>
            <FormInput
              form={form}
              name="nodSignature"
              placeholder="Enter full name"
              readOnly={isFieldReadOnly("nodSignature")}
            />
          </FormCell>

          <FormCell>
            <div className="font-medium">Physician/Signature</div>
            <FormInput
              form={form}
              name="physicianSignature"
              placeholder="Enter full name"
              readOnly={isFieldReadOnly("physicianSignature")}
            />
          </FormCell>
        </div>
      </div>

      {!readOnly && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="ml-auto block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Form"
              : "Save Form"}
        </button>
      )}
    </form>
  )
}

function RequiredMark() {
  return <span className="text-destructive">*</span>
}

function FormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b last:border-b-0">
      <div className="border-b bg-muted px-3 py-2 font-bold uppercase">
        {title}
      </div>
      {children}
    </section>
  )
}

function FormCell({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`border-b p-3 last:border-b-0 lg:border-r lg:last:border-r-0 ${className}`}
    >
      {children}
    </div>
  )
}

interface FormInputProps {
  form: any
  name: string
  label?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
}

function FormInput({
  form,
  name,
  label,
  type = "text",
  placeholder,
  disabled,
  readOnly,
}: FormInputProps) {
  return (
    <form.Field name={name}>
      {(field: any) => (
        <div className="space-y-2">
          {label ? <Label>{label}</Label> : null}

          <Input
            type={type}
            value={field.state.value ?? ""}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className={
              readOnly
                ? "bg-muted text-black opacity-100"
                : ""
            }
            onChange={(event) =>
              field.handleChange(event.target.value)
            }
          />
        </div>
      )}
    </form.Field>
  )
}

interface FormTextareaProps {
  form: any
  name: string
  label?: string
  readOnly?: boolean
}

function FormTextarea({
  form,
  name,
  label,
  readOnly,
}: FormTextareaProps) {
  return (
    <form.Field name={name}>
      {(field: any) => (
        <div className="space-y-2">
          {label ? (
            <Label>{label}</Label>
          ) : null}

          <Textarea
            value={
              field.state.value ??
              ""
            }
            readOnly={
              readOnly
            }
            className={
              readOnly
                ? "border-slate-300 bg-slate-50 text-black opacity-100"
                : ""
            }
            onChange={(
              event,
            ) =>
              field.handleChange(
                event.target.value,
              )
            }
          />
        </div>
      )}
    </form.Field>
  )
}

interface FormCheckboxProps {
  form: any
  name: string
  label: string
  readOnly?: boolean
}

function FormCheckbox({
  form,
  name,
  label,
  readOnly,
}: FormCheckboxProps) {
  return (
    <form.Field name={name}>
      {(field: any) => (
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={field.state.value}
            disabled={readOnly}
            onCheckedChange={(checked: CheckedState) =>
              field.handleChange(Boolean(checked))
            }
          />

          {label}
        </label>
      )}
    </form.Field>
  )
}

function formatDateInput(value?: string | Date) {
  if (!value) return ""

  return new Date(value).toISOString().slice(0, 10)
}

function formatDateTimeInput(value?: string | Date) {
  if (!value) return ""

  return new Date(value).toISOString().slice(0, 16)
}
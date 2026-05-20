// src/features/patient-consultation-referral-form/components/PatientConsultationReferralFormPrint.tsx

import type {
  PatientConsultationReferralFormtype,
} from "@/features/patient-consultation-referral-form/types/patient-consultation-referral-form.types"

interface Props {
  data: PatientConsultationReferralFormtype
}

export function PatientConsultationReferralFormPrint({ data }: Props) {
  return (
    <div className="print-page mx-auto w-[210mm] h-[297mm] overflow-hidden bg-white p-[8mm] text-[10px] text-black">
      <div className="print-form h-full border border-[#b8ad7a] p-4">
        <div className="mb-4 text-center">
          {/* KEEP YOUR EXISTING HEADER HERE */}
          <div className="mx-auto mb-2 h-px w-[82%] bg-black" />
          <h1 className="text-[16px] font-bold">
            PATIENT CONSULTATION/REFERRAL FORM
          </h1>
        </div>

        <div className="border border-black">
          <div className="grid grid-cols-[1fr_110px] border-b border-black">
            <div />
            <div className="border-l border-black px-1 py-1 text-right">
              <div>Date:</div>
              <div className="text-[10px] italic">(mm/dd/yyyy)</div>
              <div>{formatDate(data.formDate)}</div>
            </div>
          </div>

          <SectionTitle title="I. GENERAL INFORMATION" />

          <div className="grid grid-cols-2 border-b border-black">
            <div className="border-r border-black p-2">
              <p>
                Delegation of Patient{" "}
                <span className="text-[10px] italic">(Please tick one):</span>
              </p>

              <div className="mt-2 leading-[17px]">
                {[
                  "Athlete",
                  "NTWG",
                  "RTWG",
                  "Coach",
                  "Chaperon",
                  "Utility/Driver",
                ].map((item) => (
                  <p key={item}>
                    [{data.delegationType === item ? "x" : " "}] {item}
                  </p>
                ))}

                <p>
                  [{data.delegationType === "Others" ? "x" : " "}] Others:{" "}
                  <span className="inline-block min-w-[140px] border-b border-black">
                    {data.delegationTypeOther || ""}
                  </span>{" "}
                  <span className="text-[10px] italic">(please specify)</span>
                </p>
              </div>
            </div>

            <div className="p-2">
              <p className="text-[10px] italic">
                If patient is an athlete/delegation,
              </p>

              <FieldLine
                label="Region"
                note="(N/A if from CO):"
                value={data.region}
              />

              <FieldLine
                label="Division"
                note="(N/A if from CO and Region):"
                value={data.division}
              />

              <div className="mt-5">
                <p>Complete Address and Contact Number:</p>
                <p className="text-[10px] italic">
                  (for Surveillance Purposes):
                </p>
                <div className="min-h-[34px] whitespace-pre-wrap">
                  {data.addressAndContactNumber || ""}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[2fr_1.1fr_.6fr] border-b border-black">
            <Cell>
              <LabelValue
                label="Name of Patient"
                note="(Last Name, First Name, MI):"
                value={data.patientName}
              />
            </Cell>

            <Cell>
              <LabelValue
                label="Birthdate"
                note="(mm/dd/yyyy):"
                value={formatDate(data.birthdate)}
              />
            </Cell>

            <Cell noRight>
              <LabelValue label="Age/Sex:" value={data.ageSex} />
            </Cell>
          </div>

          <div className="border-b border-black p-2">
            <LabelValue
              label="Sports Event"
              note="(for athletes and coaches only):"
              value={data.sportsEvent}
            />
          </div>

          <div className="grid grid-cols-2 border-b border-black">
            <div className="border-r border-black">
              <SectionTitle title="II. DETAILS OF THE INCIDENT" />
              <BoxLine label="Nature of Incident:" value={data.natureOfIncident} />
              <BoxLine label="Place of Incident:" value={data.placeOfIncident} />
              <BoxLine
                label="Date and Time of Incident:"
                value={formatDateTime(data.incidentDateTime)}
                last
              />
            </div>

            <div>
              <SectionTitle title="III. GENERAL ASSESSMENT AND FINDINGS" />
              <div className="min-h-[62px] border-b border-black p-2">
                <p>Chief Complaint/s:</p>
                <p className="whitespace-pre-wrap">{data.chiefComplaints || ""}</p>
              </div>
              <div className="min-h-[76px] p-2">
                <p>PE Finding/s:</p>
                <p className="whitespace-pre-wrap">{data.peFindings || ""}</p>
              </div>
            </div>
          </div>

          <SectionTitle title="IV. OTHER FINDINGS" />

          <TwoColLine
            leftLabel="Allergies:"
            leftValue={data.allergies}
            rightLabel="Blood Pressure:"
            rightValue={data.bloodPressure}
          />
          <TwoColLine
            leftLabel="Current Medication/s:"
            leftValue={data.currentMedications}
            rightLabel="Pulse Rate:"
            rightValue={data.pulseRate}
          />
          <TwoColLine
            leftLabel="Past Medical History:"
            leftValue={data.pastMedicalHistory}
            rightLabel="Respiration Rate:"
            rightValue={data.respirationRate}
          />
          <TwoColLine
            leftLabel="Last Meal Taken:"
            leftValue={data.lastMealTaken}
            rightLabel="Temperature:"
            rightValue={data.temperature}
          />

          <SectionTitle title="V. TREATMENT/INTERVENTION" />
          <LargeArea value={data.treatmentIntervention} height="min-h-[42px]" />

          <SectionTitle title="VI. IMPRESSION/DIAGNOSIS" />
          <LargeArea value={data.impressionDiagnosis} height="min-h-[42px]" />

          <SectionTitle title="VII. REMARKS/DISPOSITION" />

          <div className="grid grid-cols-[1.1fr_.9fr] border-b border-black">
            <div className="border-r border-black p-2 leading-[18px]">
              <p>[{data.isTreated ? "x" : " "}] Treated</p>
              <p>[{data.isUnderObservation ? "x" : " "}] Under Observation</p>
              <p>[{data.isReferred ? "x" : " "}] Referred</p>
            </div>

            <div className="p-2">
              <p>Remarks:</p>
              <p className="whitespace-pre-wrap">{data.remarks || ""}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-black">
            <div className="min-h-[34px] border-r border-black p-2 text-center">
              {data.nodSignature || ""}
            </div>
            <div className="min-h-[34px] p-2 text-center">
              {data.physicianSignature || ""}
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="border-r border-black py-1 text-center">
              NOD/Signature
            </div>
            <div className="py-1 text-center">Physician/Signature</div>
          </div>
        </div>

        <p className="mt-4 text-[#7aa7df]">pg. 1</p>
      </div>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="border-b border-black px-2 py-1 font-bold">
      {title}
    </div>
  )
}

function Cell({
  children,
  noRight,
}: {
  children: React.ReactNode
  noRight?: boolean
}) {
  return (
    <div className={noRight ? "p-2" : "border-r border-black p-2"}>
      {children}
    </div>
  )
}

function LabelValue({
  label,
  note,
  value,
}: {
  label: string
  note?: string
  value?: string
}) {
  return (
    <div>
      <span>{label} </span>
      {note && <span className="text-[10px] italic">{note}</span>}
      <div className="mt-1 min-h-[24px] whitespace-pre-wrap">
        {value || ""}
      </div>
    </div>
  )
}

function FieldLine({
  label,
  note,
  value,
}: {
  label: string
  note?: string
  value?: string
}) {
  return (
    <div className="mt-4">
      <span>{label} </span>
      {note && <span className="text-[10px] italic">{note}</span>}
      <div className="min-h-[18px]">{value || ""}</div>
    </div>
  )
}

function BoxLine({
  label,
  value,
  last,
}: {
  label: string
  value?: string
  last?: boolean
}) {
  return (
    <div className={last ? "min-h-[38px] p-2" : "min-h-[38px] border-b border-black p-2"}>
      <p>{label}</p>
      <p className="whitespace-pre-wrap">{value || ""}</p>
    </div>
  )
}

function TwoColLine({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string
  leftValue?: string
  rightLabel: string
  rightValue?: string
}) {
  return (
    <div className="grid grid-cols-2 border-b border-black">
      <div className="border-r border-black px-2 py-[2px]">
        {leftLabel} {leftValue || ""}
      </div>
      <div className="px-2 py-[2px]">
        {rightLabel} {rightValue || ""}
      </div>
    </div>
  )
}

function LargeArea({
  value,
  height,
}: {
  value?: string
  height: string
}) {
  return (
    <div className={`${height} border-b border-black p-2 whitespace-pre-wrap`}>
      {value || ""}
    </div>
  )
}

function formatDate(value?: string) {
  if (!value) return ""

  return new Date(value).toLocaleDateString()
}

function formatDateTime(value?: string) {
  if (!value) return ""

  return new Date(value).toLocaleString()
}
// src/features/patient-consultation-referral-form/pages/PatientConsultationReferralFormPrintPage.tsx

import { useEffect } from "react"

import { useParams } from "@tanstack/react-router"

import { Button } from "@/shared/components/ui/button"

import { usePatientConsultationReferralFormByIdQuery } from "@/features/patient-consultation-referral-form/hooks/usePatientConsultationReferralFormQuery"

import { PatientConsultationReferralFormPrint } from "@/features/patient-consultation-referral-form/components/PatientConsultationReferralFormPrint"

export function PatientConsultationReferralFormPrintPage() {
  const { id } = useParams({
    from:
      "/_authenticated/patient-consultation-referral-form/$id/print",
  })

  const query =
    usePatientConsultationReferralFormByIdQuery(
      id,
    )

  const item =
    query.data?.data

  useEffect(() => {
    if (!item) return

    const timeout =
      setTimeout(() => {
        window.print()
      }, 500)

    return () =>
      clearTimeout(timeout)
  }, [item])

  if (query.isLoading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    )
  }

  if (!item) {
    return (
      <div className="p-10 text-center">
        Record not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="print:hidden flex justify-end border-b p-4">
        <Button
          onClick={() =>
            window.print()
          }
        >
          Print
        </Button>
      </div>

      <PatientConsultationReferralFormPrint
        data={item}
      />
    </div>
  )
}
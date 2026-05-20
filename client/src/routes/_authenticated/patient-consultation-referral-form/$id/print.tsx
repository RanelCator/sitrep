import { PatientConsultationReferralFormPrintPage } from '@/features/patient-consultation-referral-form/pages/PatientConsultationReferralFormPrintPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/patient-consultation-referral-form/$id/print',
)({
  component: PatientConsultationReferralFormPrintPage,
})

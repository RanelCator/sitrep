import { createFileRoute } from '@tanstack/react-router'

import { PatientConsultationReferralFormPage } from "@/features/patient-consultation-referral-form/pages/PatientConsultationReferralFormPage"


export const Route = createFileRoute(
  '/_authenticated/patient-consultation-referral-form/',
)({
  component:
    PatientConsultationReferralFormPage,
})
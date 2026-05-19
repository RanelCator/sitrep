// src/routes/scan.tsx

import { createFileRoute } from "@tanstack/react-router"

import { PatientConsultationReferralFormScanPage } from "@/features/patient-consultation-referral-form/pages/PatientConsultationReferralFormScanPage"

export const Route = createFileRoute("/(public)/scan")({
  component: PatientConsultationReferralFormScanPage,
})
import { useQuery } from "@tanstack/react-query"

import { fetchPatientConsultationReferralForms } from "@/features/patient-consultation-referral-form/services/patient-consultation-referral-form.service"

import type { FetchPatientConsultationReferralFormParams } from "@/features/patient-consultation-referral-form/types/patient-consultation-referral-form.types"

export const patientConsultationReferralFormKeys = {
  all: ["patient-consultation-referral-forms"] as const,
  list: (params: FetchPatientConsultationReferralFormParams) =>
    [...patientConsultationReferralFormKeys.all, "list", params] as const,
}

export function usePatientConsultationReferralFormQuery(
  params: FetchPatientConsultationReferralFormParams,
) {
  return useQuery({
    queryKey: patientConsultationReferralFormKeys.list(params),
    queryFn: () => fetchPatientConsultationReferralForms(params),
  })
}
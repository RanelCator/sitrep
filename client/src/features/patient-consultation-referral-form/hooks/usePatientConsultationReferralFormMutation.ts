import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createPatientConsultationReferralForm,
  deletePatientConsultationReferralForm,
  updatePatientConsultationReferralForm,
} from "@/features/patient-consultation-referral-form/services/patient-consultation-referral-form.service"

import { patientConsultationReferralFormKeys } from "@/features/patient-consultation-referral-form/hooks/usePatientConsultationReferralFormQuery"

export function useCreatePatientConsultationReferralFormMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPatientConsultationReferralForm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: patientConsultationReferralFormKeys.all,
      })
    },
  })
}

export function useUpdatePatientConsultationReferralFormMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePatientConsultationReferralForm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: patientConsultationReferralFormKeys.all,
      })
    },
  })
}

export function useDeletePatientConsultationReferralFormMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePatientConsultationReferralForm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: patientConsultationReferralFormKeys.all,
      })
    },
  })
}
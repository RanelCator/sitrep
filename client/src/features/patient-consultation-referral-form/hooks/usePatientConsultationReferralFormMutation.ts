import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createPatientConsultationReferralForm,
  deletePatientConsultationReferralForm,
  updatePatientConsultationReferralForm,
} from "@/features/patient-consultation-referral-form/services/patient-consultation-referral-form.service"

import { patientConsultationReferralFormKeys } from "@/features/patient-consultation-referral-form/hooks/usePatientConsultationReferralFormQuery"
import { api } from "@/shared/lib/api"

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

export function useTagEncodedPatientConsultationReferralFormMutation() {
  return useMutation({
    mutationFn: async ({
      id,
      isEncoded,
    }: {
      id: string
      isEncoded: boolean
    }) => {
      const response = await api.patch(
        `/patient-consultation-referral-forms/${id}/encoded`,
        {
          isEncoded,
        },
      )
      return response.data
    },
  })
}
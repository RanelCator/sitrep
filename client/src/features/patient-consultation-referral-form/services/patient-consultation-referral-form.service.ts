import { api } from "@/shared/lib/api"

import type {
  CreatePatientConsultationReferralFormPayload,
  FetchPatientConsultationReferralFormParams,
  PatientConsultationReferralFormListResponse,
  PatientConsultationReferralFormResponse,
  UpdatePatientConsultationReferralFormPayload,
} from "@/features/patient-consultation-referral-form/types/patient-consultation-referral-form.types"

const BASE_URL = "/patient-consultation-referral-forms"

export async function fetchPatientConsultationReferralForms(
  params: FetchPatientConsultationReferralFormParams,
) {
  const response =
    await api.get<PatientConsultationReferralFormListResponse>(
      BASE_URL,
      { params },
    )

  return response.data
}

export async function createPatientConsultationReferralForm(
  payload: CreatePatientConsultationReferralFormPayload,
) {
  const response =
    await api.post<PatientConsultationReferralFormResponse>(
      BASE_URL,
      payload,
    )

  return response.data
}

export async function updatePatientConsultationReferralForm({
  id,
  payload,
}: {
  id: string
  payload: UpdatePatientConsultationReferralFormPayload
}) {
  const response =
    await api.patch<PatientConsultationReferralFormResponse>(
      `${BASE_URL}/${id}`,
      payload,
    )

  return response.data
}

export async function deletePatientConsultationReferralForm(
  id: string,
) {
  const response =
    await api.delete<PatientConsultationReferralFormResponse>(
      `${BASE_URL}/${id}`,
    )

  return response.data
}

export async function fetchPatientPlayerById(
  id: string,
) {
  const response =
    await api.get(
      `/patient-consultation-referral-forms/players/${id}`,
    )

  return response.data
}
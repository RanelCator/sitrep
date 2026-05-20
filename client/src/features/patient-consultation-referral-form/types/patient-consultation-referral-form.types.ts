export interface PatientConsultationReferralFormtype {
  _id: string
  formDate: string

  delegationType: string
  delegationTypeOther?: string

  region?: string
  division?: string
  addressAndContactNumber?: string

  patientName: string
  birthdate?: string
  ageSex?: string
  sportsEvent?: string

  natureOfIncident?: string
  placeOfIncident?: string
  incidentDateTime?: string

  chiefComplaints?: string
  peFindings?: string

  allergies?: string
  bloodPressure?: string
  currentMedications?: string
  pulseRate?: string
  pastMedicalHistory?: string
  respirationRate?: string
  lastMealTaken?: string
  temperature?: string

  treatmentIntervention?: string
  impressionDiagnosis?: string

  isTreated?: boolean
  isUnderObservation?: boolean
  isReferred?: boolean

  remarks?: string
  nodSignature?: string
  physicianSignature?: string

  isEncoded?: boolean

  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePatientConsultationReferralFormPayload {
  formDate: string
  delegationType: string
  delegationTypeOther?: string

  region?: string
  division?: string
  addressAndContactNumber?: string

  patientName: string
  birthdate?: string
  ageSex?: string
  sportsEvent?: string

  natureOfIncident?: string
  placeOfIncident?: string
  incidentDateTime?: string

  chiefComplaints?: string
  peFindings?: string

  allergies?: string
  bloodPressure?: string
  currentMedications?: string
  pulseRate?: string
  pastMedicalHistory?: string
  respirationRate?: string
  lastMealTaken?: string
  temperature?: string

  treatmentIntervention?: string
  impressionDiagnosis?: string

  isTreated?: boolean
  isUnderObservation?: boolean
  isReferred?: boolean

  remarks?: string
  nodSignature?: string
  physicianSignature?: string

  isEncoded?: boolean
}

export type UpdatePatientConsultationReferralFormPayload =
  Partial<CreatePatientConsultationReferralFormPayload>

export interface FetchPatientConsultationReferralFormParams {
  page?: number
  limit?: number
  search?: string
}

export interface PatientConsultationReferralFormListResponse {
  success: boolean
  message: string
  data: PatientConsultationReferralFormtype[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PatientConsultationReferralFormResponse {
  success: boolean
  message: string
  data: PatientConsultationReferralFormtype
}
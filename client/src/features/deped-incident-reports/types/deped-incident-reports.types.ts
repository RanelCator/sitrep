export type DepedIncidentReport = {
  _id: string
  email: string
  reporterName: string
  designationRole: string
  mobileNumber: string
  agencyOfficeRegion: string

  incidentType: string
  incidentTypeOther?: string

  date: string
  time: string

  location: string
  locationOther?: string

  area: string
  areaOther?: string

  briefDescription: string
  immediateActionsTaken: string

  currentStatus: string
  remarks: string

  createdAt: string
  updatedAt: string
}

export type CreateDepedIncidentReportInput = {
  email: string
  reporterName: string
  designationRole: string
  mobileNumber: string
  agencyOfficeRegion: string

  incidentType: string
  incidentTypeOther?: string

  date: string
  time: string

  location: string
  locationOther?: string

  area: string
  areaOther?: string

  briefDescription: string
  immediateActionsTaken: string

  currentStatus: string
  remarks: string
}

export type UpdateDepedIncidentReportInput =
  Partial<CreateDepedIncidentReportInput>

export type DepedIncidentReportsResponse = {
  success: boolean
  message: string
  data: {
    items: DepedIncidentReport[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}
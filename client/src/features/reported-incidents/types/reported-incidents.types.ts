// src/features/reported-incidents/types/reported-incidents.types.ts

export interface ReportedIncident {
  _id: string
  Date: string
  Time: string
  venue_location: string
  Incident: string
  persons_involved: string
  initial_action_taken: string
  current_status: string
  Remarks?: string
  DateTimeEntered?: string
  AddedBy?: {
    name: string
    username: string
    role: string
  }
  createdAt: string
  updatedAt: string
}

export interface ReportedIncidentsResponse {
  success: boolean
  message: string
  data: ReportedIncident[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateReportedIncidentPayload {
  Date: string
  Time: string
  venue_location: string
  Incident: string
  persons_involved: string
  initial_action_taken: string
  current_status: string
  Remarks?: string
}
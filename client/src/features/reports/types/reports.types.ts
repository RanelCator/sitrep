// src/features/reports/types/reports.types.ts

export interface GeneratedReport {
  _id: string

  entryDate: string

  data: Record<string, any>

  createdAt: string
  updatedAt: string
}

export interface GeneratedReportsResponse {
  success: boolean
  message: string

  data: GeneratedReport[]

  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SingleGeneratedReportResponse {
  success: boolean
  message: string
  data: GeneratedReport
}

export interface GenerateDailyReportPayload {
  ReportDate: string
}
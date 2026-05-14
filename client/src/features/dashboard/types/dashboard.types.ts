// src/features/dashboard/types/dashboard.types.ts

import type { Highlight } from "@/features/highlights/types/highlights.types"

export interface DashboardSummary {
  reportDate: string

  expectedDelegates: number
  totalArrived: number
  remainingDelegates: number

  overallArrivalRate: number

  highestArrivalRate: {
    region: string
    rate: number
  }

  billetingQuartersAssigned: number

  totalIdentifiedBilletingQuarters: number

  preparednessAverage: number

  venueStatus: {
    infrastructure: number
    peripherals: number
    sports_equipment: number
  }

  latestHighlights: Highlight[]
}

export interface DashboardSummaryResponse {
  success: boolean
  message: string
  data: DashboardSummary
}
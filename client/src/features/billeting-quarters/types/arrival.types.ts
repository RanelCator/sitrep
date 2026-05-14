// src/features/billeting-quarters/types/arrival.types.ts

export interface ArrivalData {
  DateTimeEntered: string
  athletes: number
  coaches: number
  advance_party: number
  trainers: number
}

export interface UpdateArrivalPayload {
  DateTimeEntered?: string
  athletes: number
  coaches: number
  advance_party: number
  trainers: number
}
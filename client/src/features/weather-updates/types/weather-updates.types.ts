export const WEATHER_WARNING_LEVELS = {
  LOW: "low",
  MODERATE: "moderate",
  HIGH: "high",
  SEVERE: "severe",
} as const

export type WeatherWarningLevel =
  (typeof WEATHER_WARNING_LEVELS)[keyof typeof WEATHER_WARNING_LEVELS]

export type WeatherUpdate = {
  _id: string
  place: string
  date: string
  temperature: string
  warningLevel: WeatherWarningLevel
  description?: string
  createdAt: string
  updatedAt: string
}

export type CreateWeatherUpdateInput = {
  place: string
  date: string
  temperature: string
  warningLevel: WeatherWarningLevel
  description?: string
}

export type UpdateWeatherUpdateInput =
  Partial<CreateWeatherUpdateInput>

export type WeatherUpdatesResponse = {
  success: boolean
  message: string
  data: {
    items: WeatherUpdate[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}
import WeatherUpdatesPage from '@/features/weather-updates/pages/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/weather-updates/')({
  component: WeatherUpdatesPage,
})


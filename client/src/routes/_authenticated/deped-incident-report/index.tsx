import DepedIncidentReportsPage from '@/features/deped-incident-reports/pages/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/deped-incident-report/')({
  component: DepedIncidentReportsPage,
})


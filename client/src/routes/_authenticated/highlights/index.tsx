import { createFileRoute } from '@tanstack/react-router'
import { HighlightsPage } from "@/features/highlights/pages/HighlightsPage"
export const Route = createFileRoute('/_authenticated/highlights/')({
  component: HighlightsPage,
})
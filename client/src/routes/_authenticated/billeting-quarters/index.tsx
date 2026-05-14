// src/routes/_authenticated/billeting-quarters/index.tsx
import { createFileRoute } from "@tanstack/react-router"

import { BilletingQuartersPage } from "@/features/billeting-quarters/pages/BilletingQuartersPage"

export const Route = createFileRoute("/_authenticated/billeting-quarters/")({
  component: BilletingQuartersPage,
})
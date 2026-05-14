// src/routes/_authenticated/other-information/index.tsx
import { createFileRoute } from "@tanstack/react-router"

import { OtherInformationPage } from "@/features/other-information/pages/OtherInformationPage"

export const Route = createFileRoute(
  "/_authenticated/other-information/",
)({
  component: OtherInformationPage,
})
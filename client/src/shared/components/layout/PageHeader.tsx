import { ArrowLeft } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

import { Button } from "@/shared/components/ui/button"

interface PageHeaderProps {
  title: string
}

export function PageHeader({
  title,
}: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() =>
            navigate({
              to: "/",
            })
          }
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {title}
          </h1>
        </div>
      </div>
    </div>
  )
}
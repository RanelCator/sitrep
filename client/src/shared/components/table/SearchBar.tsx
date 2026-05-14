// src/shared/components/table/SearchBar.tsx
import { Search, X } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  disabled,
}: SearchBarProps) {
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="pl-9 pr-9"
        />

        {value && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={disabled || !value}
        onClick={() => onChange("")}
      >
        Clear
      </Button>
    </div>
  )
}
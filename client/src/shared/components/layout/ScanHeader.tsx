
interface ScanHeaderProps {
  title: string
}

export function ScanHeader({
  title,
}: ScanHeaderProps) {

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {title}
          </h1>
        </div>
      </div>
    </div>
  )
}
type ProgressBarProps = {
  label: string
  caption: string
  value: number
  meta?: string
  className?: string
}

export default function ProgressBar({ label, caption, value, meta = '', className }: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100)

  return (
    <div className={className}>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-terra">{label}</p>
          <p className="text-sm font-medium text-dark">{caption}</p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-dark">{`${Math.round(clampedValue)}%`}</p>
          {meta && <p className="text-xs text-muted">{meta}</p>}
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-border">
        <span
          className="block h-full rounded-full bg-linear-to-r from-terra to-terra-soft transition-all duration-300"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}

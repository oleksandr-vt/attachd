import type { AttachmentResultContent } from '@/lib/data/tests/results'
import type { AttachmentRankingItem } from '@/shared/attachment/scoring'

type ResultCardProps = {
  result: AttachmentResultContent
  ranking?: AttachmentRankingItem[]
  eyebrow?: string
  titlePrefix?: string
}

export default function ResultCard({
  result,
  ranking = [],
  eyebrow = 'Your attachment result',
  titlePrefix = '',
}: ResultCardProps) {
  return (
    <article className={`overflow-hidden rounded-3xl border bg-white shadow-report-card ${result.borderClass}`}>
      <div className={`min-h-48 border-b px-6 py-5 ${result.surfaceClass}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-terra">{eyebrow}</p>
            <h2 className="mb-3.5 font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-[2.75rem]">
              {titlePrefix && <span>{`${titlePrefix} `}</span>}{result.label}
            </h2>
          </div>

          <span className={`rounded-full px-3 py-1 text-xs text-center font-medium ${result.badgeClass}`}>
            {result.eyebrow}
          </span>
        </div>

        <p className="max-w-lg text-[15px] leading-7 text-dark2">
          {result.shortSummary}
        </p>
      </div>

      <div className="px-6 py-6">
        <p className="text-[15px] leading-7 text-body">
          {result.longSummary}
        </p>

        {ranking.length > 0 && (
          <div className="mt-6 grid gap-3">
            {ranking.map((item) => (
              <div key={item.type} className="grid gap-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-dark">{item.label}</span>
                  <span className={`text-sm font-medium ${item.accentClass}`}>{`${item.percentage}%`}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-bar-bg">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.barClass}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

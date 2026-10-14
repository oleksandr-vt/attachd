import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import CouplesReportView from '@/components/CouplesReportView'
import ShareActions from '@/components/ShareActions'
import ShareLinkField from '@/components/ShareLinkField'
import { getAttachmentCouplesReportRecord } from '@/server/utils/attachment-couples-report-store'

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'

const loadCouplesReport = cache(async (token: string) =>
  /^[a-f0-9]{16}$/i.test(token) ? getAttachmentCouplesReportRecord(token) : null,
)

const createdAtFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export const generateMetadata = async ({ params }: PageProps<'/couples/[token]'>): Promise<Metadata> => {
  const { token } = await params
  const record = await loadCouplesReport(token)

  if (!record) {
    return { title: 'Couples report not found' }
  }

  return {
    title: `${record.report.dynamicLabel} Couples Report`,
    description: record.report.overview,
    alternates: { canonical: `/couples/${token}` },
    openGraph: {
      title: `${record.report.dynamicLabel} Couples Report | Attachd.`,
      description: record.report.triggerSummary,
    },
    twitter: { card: 'summary' },
    robots: 'noindex',
  }
}

export default async function SharedCouplesReportPage({ params }: PageProps<'/couples/[token]'>) {
  const { token } = await params
  const record = await loadCouplesReport(token)

  if (!record) {
    notFound()
  }

  const { report } = record
  const rebuildHref = record.leftSourceToken && record.rightSourceToken
    ? `/couples?${new URLSearchParams({ self: record.leftSourceToken, partner: record.rightSourceToken })}`
    : '/couples'

  return (
    <section className="landing-page-section bg-cream">
      <div className="landing-container">
        <div className="grid gap-5">
          <header className={`${panelShellClass} bg-sec-bg`}>
            <p className="landing-section-kicker">Shared couples report</p>
            <h1 className="landing-section-title">
              {report.dynamicLabel}
            </h1>
            <p className="landing-section-copy max-w-160">
              {report.overview}
            </p>

            <ShareActions path={`/couples/${token}`} linkHref={rebuildHref} linkLabel="Open comparison builder" />
          </header>

          <section className={`${panelShellClass} bg-white`}>
            <p className={noteKickerClass}>Source pair</p>
            <h2 className={sectionTitleClass}>
              {`${record.leftResult.content.label} + ${record.rightResult.content.label}`}
            </h2>
            <p className="text-[15px] leading-7 text-body">
              {`Based on two completed attachment results captured on ${createdAtFormatter.format(new Date(record.createdAt))}.`}
            </p>
          </section>

          <CouplesReportView report={report} profileLabels={['Partner A', 'Partner B']} />

          <section className={`${panelShellClass} bg-white`}>
            <ShareLinkField path={`/couples/${token}`} />
          </section>
        </div>
      </div>
    </section>
  )
}

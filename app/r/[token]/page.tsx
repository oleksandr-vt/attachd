import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import AppButton from '@/components/AppButton'
import BulletList from '@/components/BulletList'
import ResultCard from '@/components/ResultCard'
import ShareActions from '@/components/ShareActions'
import ShareLinkField from '@/components/ShareLinkField'
import { toAttachmentPersistedResultPublicRecord } from '@/shared/attachment/persistence'
import { getAttachmentResultRecord } from '@/server/utils/attachment-result-store'

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'
const subtleDetailsClass = 'mt-3 rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm leading-6 text-muted'

const emailNotices = {
  pending: {
    tone: 'bg-sec-bg',
    title: 'Check your inbox',
    body: 'Your result is open now. Confirm the link we just emailed you and we will send a copy of this result link to your inbox.',
  },
  verified: {
    tone: 'bg-sec-bg',
    title: 'Email confirmed',
    body: 'Thanks, your email is confirmed for this saved result.',
  },
  expired: {
    tone: 'bg-cream',
    title: 'Confirmation link expired',
    body: 'Your result is still available here. The confirmation link has expired, so no further emails will be sent for it.',
  },
  unsent: {
    tone: 'bg-cream',
    title: 'Email not sent',
    body: 'Your result is saved, but we could not send the email right now. Keep this link to come back to it.',
  },
}

const loadResult = cache(async (token: string) => {
  if (!/^[a-f0-9]{16}$/i.test(token)) {
    return null
  }

  const record = await getAttachmentResultRecord(token)
  return record ? toAttachmentPersistedResultPublicRecord(record) : null
})

const getEmailNotice = (value: string | string[] | undefined) => {
  const notice = Array.isArray(value) ? value[0] : value
  return notice && Object.hasOwn(emailNotices, notice) ? emailNotices[notice as keyof typeof emailNotices] : null
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

export const generateMetadata = async ({ params }: PageProps<'/r/[token]'>): Promise<Metadata> => {
  const { token } = await params
  const record = await loadResult(token)

  if (!record) {
    return { title: 'Result not found' }
  }

  const resultContent = record.result.content

  return {
    title: `${resultContent.label} Attachment Result`,
    description: resultContent.seoDescription,
    alternates: { canonical: `/r/${token}` },
    openGraph: {
      title: `${resultContent.label} Attachment Result | Attachd.`,
      description: resultContent.shortSummary,
    },
    twitter: { card: 'summary' },
    robots: 'noindex',
  }
}

export default async function SharedResultPage({ params, searchParams }: PageProps<'/r/[token]'>) {
  const { token } = await params
  const record = await loadResult(token)

  if (!record) {
    notFound()
  }

  const emailNotice = getEmailNotice((await searchParams).email)
  const result = record.result
  const resultContent = result.content
  const secondaryLabel = result.ranking[1]?.label ?? resultContent.label

  return (
    <section className="landing-page-section bg-cream">
      <div className="landing-container">
        <div className="relative grid gap-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2 max-lg:contents">
            <header className="max-w-170 max-lg:order-1">
              <p className="landing-section-kicker">Shareable result</p>
              <h1 className="landing-section-title">
                {`${resultContent.label} attachment.`}
              </h1>
              <p className="landing-section-copy">
                {result.subprofileSummary}
              </p>

              <ShareActions path={`/r/${token}`} linkHref="/test/attachment" linkLabel="Retake the test" />
            </header>

            <div className="lg:mt-10 grid gap-5 max-lg:order-3">
              {emailNotice && (
                <div className={`${panelShellClass} ${emailNotice.tone}`}>
                  <p className={noteKickerClass}>{emailNotice.title}</p>
                  <p className={noteCopyClass}>
                    {emailNotice.body}
                  </p>
                </div>
              )}

              <div className={`${panelShellClass} bg-sec-bg`}>
                <p className={noteKickerClass}>Saved result snapshot</p>
                <p className={noteCopyClass}>
                  Strongest pattern: <strong>{resultContent.label}</strong>.
                  Second pattern: <strong>{secondaryLabel}</strong>.
                  This shared link keeps the exact snapshot that was generated when the test was completed.
                </p>
              </div>

              <section className={`${panelShellClass} bg-white`}>
                <p className={noteKickerClass}>Answer-based subprofile</p>
                <h2 className={sectionTitleClass}>{result.subprofileLabel}</h2>
                <p className={bodyCopyClass}>
                  {result.subprofileSummary}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted">
                  {result.stylePairSummary}
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {result.dimensions.map((dimension) => (
                    <div key={dimension.key} className="rounded-3xl border border-border bg-sec-bg p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-dark">{dimension.label}</span>
                        <span className="text-sm font-medium text-terra">
                          {`${capitalize(dimension.level)} / ${dimension.percentage}%`}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-dark2">
                        {dimension.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className={`${panelShellClass} bg-white`}>
                <p className={noteKickerClass}>Strongest trigger clusters</p>
                <h2 className={sectionTitleClass}>What activates this pattern fastest</h2>
                <ul className="grid gap-4">
                  {result.strongestTriggers.map((trigger) => (
                    <li key={trigger.key}>
                      <div className="rounded-3xl border border-border bg-sec-bg p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-dark">{trigger.label}</span>
                          <span className="text-sm font-medium text-terra">{`${trigger.percentage}%`}</span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-dark2">
                          {trigger.summary}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="grid gap-5 md:grid-cols-2">
                <section className={`${panelShellClass} bg-white`}>
                  <h2 className={sectionTitleClass}>What tends to work well</h2>
                  <BulletList items={resultContent.strengths} />
                </section>

                <section className={`${panelShellClass} bg-white`}>
                  <h2 className={sectionTitleClass}>What can get protective</h2>
                  <BulletList items={resultContent.watchouts} />
                </section>
              </div>

              <div id="compare" className={`${panelShellClass} bg-dark text-cream`}>
                <p className="mb-2.5 text-xs font-medium uppercase tracking-widest text-terra-soft">Partner flow</p>
                <h2 className="font-display text-4xl leading-tight font-medium tracking-tight text-cream sm:text-[2.7rem]">
                  Turn it into a couples read.
                </h2>
                <p className="mt-3.5 max-w-140 text-[15px] leading-7 text-pale">
                  {resultContent.partnerPrompt}
                </p>
                <p className="mt-3 text-sm leading-6 text-pale">
                  The couples report shows how your two patterns trigger each other, the conflict loop
                  to watch for, and what helps each of you feel safer.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <AppButton href={`/couples?self=${token}`} label="Compare with partner" size="sm" showArrow />
                  <span className="text-sm text-pale">Paste your partner result link there.</span>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <section className={`${panelShellClass} bg-sec-bg`}>
                  <h2 className={sectionTitleClass}>What helps you feel secure</h2>
                  <BulletList items={resultContent.relationshipNeeds} />
                </section>

                <section className={`${panelShellClass} bg-sec-bg`}>
                  <h2 className={sectionTitleClass}>Next steps prepared for this mix</h2>
                  <BulletList items={result.nextSteps} />
                </section>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <section className={`${panelShellClass} bg-sec-bg`}>
                  <h2 className={sectionTitleClass}>Full trigger readout</h2>
                  <ul className="grid gap-3.5">
                    {result.triggerClusters.map((trigger) => (
                      <li key={trigger.key}>
                        <div className="flex items-start gap-3">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
                          <span className="text-[15px] leading-7 text-dark2">
                            <strong>{`${trigger.label} (${trigger.percentage}%)`}</strong>
                            {` ${trigger.summary}`}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className={`${panelShellClass} bg-sec-bg`}>
                  <h2 className={sectionTitleClass}>Where to grow next</h2>
                  <BulletList items={resultContent.growthMoves} />
                </section>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-26 lg:self-start max-lg:order-2">
            <ResultCard result={resultContent} ranking={result.ranking} eyebrow="Your shareable attachment result" />
            <details className={subtleDetailsClass}>
              <summary className="cursor-pointer font-medium text-dark">How to read these bars</summary>
              <p className="mt-2">
                {result.scoreNote}
              </p>
            </details>

            <div className={`${panelShellClass} mt-4 bg-sec-bg`}>
              <ShareLinkField path={`/r/${token}`} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

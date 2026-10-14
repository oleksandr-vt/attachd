import type { Metadata } from 'next'
import AppButton from '@/components/AppButton'
import BulletList from '@/components/BulletList'
import ResultCard from '@/components/ResultCard'
import { CouplesReportButton, SavedResultButton } from '@/components/SavedResultButtons'
import { attachmentStyleTypes, attachmentTest, type AttachmentStyleType } from '@/lib/data/tests/attachment'
import { attachmentResults } from '@/lib/data/tests/results'

export const dynamicParams = false

export const generateStaticParams = () => attachmentStyleTypes.map((type) => ({ type }))

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'

const getResultContent = async (params: PageProps<'/results/[type]'>['params']) => {
  const { type } = await params
  return attachmentResults[type as AttachmentStyleType]
}

export const generateMetadata = async ({ params }: PageProps<'/results/[type]'>): Promise<Metadata> => {
  const resultContent = await getResultContent(params)

  return {
    title: `${resultContent.label} Attachment Style`,
    description: resultContent.seoDescription,
    alternates: { canonical: `/results/${resultContent.type}` },
    openGraph: {
      title: `${resultContent.seoTitle} | Attachd.`,
      description: resultContent.seoDescription,
    },
    twitter: { card: 'summary' },
  }
}

export default async function ResultTypePage({ params }: PageProps<'/results/[type]'>) {
  const resultContent = await getResultContent(params)
  const label = resultContent.label.toLowerCase()

  return (
    <section className="landing-page-section bg-cream">
      <div className="landing-container">
        <div className="relative grid gap-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <header className="max-w-170">
              <p className="landing-section-kicker">Attachment style guide</p>
              <h1 className="landing-section-title">
                {`${resultContent.label} attachment.`}
              </h1>
              <p className="landing-section-copy">
                {resultContent.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <AppButton href="/test/attachment" label="Take the 25-question test" size="sm" showArrow />
                <SavedResultButton />
              </div>
            </header>

            <div className="mt-10 grid gap-5">
              <section className={`${panelShellClass} bg-sec-bg`}>
                <p className={noteKickerClass}>Style guide</p>
                <h2 className={sectionTitleClass}>
                  {`See whether ${label} is actually your pattern.`}
                </h2>
                <p className={bodyCopyClass}>
                  {resultContent.longSummary}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted">
                  {`This page explains the ${label} pattern in general. The ${attachmentTest.questions.length}-question test checks whether it matches how you handle closeness, conflict, reassurance, and space in real relationships.`}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <AppButton href="/test/attachment" label="Take the 25-question test" size="sm" showArrow />
                  <span className="text-sm text-muted">Free first result in about four minutes.</span>
                </div>
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

              <div className="grid gap-5 md:grid-cols-2">
                <section className={`${panelShellClass} bg-sec-bg`}>
                  <h2 className={sectionTitleClass}>In relationships you usually need</h2>
                  <BulletList items={resultContent.relationshipNeeds} />
                </section>

                <section className={`${panelShellClass} bg-white`}>
                  <h2 className={sectionTitleClass}>Where to grow next</h2>
                  <BulletList items={resultContent.growthMoves} />
                </section>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <section className={`${panelShellClass} bg-cream`}>
                  <p className={noteKickerClass}>Your result</p>
                  <h2 className={sectionTitleClass}>Get your own attachment read.</h2>
                  <p className={bodyCopyClass}>
                    The test scores all four attachment styles side by side using your answers, then
                    shows the pattern that fits you best.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <AppButton href="/test/attachment" label="Take the 25-question test" size="sm" showArrow />
                    <SavedResultButton />
                  </div>
                </section>

                <section className={`${panelShellClass} bg-cream`}>
                  <p className={noteKickerClass}>Partner flow</p>
                  <h2 className={sectionTitleClass}>Turn it into a couples read.</h2>
                  <p className={bodyCopyClass}>
                    {resultContent.partnerPrompt}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <CouplesReportButton />
                    <span className="text-sm text-muted">Use two completed result links.</span>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-26 lg:self-start">
            <ResultCard result={resultContent} eyebrow="Attachment style overview" />

            <div className={`${panelShellClass} mt-4 bg-sec-bg`}>
              <p className={noteKickerClass}>What the test adds</p>
              <p className={bodyCopyClass}>
                A guide explains the pattern in general. The test compares all four styles using your
                own answers so you can see which one actually fits best.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <AppButton href="/test/attachment" label="Take the 25-question test" size="sm" showArrow />
                <SavedResultButton />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

import AppButton from '@/components/AppButton'
import { couplesChecklist, landingCouplesActionHref } from '@/lib/data/landing'

export default function LandingCouplesSection() {
  return (
    <section id="couples" aria-labelledby="couples-heading" className="landing-section bg-cream">
      <div className="landing-container flex flex-col gap-8 sm:gap-10 xl:flex-row xl:items-center xl:gap-20">
        <header className="min-w-0 flex-1">
          <p className="landing-section-kicker">
            For couples
          </p>
          <h2 id="couples-heading" className="landing-section-title">
            Understand the dynamic between both styles.
          </h2>
          <p className="landing-section-copy mb-6 max-w-125 sm:mb-8">
            Compare two completed attachment results side by side so you can see where conflict
            starts, what each person is protecting, and what kind of repair is most likely to help
            both people feel safer.
          </p>

          <ul className="my-6 flex list-none flex-col gap-3 sm:my-8">
            {couplesChecklist.map((item) => (
              <li key={item} className="landing-checklist-item">
                <span className="mt-1.5 text-xs text-terra" aria-hidden="true">&#10022;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <AppButton href={landingCouplesActionHref} label="Open couples report" showArrow />
            <span className="landing-action-note">Use two completed result links</span>
          </div>
        </header>

        <div className="w-full xl:w-auto xl:shrink-0">
          <div className="mx-auto w-full max-w-95 rounded-3xl border border-border bg-cream p-6 sm:max-w-100 sm:p-8 sm:px-9 xl:mx-0 xl:max-w-none">
            <p className="mb-6 text-xs font-medium uppercase tracking-widest text-pale">
              Compatibility preview
            </p>

            <div className="mb-6 flex items-center gap-5">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-13 w-13 items-center justify-center rounded-full bg-anxious-soft font-display text-xl font-medium text-anxious">
                  A
                </div>
                <span className="whitespace-nowrap rounded-full bg-anxious-soft px-2.5 py-0.75 text-xs font-medium text-anxious">
                  Anxious
                </span>
              </div>

              <div className="flex flex-1 flex-col items-center gap-2">
                <span className="text-lg text-terra" aria-hidden="true">&hearts;</span>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-linear-to-r from-anxious to-avoid" style={{ width: '78%' }} />
                </div>
                <span className="text-center text-xs text-muted">Common tension point</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex h-13 w-13 items-center justify-center rounded-full bg-avoid-soft font-display text-xl font-medium text-avoid">
                  B
                </div>
                <span className="whitespace-nowrap rounded-full bg-avoid-soft px-2.5 py-0.75 text-xs font-medium text-avoid">
                  Avoidant
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 border-t border-border pt-5">
              <div className="flex flex-col gap-px">
                <span className="text-xs font-medium uppercase tracking-widest text-pale">
                  Clash point
                </span>
                <span className="text-sm text-dark2">Withdrawal vs. pursuit cycle</span>
              </div>
              <div className="flex flex-col gap-px">
                <span className="text-xs font-medium uppercase tracking-widest text-pale">
                  Strength
                </span>
                <span className="text-sm text-dark2">Deep loyalty when trust is built</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

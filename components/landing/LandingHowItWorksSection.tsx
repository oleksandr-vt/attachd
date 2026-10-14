import AppButton from '@/components/AppButton'
import { landingPrimaryActionHref, processSteps } from '@/lib/data/landing'

export default function LandingHowItWorksSection() {
  return (
    <section id="how" aria-labelledby="how-heading" className="landing-section bg-cream">
      <div className="landing-container">
        <header className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <p className="landing-section-kicker">
            The process
          </p>
          <h2 id="how-heading" className="landing-section-title mb-0">
            How the attachment style test works.
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-12">
          {processSteps.map((step, index) => (
            <article
              key={step.number}
              className="rounded-2xl border border-border bg-sec-bg p-5 sm:p-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
            >
              <div className="flex gap-4 lg:block">
                <div className="flex w-10 shrink-0 flex-col items-center lg:hidden">
                  <span className="landing-step-badge">{step.number}</span>
                  <span className="mt-3 min-h-8 w-px flex-1 bg-linear-to-b from-terra/45 via-border to-border" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-5 hidden items-center gap-4 lg:flex sm:mb-6">
                    <span
                      className={`h-px flex-1 ${index === 0 ? 'opacity-0' : 'bg-linear-to-r from-transparent via-border to-border'}`}
                    />
                    <span className="landing-step-badge">{step.number}</span>
                    <span
                      className={`h-px flex-1 ${index === processSteps.length - 1
                        ? 'opacity-0'
                        : 'bg-linear-to-r from-border via-border to-transparent'}`}
                    />
                  </div>

                  <h3 className="mb-3 font-display text-2xl leading-tight font-medium tracking-tight text-dark lg:text-center">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-7 text-body lg:text-center">{step.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-14 sm:flex-row sm:gap-5">
          <AppButton href={landingPrimaryActionHref} label="Start the assessment" showArrow />
          <span className="landing-action-note">
            Quick first result &middot; private and simple
          </span>
        </div>
      </div>
    </section>
  )
}

import { cx } from '@/lib/cx'
import { benefitCards } from '@/lib/data/landing'

export default function LandingBenefitsSection() {
  return (
    <section id="results" aria-labelledby="results-heading" className="landing-section bg-sec-bg">
      <div className="landing-container">
        <header className="mb-10 max-w-160 sm:mb-14">
          <p className="landing-section-kicker">
            What you get
          </p>
          <h2 id="results-heading" className="landing-section-title">
            More useful than a vague personality score.
          </h2>
          <p className="landing-section-copy max-w-140">
            The test is built to give you a fast, understandable result with real depth behind it,
            without forcing an account or a heavy profile upfront.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:gap-6 xl:grid-cols-3">
          {benefitCards.map((card, index) => (
            <article
              key={card.title}
              className={cx(
                'flex flex-col gap-4 rounded-2xl border border-border bg-cream p-6 sm:gap-5 sm:p-8',
                index === benefitCards.length - 1 && 'md:col-span-2 md:mx-auto md:max-w-125 xl:col-span-1 xl:mx-0 xl:max-w-none',
              )}
            >
              <p className="text-xs font-medium uppercase tracking-widest text-terra">
                {card.eyebrow}
              </p>
              <h3 className="font-display text-2xl leading-tight font-medium tracking-tight text-dark">
                {card.title}
              </h3>
              <p className="flex-1 text-sm leading-7 text-body">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

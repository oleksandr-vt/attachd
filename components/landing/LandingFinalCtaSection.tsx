import AppButton from '@/components/AppButton'
import { landingPrimaryActionHref } from '@/lib/data/landing'

export default function LandingFinalCtaSection() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="landing-finale-section bg-dark text-center"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 600px 400px at 30% 50%, var(--landing-finale-glow) 0%, transparent 70%)',
      }}
    >
      <div className="landing-container flex flex-col items-center gap-6">
        <p className="landing-section-kicker-soft">
          Start with the free result
        </p>
        <h2
          id="final-cta-heading"
          className="mb-4 font-display text-4xl leading-tight font-medium tracking-tight text-cream sm:mb-5 sm:text-5xl lg:text-6xl"
        >
          Find your attachment style<br />
          and get a clearer relationship map.
        </h2>
        <p className="max-w-120 text-center text-base leading-7 text-muted">
          Start with the 25-question test and see which attachment pattern fits best.<br className="hidden sm:block" />
          {' A clearer read of your relationship habits starts here.'}
        </p>
        <AppButton href={landingPrimaryActionHref} label="Start the free test" size="lg" showArrow />
        <p className="max-w-100 text-center text-sm text-body">
          Educational, not diagnostic.
        </p>
      </div>
    </section>
  )
}

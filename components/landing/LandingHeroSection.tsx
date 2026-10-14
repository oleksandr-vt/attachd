import { Fragment } from 'react'
import AppButton from '@/components/AppButton'
import { heroStats, landingPrimaryActionHref } from '@/lib/data/landing'

export default function LandingHeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="landing-hero-section overflow-hidden bg-cream"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 600px 400px at 70% 50%, var(--landing-hero-glow) 0%, transparent 70%)',
      }}
    >
      <div className="landing-container flex flex-col gap-10 sm:gap-12 xl:flex-row xl:items-center xl:gap-20">
        <header className="min-w-0 flex-1">
          <p className="landing-section-kicker landing-fade-up" style={{ animationDelay: '0.05s' }}>
            Attachment Style Test
          </p>

          <h1
            id="hero-heading"
            className="mb-5 font-display text-4xl leading-none font-medium tracking-tight text-dark landing-fade-up sm:mb-6 sm:text-5xl lg:text-6xl"
            style={{ animationDelay: '0.15s' }}
          >
            Attachment style test<br />
            for the way you <em className="italic text-terra">love.</em>
          </h1>

          <p className="landing-section-copy landing-fade-up mb-6 max-w-125 sm:mb-8" style={{ animationDelay: '0.25s' }}>
            Take a 25-question attachment style test grounded in attachment theory. Learn whether
            your pattern is secure, anxious, avoidant, or fearful-avoidant - and what that means for
            closeness, conflict, and communication.
          </p>

          <div
            className="landing-fade-up mb-8 flex flex-col items-start gap-4 sm:mb-11 sm:flex-row sm:items-center sm:gap-5"
            style={{ animationDelay: '0.35s' }}
          >
            <AppButton href={landingPrimaryActionHref} label="Start the free test" showArrow />
            <span className="landing-action-note">
              25 questions &middot; about 4 minutes
            </span>
          </div>

          <div className="landing-fade-up flex flex-wrap items-center gap-3 sm:gap-6" style={{ animationDelay: '0.45s' }}>
            {heroStats.map((stat, index) => (
              <Fragment key={stat.label}>
                <div className="flex flex-col gap-px">
                  <b className="hero-stat-value text-lg font-medium text-dark">{stat.value}</b>
                  <span className="text-xs text-pale">{stat.label}</span>
                </div>
                {index < heroStats.length - 1 && <div className="hidden h-7 w-px bg-border sm:block" />}
              </Fragment>
            ))}
          </div>
        </header>

        <div
          aria-hidden="true"
          className="landing-fade-up-slow flex w-full justify-center xl:w-85 xl:shrink-0"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="relative h-115 w-80 origin-top scale-85 sm:scale-100 -mr-40 xl:mr-0">
            <div
              className="absolute top-2 -left-2 z-0 w-63 rounded-2xl border border-secure-bd bg-secure-bg p-5.5 opacity-65"
              style={{ transform: 'rotate(-7.5deg)' }}
            >
              <p className="mb-3.5 font-display text-base font-medium text-dark">Secure</p>
              <div className="flex flex-col gap-2">
                <div className="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                  <div className="h-full rounded-full bg-secure" style={{ width: '78%' }} />
                </div>
                <div className="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                  <div className="h-full rounded-full bg-secure opacity-45" style={{ width: '55%' }} />
                </div>
                <div className="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                  <div className="h-full rounded-full bg-secure opacity-25" style={{ width: '88%' }} />
                </div>
              </div>
            </div>

            <div
              className="absolute top-7 -right-0.5 z-10 w-63 rounded-2xl border border-anxious-bd bg-anxious-bg p-5.5 opacity-80"
              style={{ transform: 'rotate(5.5deg)' }}
            >
              <p className="mb-3.5 font-display text-base font-medium text-dark">Anxious</p>
              <div className="flex flex-col gap-2">
                <div className="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                  <div className="h-full rounded-full bg-anxious" style={{ width: '82%' }} />
                </div>
                <div className="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                  <div className="h-full rounded-full bg-anxious opacity-45" style={{ width: '44%' }} />
                </div>
                <div className="h-1.75 overflow-hidden rounded-full bg-bar-bg">
                  <div className="h-full rounded-full bg-anxious opacity-25" style={{ width: '70%' }} />
                </div>
              </div>
            </div>

            <div
              className="landing-float-card absolute bottom-0 left-1/2 z-20 w-76 -translate-x-1/2 rounded-2xl border border-border bg-white p-5.5 shadow-floating-card"
              style={{ transform: 'translateX(-50%) rotate(-1.5deg)' }}
            >
              <div className="mb-3.5 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-widest text-pale">
                  Example result
                </span>
                <span className="rounded-full bg-avoid-bg px-3 py-1 text-xs font-medium text-avoid">
                  Avoidant
                </span>
              </div>

              <p className="mb-4 text-xs leading-5 text-body">
                You value independence and can pull back when closeness feels intense. The full
                result explains the triggers behind that response and what more secure connection can
                look like.
              </p>

              <div className="mb-3.5 flex items-center gap-2.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bar-bg">
                  <div className="h-full rounded-full bg-avoid" style={{ width: '72%' }} />
                </div>
                <span className="whitespace-nowrap text-xs text-muted">Top pattern</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-fearful-bg px-2.5 py-1 text-xs text-muted">
                  Autonomy
                </span>
                <span className="rounded-full bg-fearful-bg px-2.5 py-1 text-xs text-muted">
                  Distance
                </span>
                <span className="rounded-full bg-fearful-bg px-2.5 py-1 text-xs text-muted">
                  Guarded
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

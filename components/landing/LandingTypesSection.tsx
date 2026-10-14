import Link from 'next/link'
import AppButton from '@/components/AppButton'
import { attachmentStyleCards, landingPrimaryActionHref } from '@/lib/data/landing'

export default function LandingTypesSection() {
  return (
    <section id="types" aria-labelledby="types-heading" className="landing-section bg-sec-bg">
      <div className="landing-container">
        <header className="mb-10 max-w-160 sm:mb-14">
          <p className="landing-section-kicker">
            The four styles
          </p>
          <h2 id="types-heading" className="landing-section-title">
            The four attachment styles.<br />
            Which one feels most familiar?
          </h2>
          <p className="landing-section-copy max-w-125">
            Attachment style describes how you tend to handle closeness, distance, and emotional
            safety. These four patterns come from attachment theory and help put familiar
            relationship reactions into words.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {attachmentStyleCards.map((card) => (
            <article
              key={card.title}
              className={`flex flex-col gap-2 rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated-card sm:p-7.5 ${card.surfaceClass}`}
            >
              <span className="text-xs text-soft-muted">{card.eyebrow}</span>
              <h3 className={`my-1 font-display text-3xl leading-none font-medium tracking-tight ${card.accentClass}`}>
                {card.title}
              </h3>
              <p className="text-xs font-medium leading-5 text-dark2">{card.summary}</p>
              <p className="mt-1 flex-1 text-sm leading-6 text-body">{card.description}</p>
              <Link
                href={card.href}
                className={`mt-2 inline-flex items-center py-1 text-sm font-medium transition-opacity duration-200 hover:opacity-65 ${card.accentClass}`}
              >
                Learn more &rarr;
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-5 sm:mt-14">
          <AppButton href={landingPrimaryActionHref} label="Find your style - it's free" showArrow />
        </div>
      </div>
    </section>
  )
}

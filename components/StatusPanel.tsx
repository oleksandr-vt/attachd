import type { ReactNode } from 'react'

type StatusPanelProps = {
  kicker: string
  title: string
  description: string
  children: ReactNode
}

export default function StatusPanel({ kicker, title, description, children }: StatusPanelProps) {
  return (
    <section className="landing-page-section bg-cream">
      <div className="landing-container">
        <div className="rounded-3xl border border-border bg-sec-bg p-6 shadow-report-card md:p-8">
          <p className="landing-section-kicker">{kicker}</p>
          <h1 className="landing-section-title">{title}</h1>
          <p className="landing-section-copy max-w-140">{description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

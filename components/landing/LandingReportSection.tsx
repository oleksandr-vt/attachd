'use client'

import { useEffect, useRef, useState } from 'react'
import AppButton from '@/components/AppButton'
import Transition from '@/components/Transition'
import {
  landingPrimaryActionHref,
  reportChecklist,
  reportPreviewSlides,
  type ReportPreviewSlide,
} from '@/lib/data/landing'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

const initialPreview = reportPreviewSlides[0]

if (!initialPreview) {
  throw new Error('Report preview slides are required.')
}

export default function LandingReportSection() {
  const reportSection = useRef<HTMLElement | null>(null)
  const [activePreviewIndex, setActivePreviewIndex] = useState(0)
  const [isReportVisible, setIsReportVisible] = useState(false)
  const [rotationRestarts, setRotationRestarts] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  const activePreview: ReportPreviewSlide = reportPreviewSlides[activePreviewIndex] ?? initialPreview

  useEffect(() => {
    const section = reportSection.current

    if (!section) {
      return
    }

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (entry) {
          setIsReportVisible(entry.isIntersecting)
        }
      },
      { threshold: 0.4 },
    )

    visibilityObserver.observe(section)
    return () => visibilityObserver.disconnect()
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || !isReportVisible || reportPreviewSlides.length < 2) {
      return
    }

    const rotationTimer = window.setInterval(() => {
      setActivePreviewIndex((index) => (index + 1) % reportPreviewSlides.length)
    }, 3700)

    return () => window.clearInterval(rotationTimer)
  }, [prefersReducedMotion, isReportVisible, rotationRestarts])

  const setActivePreview = (index: number) => {
    setActivePreviewIndex(index)
    setRotationRestarts((count) => count + 1)
  }

  return (
    <section
      id="report"
      ref={reportSection}
      aria-labelledby="report-heading"
      className="landing-section bg-sec-bg"
    >
      <div className="landing-container flex flex-col gap-8 sm:gap-10 xl:flex-row xl:items-center xl:gap-20">
        <header className="min-w-0 flex-1">
          <p className="landing-section-kicker">
            Your full result
          </p>
          <h2 id="report-heading" className="landing-section-title">
            Go beyond the label.
          </h2>
          <p className="landing-section-copy mb-6 max-w-125 sm:mb-8">
            Your result page goes deeper than a single style. It shows how your pattern plays out
            across security, anxiety, avoidance, and push-pull, which moments trigger it fastest, and
            what more secure behavior can look like in real relationships.
          </p>

          <ul className="my-6 flex list-none flex-col gap-3 sm:my-8">
            {reportChecklist.map((item) => (
              <li key={item} className="landing-checklist-item">
                <span className="text-sm text-terra" aria-hidden="true">&rarr;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <AppButton href={landingPrimaryActionHref} label="Start the free test" showArrow />
            <span className="landing-action-note">Free &middot; no account needed</span>
          </div>
        </header>

        <div className="flex w-full justify-center xl:w-auto xl:shrink-0">
          <div
            className={`w-full max-w-90 overflow-hidden rounded-2xl border bg-white shadow-report-card transition-colors duration-500 xl:w-75 xl:max-w-none ${activePreview.borderClass}`}
          >
            <div className="flex items-center gap-1.5 border-b border-border bg-cream px-4 py-3">
              <span className="block h-2.5 w-2.5 rounded-full bg-border" />
              <span className="block h-2.5 w-2.5 rounded-full bg-border" />
              <span className="block h-2.5 w-2.5 rounded-full bg-border" />
            </div>

            <Transition
              mode="out-in"
              enterActiveClass={prefersReducedMotion ? '' : 'transition duration-500 ease-out'}
              enterFromClass={prefersReducedMotion ? '' : 'translate-x-6 scale-95 opacity-0'}
              enterToClass={prefersReducedMotion ? '' : 'translate-x-0 scale-100 opacity-100'}
              leaveActiveClass={prefersReducedMotion ? '' : 'transition duration-500 ease-in'}
              leaveFromClass={prefersReducedMotion ? '' : 'translate-x-0 scale-100 opacity-100'}
              leaveToClass={prefersReducedMotion ? '' : '-translate-x-6 scale-95 opacity-0'}
            >
              <div key={activePreview.title} className="p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-terra">
                      Example result
                    </p>
                    <h3 className="font-display text-3xl leading-tight font-medium tracking-tight text-dark">
                      {activePreview.title}
                    </h3>
                  </div>

                  <span className={`rounded-full px-3 py-1 text-center text-xs font-medium leading-tight ${activePreview.badgeClass}`}>
                    {activePreview.title}
                  </span>
                </div>

                <p className="mb-5 text-sm leading-6 text-body">
                  {activePreview.summary}
                </p>

                <div className={`space-y-4 rounded-2xl p-4 transition-colors duration-500 ${activePreview.surfaceClass}`}>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-pale">
                      Subprofile
                    </p>
                    <p className="text-sm leading-normal text-dark2">
                      {activePreview.subprofile}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-pale">
                      Strongest trigger
                    </p>
                    <p className="text-sm leading-normal text-dark2">
                      {activePreview.strongestTrigger}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-pale">
                      Growth edge
                    </p>
                    <p className="text-sm leading-normal text-dark2">
                      {activePreview.growthEdge}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-muted">Security</p>
                    <span className={`text-xs font-medium ${activePreview.accentClass}`}>
                      {`${activePreview.security}%`}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-bar-bg">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${activePreview.barClass}`}
                      style={{ width: `${activePreview.security}%` }}
                    />
                  </div>
                </div>
              </div>
            </Transition>

            <div className="border-t border-border bg-cream px-4 py-3">
              <div className="flex items-center gap-2">
                {reportPreviewSlides.map((preview, index) => (
                  <button
                    key={preview.title}
                    type="button"
                    className="group flex flex-1 items-center"
                    aria-label={`Show ${preview.title} preview`}
                    aria-pressed={index === activePreviewIndex}
                    onClick={() => setActivePreview(index)}
                  >
                    <span
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${index === activePreviewIndex ? preview.barClass : 'bg-border group-hover:bg-pale'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

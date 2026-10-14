'use client'

import { useState } from 'react'
import Transition from '@/components/Transition'
import { cx } from '@/lib/cx'
import { faqItems } from '@/lib/data/landing'

export default function LandingFaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index))
  }

  return (
    <section id="faq" aria-labelledby="faq-heading" className="landing-section bg-cream">
      <div className="landing-container">
        <header className="mx-auto mb-10 max-w-170 text-center sm:mb-12">
          <p className="landing-section-kicker">
            FAQ
          </p>
          <h2 id="faq-heading" className="landing-section-title">
            Common questions about the attachment style test.
          </h2>
          <p className="landing-section-copy">
            These answers explain what the test is designed to measure, how the results work, and
            what kind of result flow people should expect.
          </p>
        </header>

        <dl className="mx-auto grid max-w-215 grid-cols-1 gap-4">
          {faqItems.map((item, index) => (
            <div
              key={item.question}
              className={`rounded-2xl border bg-sec-bg p-6 transition-colors duration-200 sm:p-8 ${openIndex === index ? 'border-pale' : 'border-border'}`}
            >
              <dt>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
                  aria-controls={`faq-panel-${index}`}
                  aria-expanded={openIndex === index}
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-display text-2xl leading-tight font-medium tracking-tight text-dark">
                    {item.question}
                  </span>
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-cream/70 text-dark"
                    aria-hidden="true"
                  >
                    <svg
                      className={cx('h-4 w-4 transition-transform duration-200', openIndex === index && 'rotate-180')}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </dt>
              <Transition
                enterActiveClass="overflow-hidden transition-all duration-200 ease-out"
                enterFromClass="max-h-0 opacity-0"
                enterToClass="max-h-56 opacity-100"
                leaveActiveClass="overflow-hidden transition-all duration-200 ease-in"
                leaveFromClass="max-h-56 opacity-100"
                leaveToClass="max-h-0 opacity-0"
              >
                {openIndex === index && (
                  <dd id={`faq-panel-${index}`} className="overflow-hidden">
                    <div className="mt-4 border-t border-border pt-4 text-sm leading-7 text-body">
                      {item.answer}
                    </div>
                  </dd>
                )}
              </Transition>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

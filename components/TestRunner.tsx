'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import AppButton from '@/components/AppButton'
import ConfirmDialog from '@/components/ConfirmDialog'
import ProgressBar from '@/components/ProgressBar'
import TestQuestion from '@/components/TestQuestion'
import Transition from '@/components/Transition'
import TurnstileWidget, { type TurnstileWidgetHandle } from '@/components/TurnstileWidget'
import { getApiErrorMessage, requestJson } from '@/lib/api-client'
import { attachmentResults } from '@/lib/data/tests/results'
import { useTest } from '@/lib/hooks/useTest'
import type { AttachmentPersistedResultResponse } from '@/shared/attachment/persistence'
import { isEmailFormatValid } from '@/shared/email'

const resultRevealDelayMs = 1700
const resultLoadingSteps = [
  'Scoring your answer patterns',
  'Mapping your strongest triggers',
  'Preparing your saved result',
]

const waitForResultReveal = () =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, resultRevealDelayMs)
  })

const getEmailNoticeQuery = (email: string, emailVerificationSent: boolean) => {
  if (emailVerificationSent) {
    return '?email=pending'
  }

  return email ? '?email=unsent' : ''
}

export default function TestRunner() {
  const router = useRouter()
  const {
    attachmentTest,
    answeredCount,
    computedResult,
    currentAnswer,
    currentQuestion,
    currentQuestionNumber,
    estimatedMinutesLeft,
    goToNextQuestion,
    goToPreviousQuestion,
    hasStarted,
    hasSubmittedResults,
    progressPercentage,
    remainingQuestions,
    rememberEmail,
    resetTest,
    session,
    setAnswer,
    setSharedResultToken,
    totalQuestions,
    completeTest,
    startTest,
  } = useTest()

  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  const [continueLocked, setContinueLocked] = useState(false)
  const [resultPublishError, setResultPublishError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [savingResult, setSavingResult] = useState(false)
  const [generatingResult, setGeneratingResult] = useState(false)
  const [editedEmail, setEditedEmail] = useState<string | null>(null)
  const turnstileWidget = useRef<TurnstileWidgetHandle | null>(null)
  const continueUnlockTimeout = useRef<number | null>(null)

  const emailInput = editedEmail ?? session.email
  const beginLabel = answeredCount > 0 ? `Resume at question ${currentQuestionNumber}` : 'Start the test'

  const progressCaption = hasSubmittedResults
    ? `All ${totalQuestions} questions answered`
    : hasStarted
      ? `Question ${currentQuestionNumber} of ${totalQuestions}`
      : `25 questions - about ${attachmentTest.estimatedMinutes} minutes`

  const progressMeta = hasSubmittedResults
    ? session.lastSharedResultToken
      ? 'Results ready'
      : 'Ready to save'
    : hasStarted
      ? `${remainingQuestions} left - about ${estimatedMinutesLeft} min`
      : 'No account needed'

  const continueLabel = currentQuestionNumber === totalQuestions ? 'Finish the test' : 'Next question'
  const canContinue = currentAnswer !== null && !continueLocked

  useEffect(() => () => {
    if (continueUnlockTimeout.current) {
      window.clearTimeout(continueUnlockTimeout.current)
    }
  }, [])

  const clearContinueUnlockTimeout = () => {
    if (continueUnlockTimeout.current) {
      window.clearTimeout(continueUnlockTimeout.current)
      continueUnlockTimeout.current = null
    }
  }

  const lockContinue = () => {
    setContinueLocked(true)
    clearContinueUnlockTimeout()
    continueUnlockTimeout.current = window.setTimeout(() => {
      setContinueLocked(false)
      continueUnlockTimeout.current = null
    }, 180)
  }

  const handleSelect = (value: number) => {
    lockContinue()
    setAnswer(currentQuestion.id, value)
  }

  const handleContinue = () => {
    if (!canContinue) {
      return
    }

    if (currentQuestionNumber === totalQuestions) {
      if (completeTest()) {
        setEmailError('')
        setResultPublishError('')
      }

      return
    }

    goToNextQuestion()
  }

  const openRestartConfirm = () => {
    setShowRestartConfirm(true)
  }

  const confirmRestart = () => {
    setShowRestartConfirm(false)
    setContinueLocked(false)
    setResultPublishError('')
    setEmailError('')
    clearContinueUnlockTimeout()
    resetTest()
  }

  const handleViewResult = () => {
    if (session.lastSharedResultToken) {
      router.push(`/r/${session.lastSharedResultToken}`)
    }
  }

  const submitResult = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!hasSubmittedResults || !computedResult || savingResult) {
      return
    }

    const email = emailInput.trim()

    if (email && !isEmailFormatValid(email)) {
      setEmailError('Enter a valid email address, or leave the field empty.')
      return
    }

    setEmailError('')
    setResultPublishError('')
    setSavingResult(true)

    try {
      const turnstileToken = await turnstileWidget.current?.getToken() ?? ''
      setGeneratingResult(true)

      const [response] = await Promise.all([
        requestJson<AttachmentPersistedResultResponse>('/api/results', {
          answers: session.answers,
          email,
          turnstileToken,
        }),
        waitForResultReveal(),
      ])

      if (email) {
        rememberEmail(email)
      }

      setSharedResultToken(response.record.token)
      router.push(`/r/${response.record.token}${getEmailNoticeQuery(email, response.emailVerificationSent)}`)
    } catch (error) {
      setGeneratingResult(false)
      setResultPublishError(getApiErrorMessage(error, 'We could not save your result just now. Please try again.'))
      turnstileWidget.current?.reset()
    } finally {
      setSavingResult(false)
    }
  }

  let step
  if (!hasStarted) {
    step = (
      <div key="intro" className="rounded-3xl border border-border bg-sec-bg p-6 md:p-8">
        <p className="landing-section-kicker">Before you begin</p>
        <h2 className="max-w-120 font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-5xl">
          Answer for your usual relationship pattern, not your ideal one.
        </h2>
        <p className="landing-section-copy mt-4 max-w-140">
          Think about romantic relationships or the closest equivalent in your life. Focus on
          what tends to happen when closeness, reassurance, conflict, or space become
          emotionally charged.
        </p>

        <ul className="mt-6 grid gap-3">
          <li className="rounded-3xl border border-border bg-white px-4 py-4 text-sm leading-7 text-dark2">
            Choose the option that feels truest most of the time.
          </li>
          <li className="rounded-3xl border border-border bg-white px-4 py-4 text-sm leading-7 text-dark2">
            You can move back and revise earlier answers before finishing.
          </li>
          <li className="rounded-3xl border border-border bg-white px-4 py-4 text-sm leading-7 text-dark2">
            The results are educational, not diagnostic.
          </li>
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <AppButton size="sm" onClick={() => startTest()}>
            {beginLabel}
          </AppButton>
          <span className="text-sm text-muted">No signup required to start</span>
        </div>
      </div>
    )
  } else if (hasSubmittedResults && computedResult && (!session.lastSharedResultToken || generatingResult)) {
    step = (
      <div key="capture" className="rounded-3xl border border-border bg-sec-bg p-6 md:p-8">
        {generatingResult
          ? (
              <div className="grid gap-6">
                <div>
                  <p className="landing-section-kicker">Preparing result</p>
                  <h2 className="font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-5xl">
                    Reading your attachment pattern.
                  </h2>
                  <p className="landing-section-copy mt-4 max-w-140">
                    We are turning your answers into a saved result snapshot.
                  </p>
                </div>

                <div className="max-w-130 rounded-3xl border border-border bg-white p-5">
                  <div className="h-2 overflow-hidden rounded-full bg-cream">
                    <div className="h-full w-1/2 rounded-full bg-terra motion-safe:animate-[result-loader_1.35s_ease-in-out_infinite]" />
                  </div>

                  <ul className="mt-5 grid gap-3">
                    {resultLoadingSteps.map((loadingStep) => (
                      <li key={loadingStep} className="flex items-center gap-3 text-sm leading-6 text-dark2">
                        <span className="size-2 rounded-full bg-terra motion-safe:animate-pulse" aria-hidden="true" />
                        <span>{loadingStep}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          : (
              <>
                <p className="landing-section-kicker">One more step</p>
                <h2 className="font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-5xl">
                  Your answers are complete.
                </h2>
                <p className="landing-section-copy mt-4 max-w-140">
                  Want a copy? Add your email and we will send you a link to your saved result,
                  or leave it empty and open your result right away.
                </p>

                <form className="mt-6 grid max-w-120 gap-3" onSubmit={submitResult}>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-dark">Email address (optional)</span>
                    <input
                      value={emailInput}
                      onChange={(event) => setEditedEmail(event.target.value)}
                      type="email"
                      autoComplete="email"
                      className="rounded-[18px] border border-border bg-white px-4 py-4 text-dark outline-none transition-all duration-200 focus:border-[#c9b8a9] focus:shadow-[0_0_0_3px_rgba(184,92,56,0.12)]"
                      placeholder="you@example.com"
                    />
                    <span className="text-xs leading-5 text-muted">
                      Used only to send you this result. Reply to that email anytime to have it deleted.
                    </span>
                  </label>

                  {emailError && (
                    <p className="text-sm leading-6 text-terra-dk">
                      {emailError}
                    </p>
                  )}
                  {resultPublishError && (
                    <p className="text-sm leading-6 text-terra-dk">
                      {resultPublishError}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <AppButton type="submit" size="sm" disabled={savingResult}>
                      {savingResult ? 'Saving your result' : 'Continue to my results'}
                    </AppButton>
                    <AppButton variant="outline" size="sm" onClick={openRestartConfirm}>
                      Retake the test
                    </AppButton>
                  </div>
                </form>
              </>
            )}

        <TurnstileWidget ref={turnstileWidget} action="save-result" />
      </div>
    )
  } else if (hasSubmittedResults && computedResult) {
    step = (
      <div key="complete" className="rounded-3xl border border-border bg-sec-bg p-6 md:p-8">
        <p className="landing-section-kicker">Results ready</p>
        <h2 className="font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-5xl">
          Your answers are complete.
        </h2>
        <p className="landing-section-copy mt-4 max-w-140">
          Your result has been saved. You can open it again now or restart the full
          25-question flow if you want a fresh pass.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <AppButton size="sm" onClick={handleViewResult}>
            View my results
          </AppButton>
          <AppButton variant="outline" size="sm" onClick={openRestartConfirm}>
            Retake the test
          </AppButton>
        </div>
      </div>
    )
  } else {
    step = (
      <div key={currentQuestion.id} className="space-y-6">
        <TestQuestion
          question={currentQuestion}
          questionNumber={currentQuestionNumber}
          totalQuestions={totalQuestions}
          selectedValue={currentAnswer}
          options={attachmentTest.options}
          onSelect={handleSelect}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <AppButton
              variant="secondary"
              size="sm"
              disabled={currentQuestionNumber === 1}
              onClick={goToPreviousQuestion}
            >
              Back
            </AppButton>
            <AppButton variant="tertiary" size="sm" onClick={openRestartConfirm}>
              Restart
            </AppButton>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {currentAnswer === null
              ? (
                  <span className="text-sm text-muted">
                    Pick one answer to continue
                  </span>
                )
              : continueLocked && (
                <span className="text-sm text-muted">
                  Review your choice, then continue
                </span>
              )}

            <AppButton size="sm" disabled={!canContinue} onClick={handleContinue}>
              {continueLabel}
            </AppButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="landing-page-section bg-cream">
      <div className="landing-container">
        <div className="grid gap-8">
          {!hasStarted && (
            <div className="rounded-3xl border border-border bg-sec-bg p-6 shadow-report-card md:p-8">
              <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
                <div className="max-w-170">
                  <p className="landing-section-kicker">Attachment style test</p>
                  <h1 className="landing-section-title">
                    Read the pattern behind how you do closeness.
                  </h1>
                  <p className="landing-section-copy max-w-150">
                    Move quickly, answer honestly, and lean on your first instinct. The questions are
                    designed to surface how you respond when closeness, conflict, reassurance, and
                    space start to feel emotionally charged.
                  </p>

                  <p className="mt-8 text-sm text-muted">
                    25 questions, about four minutes, four attachment styles.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-3xl border border-border bg-white p-4">
                    <span className="landing-section-kicker mb-1.5">Length</span>
                    <strong className="block text-sm font-medium text-dark">25 questions</strong>
                  </div>
                  <div className="rounded-3xl border border-border bg-white p-4">
                    <span className="landing-section-kicker mb-1.5">Time</span>
                    <strong className="block text-sm font-medium text-dark">About 4 minutes</strong>
                  </div>
                  <div className="rounded-3xl border border-border bg-white p-4">
                    <span className="landing-section-kicker mb-1.5">Results</span>
                    <strong className="block text-sm font-medium text-dark">4 attachment styles</strong>
                  </div>
                  <div className="rounded-3xl border border-border bg-white p-4 sm:col-span-3 lg:col-span-1">
                    <p className="landing-section-kicker mb-3">Styles you may see</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(attachmentResults).map((result) => (
                        <span key={result.type} className={`rounded-full px-3 py-1 text-xs font-medium ${result.badgeClass}`}>
                          {result.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-border bg-white p-6 shadow-report-card md:p-8">
            <ProgressBar
              className="mb-8"
              label="Progress"
              caption={progressCaption}
              meta={progressMeta}
              value={hasStarted ? progressPercentage : 0}
            />

            <Transition
              mode="out-in"
              enterActiveClass="transition duration-200 ease-out"
              enterFromClass="translate-y-3 opacity-0"
              enterToClass="translate-y-0 opacity-100"
              leaveActiveClass="transition duration-200 ease-in"
              leaveFromClass="translate-y-0 opacity-100"
              leaveToClass="translate-y-3 opacity-0"
            >
              {step}
            </Transition>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showRestartConfirm}
        kicker="Restart test"
        title="Start over from the beginning?"
        description="This will clear your current progress and bring back the intro and before-you-begin sections."
        confirmLabel="Yes, restart"
        cancelLabel="Keep current progress"
        onClose={() => setShowRestartConfirm(false)}
        onConfirm={confirmRestart}
      />
    </section>
  )
}

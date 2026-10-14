'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState, useTransition, type FormEvent } from 'react'
import AppButton from '@/components/AppButton'
import CouplesReportView from '@/components/CouplesReportView'
import TurnstileWidget, { type TurnstileWidgetHandle } from '@/components/TurnstileWidget'
import { getApiErrorMessage, requestJson } from '@/lib/api-client'
import { cx } from '@/lib/cx'
import { usePrimaryAction } from '@/lib/hooks/usePrimaryAction'
import { useTest } from '@/lib/hooks/useTest'
import { buildAttachmentCouplesReport } from '@/shared/attachment/couples-report'
import type { AttachmentCouplesPersistedReportResponse } from '@/shared/attachment/couples-persistence'
import type { AttachmentComputedResult } from '@/shared/attachment/scoring'

export type CouplesResultSource = {
  token: string
  result: AttachmentComputedResult
}

type CouplesBuilderProps = {
  rawSelfQuery: string
  rawPartnerQuery: string
  selfSource: CouplesResultSource | null
  partnerSource: CouplesResultSource | null
  selfFetchError: string
  partnerFetchError: string
}

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'
const inputClass =
  'w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-dark outline-none transition-colors duration-200 placeholder:text-muted focus:border-terra'

const tokenPattern = /^[a-f0-9]{16}$/i

const extractResultToken = (value: string) => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  if (tokenPattern.test(trimmedValue)) {
    return trimmedValue.toLowerCase()
  }

  const matchedToken = trimmedValue.match(/\/r\/([a-f0-9]{16})(?:[/?#]|$)/i)

  return matchedToken?.[1]?.toLowerCase() ?? null
}

export default function CouplesBuilder({
  rawSelfQuery,
  rawPartnerQuery,
  selfSource,
  partnerSource,
  selfFetchError,
  partnerFetchError,
}: CouplesBuilderProps) {
  const router = useRouter()
  const [loadingResults, startLoadingResults] = useTransition()
  const [openingReport, startOpeningReport] = useTransition()
  const { computedResult, hasSubmittedResults, session, storageHydrated } = useTest()
  const { href: primaryActionHref, label: primaryActionLabel } = usePrimaryAction()

  const [selfInput, setSelfInput] = useState(rawSelfQuery)
  const [partnerInput, setPartnerInput] = useState(rawPartnerQuery)
  const [syncedQuery, setSyncedQuery] = useState({ self: rawSelfQuery, partner: rawPartnerQuery })
  const [selfInputError, setSelfInputError] = useState('')
  const [partnerInputError, setPartnerInputError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [savingReport, setSavingReport] = useState(false)
  const turnstileWidget = useRef<TurnstileWidgetHandle | null>(null)

  if (syncedQuery.self !== rawSelfQuery || syncedQuery.partner !== rawPartnerQuery) {
    if (syncedQuery.self !== rawSelfQuery) {
      setSelfInput(rawSelfQuery)
    }

    if (syncedQuery.partner !== rawPartnerQuery) {
      setPartnerInput(rawPartnerQuery)
    }

    setSyncedQuery({ self: rawSelfQuery, partner: rawPartnerQuery })
  }

  const selfToken = tokenPattern.test(rawSelfQuery) ? rawSelfQuery.toLowerCase() : null
  const partnerToken = tokenPattern.test(rawPartnerQuery) ? rawPartnerQuery.toLowerCase() : null
  const localSelfResult = storageHydrated && hasSubmittedResults ? computedResult : null
  const localSelfAnswers = storageHydrated && hasSubmittedResults ? session.answers : null
  const resolvedSelfResult = selfSource?.result ?? localSelfResult
  const resolvedPartnerResult = partnerSource?.result ?? null

  const couplesReport = useMemo(
    () => (resolvedSelfResult && resolvedPartnerResult
      ? buildAttachmentCouplesReport(resolvedSelfResult, resolvedPartnerResult)
      : null),
    [resolvedSelfResult, resolvedPartnerResult],
  )

  const hasSelfContext = resolvedSelfResult !== null
  const isUsingLocalSelfResult = !selfSource && localSelfResult !== null

  const selfResultHref = selfSource?.token
    ? `/r/${selfSource.token}`
    : session.lastSharedResultToken
      ? `/r/${session.lastSharedResultToken}`
      : resolvedSelfResult?.type
        ? `/results/${resolvedSelfResult.type}`
        : '/test/attachment'

  const missingStateTitle = !hasSelfContext
    ? 'Start with your own result.'
    : !resolvedPartnerResult
      ? 'Add your partner result.'
      : 'Compare both results.'

  const missingStateCopy = !hasSelfContext
    ? 'The couples report compares two completed attachment results. Finish your test or paste your own shared result link, then add your partner link.'
    : 'Paste your partner shared result link or token below. The report will compare both profiles side by side and highlight the most likely friction and repair pattern.'

  const comparisonBuilderKicker = couplesReport ? 'Comparison loaded' : 'Build the comparison'

  const comparisonBuilderTitle = couplesReport
    ? 'These source links built the report below.'
    : hasSelfContext ? 'Add your partner shared result.' : 'Paste both shared result links.'

  const comparisonBuilderCopy = couplesReport
    ? 'The comparison below is already generated from these results. You can still replace either link and update the comparison before creating a shareable report link.'
    : missingStateCopy

  const comparisonSubmitLabel = loadingResults
    ? 'Loading results'
    : couplesReport ? 'Update comparison' : 'Build couples report'

  const selfStatusNote = selfSource?.token
    ? 'Using your shared result link.'
    : isUsingLocalSelfResult ? 'Using your latest completed result from this device.' : ''

  const canPersistReport = couplesReport !== null
    && (Boolean(selfToken) || localSelfAnswers !== null)
    && Boolean(partnerToken)

  const creatingShareLink = savingReport || openingReport

  const submitComparison = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextSelfToken = hasSelfContext
      ? selfToken ?? session.lastSharedResultToken ?? null
      : extractResultToken(selfInput)
    const nextPartnerToken = extractResultToken(partnerInput)
    let nextSelfError = ''
    let nextPartnerError = ''

    if (!hasSelfContext && !nextSelfToken) {
      nextSelfError = 'Paste your result link or raw token.'
    }

    if (!nextPartnerToken) {
      nextPartnerError = 'Paste your partner result link or raw token.'
    }

    if (nextSelfToken && nextPartnerToken && nextSelfToken === nextPartnerToken) {
      nextPartnerError = 'Use a different partner result link.'
    }

    setSelfInputError(nextSelfError)
    setPartnerInputError(nextPartnerError)

    if (nextSelfError || nextPartnerError || !nextPartnerToken) {
      return
    }

    const query = new URLSearchParams({ partner: nextPartnerToken })

    if (nextSelfToken) {
      query.set('self', nextSelfToken)
    }

    startLoadingResults(() => {
      router.push(`/couples?${query}`, { scroll: false })
    })
  }

  const createShareLink = async () => {
    if (!canPersistReport || !partnerToken) {
      return
    }

    setSaveError('')
    setSavingReport(true)

    try {
      const turnstileToken = await turnstileWidget.current?.getToken() ?? ''
      const response = await requestJson<AttachmentCouplesPersistedReportResponse>('/api/couples', {
        left: selfToken ? { token: selfToken } : { answers: localSelfAnswers },
        right: { token: partnerToken },
        turnstileToken,
      })

      startOpeningReport(() => {
        router.push(`/couples/${response.record.token}`)
      })
    } catch (error) {
      setSaveError(getApiErrorMessage(error, 'We could not save a shareable couples report just now.'))
      turnstileWidget.current?.reset()
    } finally {
      setSavingReport(false)
    }
  }

  return (
    <section className="landing-page-section bg-cream">
      <div className="landing-container">
        <div className="grid gap-5">
          <header className={`${panelShellClass} bg-sec-bg`}>
            <p className="landing-section-kicker">Couples report</p>
            <h1 className="landing-section-title">
              {couplesReport ? couplesReport.dynamicLabel : 'Compare two attachment results.'}
            </h1>
            <p className="landing-section-copy max-w-160">
              {couplesReport ? couplesReport.overview : 'Paste two completed result links to see where the relationship is likely to feel safe, where it gets protective, and what repair move matters most for this pairing.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <AppButton
                href={selfResultHref}
                label={couplesReport ? 'Open your result' : primaryActionLabel}
                size="sm"
                showArrow
              />
              <span className="landing-action-note">
                {hasSelfContext ? 'Add your partner result below' : 'Needs two completed results'}
              </span>
            </div>
          </header>

          <section className={`${panelShellClass} bg-white`}>
            <p className={noteKickerClass}>{comparisonBuilderKicker}</p>
            <h2 className={sectionTitleClass}>
              {comparisonBuilderTitle}
            </h2>
            <p className={bodyCopyClass}>
              {comparisonBuilderCopy}
            </p>

            {selfStatusNote && (
              <div className="mt-6 rounded-2xl border border-border bg-sec-bg px-4 py-3 text-sm leading-6 text-dark2">
                {selfStatusNote}
              </div>
            )}

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submitComparison}>
              {!hasSelfContext && (
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-dark">Your shared result link</span>
                  <input
                    value={selfInput}
                    onChange={(event) => setSelfInput(event.target.value)}
                    type="text"
                    className={inputClass}
                    placeholder="Paste /r/ link or raw token"
                    autoComplete="off"
                  />
                  {selfInputError && <span className="text-sm text-terra">{selfInputError}</span>}
                </label>
              )}

              <label className={cx('grid gap-2', hasSelfContext && 'md:col-span-2')}>
                <span className="text-sm font-medium text-dark">Partner shared result link</span>
                <input
                  value={partnerInput}
                  onChange={(event) => setPartnerInput(event.target.value)}
                  type="text"
                  className={inputClass}
                  placeholder="Paste /r/ link or raw token"
                  autoComplete="off"
                />
                {partnerInputError && <span className="text-sm text-terra">{partnerInputError}</span>}
              </label>

              <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                <AppButton type="submit" size="sm" disabled={loadingResults}>
                  {comparisonSubmitLabel}
                </AppButton>
                <span className="text-sm text-muted">Supports raw tokens or full shared result URLs.</span>
              </div>
            </form>

            {selfFetchError && (
              <p className="mt-4 text-sm leading-6 text-terra">
                {selfFetchError}
              </p>
            )}
            {partnerFetchError && (
              <p className="mt-2 text-sm leading-6 text-terra">
                {partnerFetchError}
              </p>
            )}
          </section>

          {!couplesReport
            ? (
                <div className={`${panelShellClass} bg-sec-bg`}>
                  <p className={noteKickerClass}>What this compares</p>
                  <h2 className={sectionTitleClass}>{missingStateTitle}</h2>
                  <p className={bodyCopyClass}>
                    {missingStateCopy}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <AppButton href={primaryActionHref} label={primaryActionLabel} size="sm" showArrow />
                    <span className="text-sm text-muted">One completed result for each person.</span>
                  </div>
                </div>
              )
            : (
                <>
                  <section className={`${panelShellClass} bg-white`}>
                    <p className={noteKickerClass}>Shareable version</p>
                    <h2 className={sectionTitleClass}>Save this couples report.</h2>
                    <p className={bodyCopyClass}>
                      Persist this exact comparison as its own shareable snapshot so the pair read stays stable even outside this builder page.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <AppButton size="sm" disabled={!canPersistReport || creatingShareLink} onClick={createShareLink}>
                        {creatingShareLink ? 'Creating share link' : 'Create share link'}
                      </AppButton>
                      <span className="text-sm text-muted">Saves this exact couples comparison.</span>
                    </div>

                    {saveError && (
                      <p className="mt-4 text-sm leading-6 text-terra">
                        {saveError}
                      </p>
                    )}

                    <TurnstileWidget ref={turnstileWidget} action="save-couples-report" />
                  </section>

                  <CouplesReportView report={couplesReport} profileLabels={['You', 'Partner']} />
                </>
              )}
        </div>
      </div>
    </section>
  )
}

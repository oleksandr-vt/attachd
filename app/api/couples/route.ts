import { randomBytes } from 'node:crypto'
import {
  ATTACHMENT_COUPLES_REPORT_VERSION,
  type AttachmentCouplesPersistedReportRecord,
  type AttachmentCouplesPersistedReportResponse,
} from '@/shared/attachment/couples-persistence'
import { buildAttachmentCouplesReport } from '@/shared/attachment/couples-report'
import {
  computeAttachmentResult,
  isAttachmentAnswerComplete,
  normalizeAttachmentAnswers,
} from '@/shared/attachment/scoring'
import { getAttachmentResultRecord } from '@/server/utils/attachment-result-store'
import {
  findAttachmentCouplesReportBySourcePair,
  insertAttachmentCouplesReportRecord,
} from '@/server/utils/attachment-couples-report-store'
import {
  HttpError,
  assertTurnstileToken,
  enforceRateLimit,
  getClientIp,
  getSiteOrigin,
  readGuardedJsonBody,
  withErrorHandling,
} from '@/server/utils/next-guards'

type CouplesReportSourceInput = {
  token?: unknown
  answers?: unknown
}

const tokenPattern = /^[a-f0-9]{16}$/i
const MAX_TOKEN_ATTEMPTS = 3

const createShareToken = () => randomBytes(8).toString('hex')

const readSourceInput = (value: unknown): CouplesReportSourceInput =>
  value && typeof value === 'object' ? value as CouplesReportSourceInput : {}

const resolveSourceToken = (value: unknown) => {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmedValue = value.trim().toLowerCase()
  return tokenPattern.test(trimmedValue) ? trimmedValue : ''
}

const loadSavedResult = async (sourceToken: string, contextLabel: string) => {
  const persistedResult = await getAttachmentResultRecord(sourceToken)

  if (!persistedResult) {
    throw new HttpError(404, `The ${contextLabel} attachment result was not found.`)
  }

  return persistedResult.result
}

export const POST = withErrorHandling(async (request: Request) => {
  const body = await readGuardedJsonBody(request)
  const left = readSourceInput(body.left)
  const right = readSourceInput(body.right)
  const leftSourceToken = resolveSourceToken(left.token)
  const rightSourceToken = resolveSourceToken(right.token)
  const leftAnswers = normalizeAttachmentAnswers(left.answers)

  if (!rightSourceToken) {
    throw new HttpError(400, 'Paste your partner shared result link before creating a couples report.')
  }

  if (!leftSourceToken && !isAttachmentAnswerComplete(leftAnswers)) {
    throw new HttpError(400, 'Provide a completed first attachment result before creating a couples report.')
  }

  if (leftSourceToken === rightSourceToken) {
    throw new HttpError(400, 'Use two different results to create a couples report.')
  }

  await assertTurnstileToken(request, body.turnstileToken, 'save-couples-report')

  const siteOrigin = getSiteOrigin(request)

  if (leftSourceToken) {
    const existingRecord = await findAttachmentCouplesReportBySourcePair(
      leftSourceToken,
      rightSourceToken,
      ATTACHMENT_COUPLES_REPORT_VERSION,
    )

    if (existingRecord) {
      return Response.json({
        record: existingRecord,
        shareUrl: `${siteOrigin}/couples/${existingRecord.token}`,
      } satisfies AttachmentCouplesPersistedReportResponse)
    }
  }

  const leftResult = leftSourceToken
    ? await loadSavedResult(leftSourceToken, 'first')
    : computeAttachmentResult(leftAnswers)
  const rightResult = await loadSavedResult(rightSourceToken, 'second')

  await enforceRateLimit(
    'couplesReportsPerIp',
    'You have saved several couples reports in a short time. Please try again a little later.',
    getClientIp(request),
  )
  await enforceRateLimit(
    'couplesReportsGlobal',
    'Attachd has reached its daily limit for new couples reports. Please try again tomorrow.',
  )

  const report = buildAttachmentCouplesReport(leftResult, rightResult)
  let record: AttachmentCouplesPersistedReportRecord | null = null

  for (let attempt = 0; attempt < MAX_TOKEN_ATTEMPTS && !record; attempt += 1) {
    const candidate: AttachmentCouplesPersistedReportRecord = {
      token: createShareToken(),
      slug: 'attachment-couples',
      createdAt: new Date().toISOString(),
      reportVersion: ATTACHMENT_COUPLES_REPORT_VERSION,
      leftSourceToken,
      rightSourceToken,
      leftPrimaryType: leftResult.type,
      rightPrimaryType: rightResult.type,
      leftResult,
      rightResult,
      report,
    }

    if (await insertAttachmentCouplesReportRecord(candidate)) {
      record = candidate
    }
  }

  if (!record) {
    throw new HttpError(500, 'We could not save a shareable couples report just now.')
  }

  return Response.json({
    record,
    shareUrl: `${siteOrigin}/couples/${record.token}`,
  } satisfies AttachmentCouplesPersistedReportResponse)
})

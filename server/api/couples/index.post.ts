import { randomBytes } from 'node:crypto'
import {
  ATTACHMENT_COUPLES_REPORT_VERSION,
  type AttachmentCouplesPersistedReportRecord,
  type AttachmentCouplesPersistedReportResponse,
} from '~~/shared/attachment/couples-persistence'
import { buildAttachmentCouplesReport } from '~~/shared/attachment/couples-report'
import {
  computeAttachmentResult,
  isAttachmentAnswerComplete,
  normalizeAttachmentAnswers,
} from '~~/shared/attachment/scoring'
import { getAttachmentResultRecord } from '~~/server/utils/attachment-result-store'
import {
  findAttachmentCouplesReportBySourcePair,
  insertAttachmentCouplesReportRecord,
} from '~~/server/utils/attachment-couples-report-store'
import {
  assertTurnstileToken,
  enforceRateLimit,
  getClientIp,
  getSiteOrigin,
  readGuardedJsonBody,
} from '~~/server/utils/h3-guards'

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
    throw createError({
      statusCode: 404,
      statusMessage: `The ${contextLabel} attachment result was not found.`,
    })
  }

  return persistedResult.result
}

export default defineEventHandler(async (event): Promise<AttachmentCouplesPersistedReportResponse> => {
  const body = await readGuardedJsonBody(event)
  const left = readSourceInput(body.left)
  const right = readSourceInput(body.right)
  const leftSourceToken = resolveSourceToken(left.token)
  const rightSourceToken = resolveSourceToken(right.token)
  const leftAnswers = normalizeAttachmentAnswers(left.answers)

  if (!rightSourceToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Paste your partner shared result link before creating a couples report.',
    })
  }

  if (!leftSourceToken && !isAttachmentAnswerComplete(leftAnswers)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Provide a completed first attachment result before creating a couples report.',
    })
  }

  if (leftSourceToken === rightSourceToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Use two different results to create a couples report.',
    })
  }

  await assertTurnstileToken(event, body.turnstileToken, 'save-couples-report')

  const siteOrigin = getSiteOrigin(event)

  if (leftSourceToken) {
    const existingRecord = await findAttachmentCouplesReportBySourcePair(
      leftSourceToken,
      rightSourceToken,
      ATTACHMENT_COUPLES_REPORT_VERSION,
    )

    if (existingRecord) {
      return {
        record: existingRecord,
        shareUrl: `${siteOrigin}/couples/${existingRecord.token}`,
      }
    }
  }

  const leftResult = leftSourceToken
    ? await loadSavedResult(leftSourceToken, 'first')
    : computeAttachmentResult(leftAnswers)
  const rightResult = await loadSavedResult(rightSourceToken, 'second')

  await enforceRateLimit(
    event,
    'couplesReportsPerIp',
    'You have saved several couples reports in a short time. Please try again a little later.',
    getClientIp(event),
  )
  await enforceRateLimit(
    event,
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
    throw createError({
      statusCode: 500,
      statusMessage: 'We could not save a shareable couples report just now.',
    })
  }

  return {
    record,
    shareUrl: `${siteOrigin}/couples/${record.token}`,
  }
})

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
  type AttachmentAnswerMap,
  type AttachmentComputedResult,
} from '~~/shared/attachment/scoring'
import { getAttachmentResultRecord } from '~~/server/utils/attachment-result-store'
import {
  getAttachmentCouplesReportRecord,
  saveAttachmentCouplesReportRecord,
} from '~~/server/utils/attachment-couples-report-store'

type CouplesReportSourceInput = {
  token?: unknown
  answers?: unknown
}

type CreateAttachmentCouplesReportBody = {
  left?: CouplesReportSourceInput
  right?: CouplesReportSourceInput
}

type ResolvedCouplesReportSource = {
  sourceToken: string
  answers: AttachmentAnswerMap | null
  result: AttachmentComputedResult
}

const tokenPattern = /^[a-f0-9]{16}$/i

const createShareToken = () => randomBytes(8).toString('hex')

const createUniqueShareToken = async () => {
  let token = createShareToken()

  while (await getAttachmentCouplesReportRecord(token)) {
    token = createShareToken()
  }

  return token
}

const resolveSourceToken = (value: unknown) => {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmedValue = value.trim().toLowerCase()
  return tokenPattern.test(trimmedValue) ? trimmedValue : ''
}

const resolveCouplesReportSource = async (
  source: CouplesReportSourceInput | undefined,
  contextLabel: string,
): Promise<ResolvedCouplesReportSource> => {
  const sourceToken = resolveSourceToken(source?.token)

  if (sourceToken) {
    const persistedResult = await getAttachmentResultRecord(sourceToken)

    if (!persistedResult) {
      throw createError({
        statusCode: 404,
        statusMessage: `The ${contextLabel} attachment result was not found.`,
      })
    }

    return {
      sourceToken,
      answers: persistedResult.answers,
      result: persistedResult.result,
    }
  }

  const answers = normalizeAttachmentAnswers(source?.answers)

  if (!isAttachmentAnswerComplete(answers)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Provide a completed ${contextLabel} attachment result before creating a couples report.`,
    })
  }

  return {
    sourceToken: '',
    answers,
    result: computeAttachmentResult(answers),
  }
}

export default defineEventHandler(async (event): Promise<AttachmentCouplesPersistedReportResponse> => {
  const body = await readBody<CreateAttachmentCouplesReportBody>(event)
  const leftSource = await resolveCouplesReportSource(body.left, 'first')
  const rightSource = await resolveCouplesReportSource(body.right, 'second')
  const token = await createUniqueShareToken()
  const createdAt = new Date().toISOString()
  const requestUrl = getRequestURL(event)
  const report = buildAttachmentCouplesReport(leftSource.result, rightSource.result)

  const record: AttachmentCouplesPersistedReportRecord = {
    token,
    slug: 'attachment-couples',
    createdAt,
    reportVersion: ATTACHMENT_COUPLES_REPORT_VERSION,
    leftSourceToken: leftSource.sourceToken,
    rightSourceToken: rightSource.sourceToken,
    leftPrimaryType: leftSource.result.type,
    rightPrimaryType: rightSource.result.type,
    leftResult: leftSource.result,
    rightResult: rightSource.result,
    report,
  }

  await saveAttachmentCouplesReportRecord(record)

  return {
    record,
    shareUrl: `${requestUrl.origin}/couples/${token}`,
  }
})

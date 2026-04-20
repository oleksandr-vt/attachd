import { randomBytes } from 'node:crypto'
import { attachmentTest } from '~~/app/data/tests/attachment'
import {
  ATTACHMENT_QUESTION_SET_VERSION,
  ATTACHMENT_SCORING_VERSION,
  type AttachmentPersistedResultRecord,
  type AttachmentPersistedResultResponse,
} from '~~/shared/attachment/persistence'
import {
  computeAttachmentResult,
  isAttachmentAnswerComplete,
  normalizeAttachmentAnswers,
} from '~~/shared/attachment/scoring'
import {
  getAttachmentResultRecord,
  saveAttachmentResultRecord,
} from '~~/server/utils/attachment-result-store'

type CreateAttachmentResultBody = {
  answers?: unknown
}

const createShareToken = () => randomBytes(8).toString('hex')

const createUniqueShareToken = async () => {
  let token = createShareToken()

  while (await getAttachmentResultRecord(token)) {
    token = createShareToken()
  }

  return token
}

export default defineEventHandler(async (event): Promise<AttachmentPersistedResultResponse> => {
  const body = await readBody<CreateAttachmentResultBody>(event)
  const answers = normalizeAttachmentAnswers(body.answers)

  if (!isAttachmentAnswerComplete(answers)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Complete all ${attachmentTest.questions.length} questions before creating a result.`,
    })
  }

  const result = computeAttachmentResult(answers)
  const token = await createUniqueShareToken()
  const createdAt = new Date().toISOString()
  const requestUrl = getRequestURL(event)
  const shareUrl = `${requestUrl.origin}/r/${token}`

  const record: AttachmentPersistedResultRecord = {
    token,
    slug: 'attachment',
    createdAt,
    questionSetVersion: ATTACHMENT_QUESTION_SET_VERSION,
    scoringVersion: ATTACHMENT_SCORING_VERSION,
    answers,
    result,
    primaryType: result.type,
    secondaryType: result.secondaryType,
    email: '',
    emailUnlocked: false,
  }

  await saveAttachmentResultRecord(record)

  return {
    record,
    shareUrl,
  }
})

import {
  toAttachmentPersistedResultPublicRecord,
  type AttachmentPersistedResultResponse,
} from '~~/shared/attachment/persistence'
import { getAttachmentResultRecord } from '~~/server/utils/attachment-result-store'
import { getSiteOrigin } from '~~/server/utils/h3-guards'

export default defineEventHandler(async (event): Promise<AttachmentPersistedResultResponse> => {
  const token = getRouterParam(event, 'token')

  if (!token || !/^[a-f0-9]{16}$/i.test(token)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Result not found',
    })
  }

  const record = await getAttachmentResultRecord(token)

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Result not found',
    })
  }

  return {
    record: toAttachmentPersistedResultPublicRecord(record),
    shareUrl: `${getSiteOrigin(event)}/r/${token}`,
    emailVerificationSent: Boolean(record.emailVerificationSentAt),
  }
})

import type { AttachmentPersistedResultResponse } from '~~/shared/attachment/persistence'
import { updateAttachmentResultRecord } from '~~/server/utils/attachment-result-store'

type UnlockAttachmentEmailBody = {
  email?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event): Promise<AttachmentPersistedResultResponse> => {
  const token = getRouterParam(event, 'token')

  if (!token || !/^[a-f0-9]{16}$/i.test(token)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Result not found',
    })
  }

  const body = await readBody<UnlockAttachmentEmailBody>(event)
  const email = body.email?.trim() ?? ''

  if (!emailPattern.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Enter a valid email address to update this result.',
    })
  }

  const record = await updateAttachmentResultRecord(token, (currentRecord) => ({
    ...currentRecord,
    email,
    emailUnlocked: true,
  }))

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Result not found',
    })
  }

  const requestUrl = getRequestURL(event)

  return {
    record,
    shareUrl: `${requestUrl.origin}/r/${token}`,
  }
})

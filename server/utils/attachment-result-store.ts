import { and, eq, isNull } from 'drizzle-orm'
import type { AttachmentPersistedResultRecord } from '@/shared/attachment/persistence'
import { getDb } from '@/server/db/client'
import {
  attachmentResults,
  mapAttachmentResultRecordToRow,
  mapAttachmentResultRowToRecord,
} from '@/server/db/schema'

export const getAttachmentResultRecord = async (token: string) => {
  const db = getDb()
  const record = await db.query.attachmentResults.findFirst({
    where: eq(attachmentResults.token, token),
  })

  return record ? mapAttachmentResultRowToRecord(record) : null
}

export const getAttachmentResultRecordByEmailVerificationHash = async (tokenHash: string) => {
  const db = getDb()
  const record = await db.query.attachmentResults.findFirst({
    where: eq(attachmentResults.emailVerificationTokenHash, tokenHash),
  })

  return record ? mapAttachmentResultRowToRecord(record) : null
}

export const insertAttachmentResultRecord = async (record: AttachmentPersistedResultRecord) => {
  const inserted = await getDb()
    .insert(attachmentResults)
    .values(mapAttachmentResultRecordToRow(record))
    .onConflictDoNothing({ target: attachmentResults.token })
    .returning({ token: attachmentResults.token })

  return inserted.length > 0
}

export const markAttachmentResultVerificationEmailSent = async (token: string) => {
  await getDb()
    .update(attachmentResults)
    .set({ emailVerificationSentAt: new Date().toISOString() })
    .where(eq(attachmentResults.token, token))
}

export const markAttachmentResultEmailVerified = async (token: string) => {
  await getDb()
    .update(attachmentResults)
    .set({ emailVerifiedAt: new Date().toISOString() })
    .where(and(
      eq(attachmentResults.token, token),
      isNull(attachmentResults.emailVerifiedAt),
    ))
}

export const claimAttachmentWelcomeEmail = async (token: string) => {
  const claimed = await getDb()
    .update(attachmentResults)
    .set({ welcomeEmailSentAt: new Date().toISOString() })
    .where(and(
      eq(attachmentResults.token, token),
      isNull(attachmentResults.welcomeEmailSentAt),
    ))
    .returning({ token: attachmentResults.token })

  return claimed.length > 0
}

export const releaseAttachmentWelcomeEmailClaim = async (token: string) => {
  await getDb()
    .update(attachmentResults)
    .set({ welcomeEmailSentAt: null })
    .where(eq(attachmentResults.token, token))
}

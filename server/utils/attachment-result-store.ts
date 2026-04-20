import { eq } from 'drizzle-orm'
import type { AttachmentPersistedResultRecord } from '~~/shared/attachment/persistence'
import { getDb } from '~~/server/db/client'
import {
  attachmentResults,
  mapAttachmentResultRecordToRow,
  mapAttachmentResultRowToRecord,
} from '~~/server/db/schema'

const getUpdatableAttachmentResultRow = (record: AttachmentPersistedResultRecord) => {
  const { token: _token, ...row } = mapAttachmentResultRecordToRow(record)
  return row
}

export const getAttachmentResultRecord = async (token: string) => {
  const db = getDb()
  const record = await db.query.attachmentResults.findFirst({
    where: eq(attachmentResults.token, token),
  })

  return record ? mapAttachmentResultRowToRecord(record) : null
}

export const saveAttachmentResultRecord = async (record: AttachmentPersistedResultRecord) => {
  const db = getDb()
  const row = mapAttachmentResultRecordToRow(record)

  await db
    .insert(attachmentResults)
    .values(row)
    .onConflictDoUpdate({
      target: attachmentResults.token,
      set: getUpdatableAttachmentResultRow(record),
    })
}

export const updateAttachmentResultRecord = async (
  token: string,
  updater: (record: AttachmentPersistedResultRecord) => AttachmentPersistedResultRecord,
) => {
  const db = getDb()

  return db.transaction(async (tx) => {
    const currentRecord = await tx.query.attachmentResults.findFirst({
      where: eq(attachmentResults.token, token),
    })

    if (!currentRecord) {
      return null
    }

    const nextRecord = updater(mapAttachmentResultRowToRecord(currentRecord))

    await tx
      .update(attachmentResults)
      .set(getUpdatableAttachmentResultRow(nextRecord))
      .where(eq(attachmentResults.token, token))

    return nextRecord
  })
}

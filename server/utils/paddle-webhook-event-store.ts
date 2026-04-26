import { eq } from 'drizzle-orm'
import { getDb } from '~~/server/db/client'
import {
  paddleWebhookEvents,
  type PaddleWebhookEventInsert,
  type PaddleWebhookEventRow,
} from '~~/server/db/schema'

export type PaddleWebhookEventRecord = {
  eventId: string
  eventType: string
  notificationId: string
  receivedAt: string
  processedAt: string | null
  processingError: string
}

const mapPaddleWebhookEventRowToRecord = (
  row: PaddleWebhookEventRow,
): PaddleWebhookEventRecord => ({
  eventId: row.eventId,
  eventType: row.eventType,
  notificationId: row.notificationId,
  receivedAt: row.receivedAt,
  processedAt: row.processedAt,
  processingError: row.processingError,
})

const mapPaddleWebhookEventRecordToRow = (
  record: PaddleWebhookEventRecord,
): PaddleWebhookEventInsert => ({
  eventId: record.eventId,
  eventType: record.eventType,
  notificationId: record.notificationId,
  receivedAt: record.receivedAt,
  processedAt: record.processedAt,
  processingError: record.processingError,
})

export const getPaddleWebhookEventRecord = async (eventId: string) => {
  const db = getDb()
  const record = await db.query.paddleWebhookEvents.findFirst({
    where: eq(paddleWebhookEvents.eventId, eventId),
  })

  return record ? mapPaddleWebhookEventRowToRecord(record) : null
}

export const savePaddleWebhookEventRecord = async (record: PaddleWebhookEventRecord) => {
  const db = getDb()

  await db
    .insert(paddleWebhookEvents)
    .values(mapPaddleWebhookEventRecordToRow(record))
    .onConflictDoNothing({
      target: paddleWebhookEvents.eventId,
    })
}

export const markPaddleWebhookEventProcessed = async (
  eventId: string,
  processingError: string = '',
) => {
  const db = getDb()

  await db
    .update(paddleWebhookEvents)
    .set({
      processedAt: new Date().toISOString(),
      processingError,
    })
    .where(eq(paddleWebhookEvents.eventId, eventId))
}

export const markPaddleWebhookEventError = async (
  eventId: string,
  processingError: string,
) => {
  const db = getDb()

  await db
    .update(paddleWebhookEvents)
    .set({
      processingError,
    })
    .where(eq(paddleWebhookEvents.eventId, eventId))
}

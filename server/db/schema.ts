import { boolean, jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import type { AttachmentPersistedResultRecord } from '~~/shared/attachment/persistence'
import type { AttachmentAnswerMap, AttachmentComputedResult } from '~~/shared/attachment/scoring'

export const attachmentResults = pgTable('attachment_results', {
  token: varchar('token', { length: 16 }).primaryKey(),
  slug: varchar('slug', { length: 32 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
  questionSetVersion: text('question_set_version').notNull(),
  scoringVersion: text('scoring_version').notNull(),
  answers: jsonb('answers').$type<AttachmentAnswerMap>().notNull(),
  result: jsonb('result').$type<AttachmentComputedResult>().notNull(),
  primaryType: varchar('primary_type', { length: 32 }).notNull(),
  secondaryType: varchar('secondary_type', { length: 32 }).notNull(),
  email: text('email').notNull().default(''),
  emailUnlocked: boolean('email_unlocked').notNull().default(false),
})

export type AttachmentResultRow = typeof attachmentResults.$inferSelect
export type AttachmentResultInsert = typeof attachmentResults.$inferInsert

export const mapAttachmentResultRowToRecord = (
  row: AttachmentResultRow,
): AttachmentPersistedResultRecord => ({
  token: row.token,
  slug: row.slug as AttachmentPersistedResultRecord['slug'],
  createdAt: row.createdAt,
  questionSetVersion: row.questionSetVersion,
  scoringVersion: row.scoringVersion,
  answers: row.answers,
  result: row.result,
  primaryType: row.primaryType as AttachmentPersistedResultRecord['primaryType'],
  secondaryType: row.secondaryType as AttachmentPersistedResultRecord['secondaryType'],
  email: row.email,
  emailUnlocked: row.emailUnlocked,
})

export const mapAttachmentResultRecordToRow = (
  record: AttachmentPersistedResultRecord,
): AttachmentResultInsert => ({
  token: record.token,
  slug: record.slug,
  createdAt: record.createdAt,
  questionSetVersion: record.questionSetVersion,
  scoringVersion: record.scoringVersion,
  answers: record.answers,
  result: record.result,
  primaryType: record.primaryType,
  secondaryType: record.secondaryType,
  email: record.email,
  emailUnlocked: record.emailUnlocked,
})

import { boolean, jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import type { AttachmentCouplesPersistedReportRecord } from '~~/shared/attachment/couples-persistence'
import type { AttachmentPersistedResultRecord } from '~~/shared/attachment/persistence'
import type { AttachmentCouplesReport } from '~~/shared/attachment/couples-report'
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
  emailVerificationTokenHash: text('email_verification_token_hash').notNull().default(''),
  emailVerificationSentAt: timestamp('email_verification_sent_at', { withTimezone: true, mode: 'string' }),
  emailVerificationExpiresAt: timestamp('email_verification_expires_at', { withTimezone: true, mode: 'string' }),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true, mode: 'string' }),
})

export const attachmentCouplesReports = pgTable('attachment_couples_reports', {
  token: varchar('token', { length: 16 }).primaryKey(),
  slug: varchar('slug', { length: 32 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
  reportVersion: text('report_version').notNull(),
  leftSourceToken: varchar('left_source_token', { length: 16 }).notNull().default(''),
  rightSourceToken: varchar('right_source_token', { length: 16 }).notNull().default(''),
  leftPrimaryType: varchar('left_primary_type', { length: 32 }).notNull(),
  rightPrimaryType: varchar('right_primary_type', { length: 32 }).notNull(),
  leftResult: jsonb('left_result').$type<AttachmentComputedResult>().notNull(),
  rightResult: jsonb('right_result').$type<AttachmentComputedResult>().notNull(),
  report: jsonb('report').$type<AttachmentCouplesReport>().notNull(),
})

export type AttachmentResultRow = typeof attachmentResults.$inferSelect
export type AttachmentResultInsert = typeof attachmentResults.$inferInsert
export type AttachmentCouplesReportRow = typeof attachmentCouplesReports.$inferSelect
export type AttachmentCouplesReportInsert = typeof attachmentCouplesReports.$inferInsert

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
  emailVerificationTokenHash: row.emailVerificationTokenHash,
  emailVerificationSentAt: row.emailVerificationSentAt,
  emailVerificationExpiresAt: row.emailVerificationExpiresAt,
  emailVerifiedAt: row.emailVerifiedAt,
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
  emailVerificationTokenHash: record.emailVerificationTokenHash,
  emailVerificationSentAt: record.emailVerificationSentAt,
  emailVerificationExpiresAt: record.emailVerificationExpiresAt,
  emailVerifiedAt: record.emailVerifiedAt,
})

export const mapAttachmentCouplesReportRowToRecord = (
  row: AttachmentCouplesReportRow,
): AttachmentCouplesPersistedReportRecord => ({
  token: row.token,
  slug: row.slug as AttachmentCouplesPersistedReportRecord['slug'],
  createdAt: row.createdAt,
  reportVersion: row.reportVersion,
  leftSourceToken: row.leftSourceToken,
  rightSourceToken: row.rightSourceToken,
  leftPrimaryType: row.leftPrimaryType as AttachmentCouplesPersistedReportRecord['leftPrimaryType'],
  rightPrimaryType: row.rightPrimaryType as AttachmentCouplesPersistedReportRecord['rightPrimaryType'],
  leftResult: row.leftResult,
  rightResult: row.rightResult,
  report: row.report,
})

export const mapAttachmentCouplesReportRecordToRow = (
  record: AttachmentCouplesPersistedReportRecord,
): AttachmentCouplesReportInsert => ({
  token: record.token,
  slug: record.slug,
  createdAt: record.createdAt,
  reportVersion: record.reportVersion,
  leftSourceToken: record.leftSourceToken,
  rightSourceToken: record.rightSourceToken,
  leftPrimaryType: record.leftPrimaryType,
  rightPrimaryType: record.rightPrimaryType,
  leftResult: record.leftResult,
  rightResult: record.rightResult,
  report: record.report,
})

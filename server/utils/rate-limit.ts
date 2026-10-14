import { createHash } from 'node:crypto'
import { lt, sql } from 'drizzle-orm'
import { getDb } from '~~/server/db/client'
import { rateLimitBuckets } from '~~/server/db/schema'
import { getAbuseLimit, type AbuseLimitName } from '~~/server/utils/abuse-limits'

const PRUNE_PROBABILITY = 0.02
const BUCKET_RETENTION_MS = 2 * 24 * 60 * 60 * 1000

export type RateLimitOutcome = {
  allowed: boolean
  limit: number
  hits: number
  retryAfterSeconds: number
}

const hashSubject = (subject: string) =>
  createHash('sha256').update(subject).digest('hex')

const pruneExpiredBuckets = async (now: number) => {
  try {
    await getDb()
      .delete(rateLimitBuckets)
      .where(lt(rateLimitBuckets.windowStart, new Date(now - BUCKET_RETENTION_MS).toISOString()))
  } catch (error) {
    console.warn(error)
  }
}

export const consumeRateLimit = async (
  name: AbuseLimitName,
  subject?: string,
): Promise<RateLimitOutcome> => {
  const { limit, windowSeconds } = getAbuseLimit(name)
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const windowStartMs = Math.floor(now / windowMs) * windowMs
  const key = `${name}:${subject === undefined ? 'global' : hashSubject(subject)}`

  const [bucket] = await getDb()
    .insert(rateLimitBuckets)
    .values({
      key,
      windowStart: new Date(windowStartMs).toISOString(),
      hits: 1,
    })
    .onConflictDoUpdate({
      target: [rateLimitBuckets.key, rateLimitBuckets.windowStart],
      set: { hits: sql`${rateLimitBuckets.hits} + 1` },
    })
    .returning({ hits: rateLimitBuckets.hits })

  if (Math.random() < PRUNE_PROBABILITY) {
    await pruneExpiredBuckets(now)
  }

  const hits = bucket?.hits ?? limit + 1

  return {
    allowed: hits <= limit,
    limit,
    hits,
    retryAfterSeconds: Math.max(1, Math.ceil((windowStartMs + windowMs - now) / 1000)),
  }
}

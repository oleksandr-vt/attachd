import type { H3Event } from 'h3'
import { resolveSiteOrigin } from '~~/shared/site-url'
import type { AbuseLimitName } from '~~/server/utils/abuse-limits'
import { resolveClientIp } from '~~/server/utils/client-ip'
import { consumeRateLimit } from '~~/server/utils/rate-limit'
import {
  checkDeclaredContentLength,
  checkJsonContentType,
  checkRequestOrigin,
  parseJsonObjectBody,
} from '~~/server/utils/request-guard'
import { verifyTurnstileToken } from '~~/server/utils/turnstile'

export const getSiteOrigin = (event: H3Event) =>
  resolveSiteOrigin(useRuntimeConfig(event).public.siteUrl, getRequestURL(event).origin)

export const getClientIp = (event: H3Event) =>
  resolveClientIp({
    forwardedFor: getRequestHeader(event, 'x-forwarded-for'),
    realIp: getRequestHeader(event, 'x-real-ip'),
    socketAddress: getRequestIP(event),
    trustProxyHeaders: Boolean(process.env.VERCEL),
  })

export const readGuardedJsonBody = async (event: H3Event) => {
  const failure =
    checkRequestOrigin(getRequestHeader(event, 'origin'), getRequestHost(event)) ??
    checkJsonContentType(getRequestHeader(event, 'content-type')) ??
    checkDeclaredContentLength(getRequestHeader(event, 'content-length'))

  if (failure) {
    throw createError(failure)
  }

  const parsed = parseJsonObjectBody(await readRawBody(event, 'utf8'))

  if ('statusCode' in parsed) {
    throw createError(parsed)
  }

  return parsed.body
}

export const assertTurnstileToken = async (event: H3Event, token: unknown, expectedAction: string) => {
  const verification = await verifyTurnstileToken({
    token,
    expectedAction,
    expectedHostname: new URL(getSiteOrigin(event)).hostname,
  })

  if (!verification.ok) {
    throw createError({
      statusCode: verification.statusCode,
      statusMessage: verification.statusMessage,
    })
  }
}

export const enforceRateLimit = async (
  event: H3Event,
  name: AbuseLimitName,
  statusMessage: string,
  subject?: string | null,
) => {
  if (subject === null) {
    return
  }

  const outcome = await consumeRateLimit(name, subject)

  if (outcome.allowed) {
    return
  }

  setResponseHeader(event, 'Retry-After', outcome.retryAfterSeconds)
  throw createError({
    statusCode: subject === undefined ? 503 : 429,
    statusMessage,
  })
}

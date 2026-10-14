import 'server-only'
import { resolveSiteOrigin } from '@/shared/site-url'
import type { AbuseLimitName } from '@/server/utils/abuse-limits'
import { resolveClientIp } from '@/server/utils/client-ip'
import { consumeRateLimit } from '@/server/utils/rate-limit'
import {
  checkDeclaredContentLength,
  checkJsonContentType,
  checkRequestOrigin,
  parseJsonObjectBody,
} from '@/server/utils/request-guard'
import { verifyTurnstileToken } from '@/server/utils/turnstile'

export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    readonly statusMessage: string,
    readonly headers: Record<string, string> = {},
  ) {
    super(statusMessage)
  }
}

export const errorResponse = (statusCode: number, statusMessage: string, headers: Record<string, string> = {}) =>
  Response.json({ statusCode, statusMessage, message: statusMessage }, { status: statusCode, headers })

export const withErrorHandling = <Args extends unknown[]>(handler: (...args: Args) => Promise<Response>) =>
  async (...args: Args) => {
    try {
      return await handler(...args)
    } catch (error) {
      if (error instanceof HttpError) {
        return errorResponse(error.statusCode, error.statusMessage, error.headers)
      }

      console.error(error)
      return errorResponse(500, 'Server Error')
    }
  }

const getHeader = (request: Request, name: string) => request.headers.get(name) ?? undefined

export const getSiteOrigin = (request: Request) =>
  resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL, new URL(request.url).origin)

export const getClientIp = (request: Request) => {
  const forwardedFor = getHeader(request, 'x-forwarded-for')

  return resolveClientIp({
    forwardedFor,
    realIp: getHeader(request, 'x-real-ip'),
    // next start fills x-forwarded-for from the socket when the client sent none
    socketAddress: process.env.NODE_ENV === 'production' ? forwardedFor?.split(',').at(-1) : undefined,
    trustProxyHeaders: Boolean(process.env.VERCEL),
  })
}

export const readGuardedJsonBody = async (request: Request) => {
  const failure =
    checkRequestOrigin(getHeader(request, 'origin'), getHeader(request, 'host')) ??
    checkJsonContentType(getHeader(request, 'content-type')) ??
    checkDeclaredContentLength(getHeader(request, 'content-length'))

  if (failure) {
    throw new HttpError(failure.statusCode, failure.statusMessage)
  }

  const parsed = parseJsonObjectBody(await request.text())

  if ('statusCode' in parsed) {
    throw new HttpError(parsed.statusCode, parsed.statusMessage)
  }

  return parsed.body
}

export const assertTurnstileToken = async (request: Request, token: unknown, expectedAction: string) => {
  const verification = await verifyTurnstileToken({
    token,
    expectedAction,
    expectedHostname: new URL(getSiteOrigin(request)).hostname,
  })

  if (!verification.ok) {
    throw new HttpError(verification.statusCode, verification.statusMessage)
  }
}

export const enforceRateLimit = async (
  name: AbuseLimitName,
  statusMessage: string,
  subject?: string | null,
) => {
  if (subject === null) {
    return
  }

  const outcome = await consumeRateLimit(name, subject)

  if (!outcome.allowed) {
    throw new HttpError(subject === undefined ? 503 : 429, statusMessage, {
      'Retry-After': String(outcome.retryAfterSeconds),
    })
  }
}

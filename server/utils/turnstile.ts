import 'server-only'

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const VERIFY_TIMEOUT_MS = 5000
const MAX_TOKEN_LENGTH = 2048
// Cloudflare test secrets accept a public dummy token and return dummy action/hostname
const testSecretPattern = /^[123]x0+AA$/

type SiteverifyResponse = {
  'success'?: boolean
  'action'?: string
  'hostname'?: string
  'error-codes'?: string[]
}

export type TurnstileVerification =
  | {
    ok: true
  }
  | {
    ok: false
    statusCode: 403 | 503
    statusMessage: string
  }

type VerifyTurnstileTokenOptions = {
  token: unknown
  expectedAction: string
  expectedHostname: string
}

const rejected: TurnstileVerification = {
  ok: false,
  statusCode: 403,
  statusMessage: 'We could not confirm this request came from a person. Please try again.',
}

const unavailable: TurnstileVerification = {
  ok: false,
  statusCode: 503,
  statusMessage: 'Verification is unavailable right now. Please try again in a moment.',
}

export const verifyTurnstileToken = async ({
  token,
  expectedAction,
  expectedHostname,
}: VerifyTurnstileTokenOptions): Promise<TurnstileVerification> => {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
  const isProduction = process.env.NODE_ENV === 'production'

  if (!secret) {
    if (isProduction) {
      console.error('TURNSTILE_SECRET_KEY is not configured; rejecting writes.')
      return unavailable
    }

    return { ok: true }
  }

  const usesTestSecret = testSecretPattern.test(secret)

  if (usesTestSecret && isProduction && process.env.TURNSTILE_ALLOW_TEST_KEYS !== 'true') {
    console.error('Cloudflare Turnstile test keys are not allowed in production.')
    return unavailable
  }

  if (typeof token !== 'string' || !token || token.length > MAX_TOKEN_LENGTH) {
    return rejected
  }

  let outcome: SiteverifyResponse

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    })
    outcome = await response.json() as SiteverifyResponse
  } catch (error) {
    console.warn(error)
    return unavailable
  }

  if (!outcome.success) {
    return rejected
  }

  if (!usesTestSecret && (outcome.action !== expectedAction || outcome.hostname !== expectedHostname)) {
    return rejected
  }

  return { ok: true }
}

export const MAX_JSON_BODY_BYTES = 16 * 1024

export type RequestGuardFailure = {
  statusCode: 400 | 403 | 413 | 415
  statusMessage: string
}

export type JsonObjectBody = Record<string, unknown>

const bodyTooLarge: RequestGuardFailure = {
  statusCode: 413,
  statusMessage: 'Request body is too large.',
}

export const checkRequestOrigin = (
  origin: string | undefined,
  host: string | undefined,
): RequestGuardFailure | null => {
  if (!origin) {
    return null
  }

  let originHost = ''

  try {
    originHost = new URL(origin).host.toLowerCase()
  } catch {
    originHost = ''
  }

  if (originHost && originHost === host?.toLowerCase()) {
    return null
  }

  return {
    statusCode: 403,
    statusMessage: 'Cross-site requests are not allowed.',
  }
}

// Forces a CORS preflight, which blocks cross-site "no-cors" posts
export const checkJsonContentType = (contentType: string | undefined): RequestGuardFailure | null => {
  const mediaType = contentType?.split(';')[0]?.trim().toLowerCase()

  return mediaType === 'application/json'
    ? null
    : {
        statusCode: 415,
        statusMessage: 'Send the request body as JSON.',
      }
}

export const checkDeclaredContentLength = (
  contentLength: string | undefined,
  maxBytes: number = MAX_JSON_BODY_BYTES,
): RequestGuardFailure | null => {
  const declaredBytes = Number(contentLength)

  return Number.isFinite(declaredBytes) && declaredBytes > maxBytes ? bodyTooLarge : null
}

export const parseJsonObjectBody = (
  rawBody: string | undefined,
  maxBytes: number = MAX_JSON_BODY_BYTES,
): { body: JsonObjectBody } | RequestGuardFailure => {
  if (rawBody && new TextEncoder().encode(rawBody).byteLength > maxBytes) {
    return bodyTooLarge
  }

  let body: unknown = null

  try {
    body = rawBody ? JSON.parse(rawBody) : null
  } catch {
    body = null
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      statusCode: 400,
      statusMessage: 'Send a JSON object in the request body.',
    }
  }

  return { body: body as JsonObjectBody }
}

export class ApiError extends Error {
  constructor(readonly statusCode: number, readonly statusMessage: string | undefined) {
    super(statusMessage || `Request failed with status ${statusCode}`)
  }
}

const userFacingStatusCodes = new Set([400, 403, 429, 503])

export const requestJson = async <T>(url: string, body?: unknown): Promise<T> => {
  const response = await fetch(url, body === undefined
    ? undefined
    : {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const statusMessage = (payload as { statusMessage?: unknown } | null)?.statusMessage
    throw new ApiError(response.status, typeof statusMessage === 'string' ? statusMessage : undefined)
  }

  return payload as T
}

export const getApiErrorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError && userFacingStatusCodes.has(error.statusCode) && error.statusMessage
    ? error.statusMessage
    : fallback

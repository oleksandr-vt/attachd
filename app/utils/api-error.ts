type ApiErrorShape = {
  statusCode?: unknown
  data?: {
    statusMessage?: unknown
    message?: unknown
  }
}

const userFacingStatusCodes = new Set([400, 403, 429, 503])

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') {
    return fallback
  }

  const apiError = error as ApiErrorShape

  if (typeof apiError.statusCode !== 'number' || !userFacingStatusCodes.has(apiError.statusCode)) {
    return fallback
  }

  const message = apiError.data?.statusMessage ?? apiError.data?.message
  return typeof message === 'string' && message ? message : fallback
}

export type PaddleEnvironment = 'production' | 'sandbox'

export type PaddleCheckoutConfig = {
  clientToken: string
  environment: PaddleEnvironment
  priceId: string
}

const getExpectedClientTokenPrefix = (environment: PaddleEnvironment) =>
  environment === 'sandbox' ? 'test_' : 'live_'

const resolvePaddleEnvironment = (value: string | undefined): PaddleEnvironment => {
  if (value?.trim().toLowerCase() === 'production') {
    return 'production'
  }

  return 'sandbox'
}

export const getPaddleCheckoutConfigError = () => {
  const environment = resolvePaddleEnvironment(process.env.PADDLE_ENVIRONMENT)
  const clientToken = process.env.PADDLE_CLIENT_TOKEN?.trim()
  const priceId = process.env.PADDLE_PDF_PRICE_ID?.trim()
  const expectedTokenPrefix = getExpectedClientTokenPrefix(environment)

  if (!clientToken) {
    return 'PADDLE_CLIENT_TOKEN is not configured.'
  }

  if (!clientToken.startsWith(expectedTokenPrefix)) {
    return `PADDLE_CLIENT_TOKEN must start with ${expectedTokenPrefix} when PADDLE_ENVIRONMENT is ${environment}.`
  }

  if (!priceId) {
    return 'PADDLE_PDF_PRICE_ID is not configured.'
  }

  if (!priceId.startsWith('pri_')) {
    return 'PADDLE_PDF_PRICE_ID must be a Paddle price id that starts with pri_, not a product id.'
  }

  return ''
}

export const getPaddleCheckoutConfig = (): PaddleCheckoutConfig | null => {
  const clientToken = process.env.PADDLE_CLIENT_TOKEN?.trim()
  const priceId = process.env.PADDLE_PDF_PRICE_ID?.trim()
  const environment = resolvePaddleEnvironment(process.env.PADDLE_ENVIRONMENT)

  if (!clientToken || !priceId || getPaddleCheckoutConfigError()) {
    return null
  }

  return {
    clientToken,
    environment,
    priceId,
  }
}

export const getPaddleWebhookSecret = () =>
  process.env.PADDLE_WEBHOOK_SECRET_KEY?.trim() ?? ''

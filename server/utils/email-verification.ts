import { createHash, randomBytes } from 'node:crypto'

const EMAIL_VERIFICATION_TOKEN_BYTES = 32
const EMAIL_VERIFICATION_TTL_DAYS = 7

export const createEmailVerificationToken = () =>
  randomBytes(EMAIL_VERIFICATION_TOKEN_BYTES).toString('hex')

export const hashEmailVerificationToken = (token: string) =>
  createHash('sha256').update(token).digest('hex')

export const createEmailVerificationExpiresAt = () =>
  new Date(Date.now() + EMAIL_VERIFICATION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()

export const isEmailVerificationExpired = (expiresAt: string | null) =>
  expiresAt ? new Date(expiresAt).getTime() < Date.now() : false

export const isEmailVerificationToken = (token: unknown): token is string =>
  typeof token === 'string' && /^[a-f0-9]{64}$/i.test(token)

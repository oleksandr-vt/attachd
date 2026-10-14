export const MAX_EMAIL_LENGTH = 254

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isEmailFormatValid = (email: string) =>
  email.length <= MAX_EMAIL_LENGTH && emailPattern.test(email)

export type OptionalEmailInput =
  | {
    valid: true
    email: string
  }
  | {
    valid: false
  }

export const normalizeOptionalEmail = (value: unknown): OptionalEmailInput => {
  if (value === undefined || value === null) {
    return { valid: true, email: '' }
  }

  if (typeof value !== 'string') {
    return { valid: false }
  }

  const email = value.trim().toLowerCase()

  if (!email) {
    return { valid: true, email: '' }
  }

  return isEmailFormatValid(email) ? { valid: true, email } : { valid: false }
}

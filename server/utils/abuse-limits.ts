const HOUR_IN_SECONDS = 60 * 60
const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS

const baseAbuseLimits = {
  resultsPerIp: { limit: 10, windowSeconds: HOUR_IN_SECONDS },
  couplesReportsPerIp: { limit: 20, windowSeconds: HOUR_IN_SECONDS },
  resultsGlobal: { limit: 300, windowSeconds: DAY_IN_SECONDS },
  couplesReportsGlobal: { limit: 300, windowSeconds: DAY_IN_SECONDS },
  emailsPerRecipient: { limit: 2, windowSeconds: DAY_IN_SECONDS },
  emailsPerIp: { limit: 3, windowSeconds: DAY_IN_SECONDS },
  // Resend free plan: 100/day
  emailsGlobal: { limit: 90, windowSeconds: DAY_IN_SECONDS },
} satisfies Record<string, { limit: number, windowSeconds: number }>

export type AbuseLimitName = keyof typeof baseAbuseLimits

export type AbuseLimit = {
  name: AbuseLimitName
  limit: number
  windowSeconds: number
}

const getLimitMultiplier = () => {
  const multiplier = Number(process.env.RATE_LIMIT_MULTIPLIER)
  return Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 1
}

export const getAbuseLimit = (name: AbuseLimitName): AbuseLimit => {
  const { limit, windowSeconds } = baseAbuseLimits[name]

  return {
    name,
    limit: Math.max(1, Math.round(limit * getLimitMultiplier())),
    windowSeconds,
  }
}

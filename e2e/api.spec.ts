import { expect, test } from '@playwright/test'
import {
  TURNSTILE_DUMMY_TOKEN,
  anxiousLeaningAnswers,
  avoidantLeaningAnswers,
  createSavedCouplesReport,
  createSavedResult,
} from './helpers'

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'API checks run in the desktop project only')
})

test('rejects writes without a bot-check token', async ({ request }) => {
  const response = await request.post('/api/results', {
    data: { answers: anxiousLeaningAnswers },
  })

  expect(response.status()).toBe(403)
})

test('rejects non-JSON, cross-site and malformed bodies', async ({ request }) => {
  const textBody = await request.post('/api/results', {
    headers: { 'content-type': 'text/plain' },
    data: JSON.stringify({ answers: anxiousLeaningAnswers }),
  })
  expect(textBody.status()).toBe(415)

  const crossSite = await request.post('/api/results', {
    headers: { origin: 'https://evil.example' },
    data: { answers: anxiousLeaningAnswers, turnstileToken: TURNSTILE_DUMMY_TOKEN },
  })
  expect(crossSite.status()).toBe(403)

  const nullBody = await request.post('/api/results', {
    headers: { 'content-type': 'application/json' },
    data: 'null',
  })
  expect(nullBody.status()).toBe(400)

  const oversized = await request.post('/api/results', {
    headers: { 'content-type': 'application/json' },
    data: JSON.stringify({ padding: 'x'.repeat(300 * 1024) }),
  })
  expect(oversized.status()).toBe(413)
})

test('validates answers and optional email', async ({ request }) => {
  const fractional = await request.post('/api/results', {
    data: {
      answers: { ...anxiousLeaningAnswers, q01: 2.5 },
      turnstileToken: TURNSTILE_DUMMY_TOKEN,
    },
  })
  expect(fractional.status()).toBe(400)

  const longEmail = await request.post('/api/results', {
    data: {
      answers: anxiousLeaningAnswers,
      email: `${'a'.repeat(10_000)}@example.com`,
      turnstileToken: TURNSTILE_DUMMY_TOKEN,
    },
  })
  expect(longEmail.status()).toBe(400)

  const withoutEmail = await request.post('/api/results', {
    data: { answers: anxiousLeaningAnswers, turnstileToken: TURNSTILE_DUMMY_TOKEN },
  })
  expect(withoutEmail.status()).toBe(200)
  const payload = await withoutEmail.json()
  expect(payload.emailVerificationSent).toBe(false)
  expect(payload.record).not.toHaveProperty('email')
  expect(payload.record).not.toHaveProperty('answers')
})

test('couples reports require a saved partner result and dedupe identical pairs', async ({ request }) => {
  const leftToken = await createSavedResult(request, anxiousLeaningAnswers)
  const rightToken = await createSavedResult(request, avoidantLeaningAnswers)

  const rawPartner = await request.post('/api/couples', {
    data: {
      left: { token: leftToken },
      right: { answers: avoidantLeaningAnswers },
      turnstileToken: TURNSTILE_DUMMY_TOKEN,
    },
  })
  expect(rawPartner.status()).toBe(400)

  const samePair = await request.post('/api/couples', {
    data: {
      left: { token: leftToken },
      right: { token: leftToken },
      turnstileToken: TURNSTILE_DUMMY_TOKEN,
    },
  })
  expect(samePair.status()).toBe(400)

  const firstToken = await createSavedCouplesReport(request, leftToken, rightToken)
  const secondToken = await createSavedCouplesReport(request, leftToken, rightToken)
  expect(secondToken).toBe(firstToken)
})

test('removed payment and email-overwrite routes are gone', async ({ request }) => {
  const resultToken = await createSavedResult(request, anxiousLeaningAnswers)

  const removedRoutes = [
    request.post('/api/paddle/webhook', { data: {} }),
    request.post(`/api/reports/attachment/${resultToken}/checkout`, { data: {} }),
    request.get(`/api/reports/attachment/${'0'.repeat(32)}`),
    request.post(`/api/results/${resultToken}/email`, { data: { email: 'someone@example.com' } }),
  ]

  for (const response of await Promise.all(removedRoutes)) {
    expect([404, 405]).toContain(response.status())
  }
})

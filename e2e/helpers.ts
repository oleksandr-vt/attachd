import { expect, type APIRequestContext, type Page } from '@playwright/test'

export const SESSION_STORAGE_KEY = 'attachd:attachment-test'
export const TURNSTILE_DUMMY_TOKEN = 'XXXX.DUMMY.TOKEN.XXXX'
export const QUESTION_COUNT = 25

export const questionIds = Array.from(
  { length: QUESTION_COUNT },
  (_, index) => `q${String(index + 1).padStart(2, '0')}`,
)

export const buildAnswers = (pickValue: (index: number) => number) =>
  Object.fromEntries(questionIds.map((id, index) => [id, pickValue(index)]))

export const anxiousLeaningAnswers = buildAnswers((index) => (index < 5 || index === 22 ? 4 : 1))
export const avoidantLeaningAnswers = buildAnswers((index) => ((index >= 5 && index < 10) || index === 23 ? 4 : 1))

export const createSavedResult = async (
  request: APIRequestContext,
  answers: Record<string, number>,
) => {
  const response = await request.post('/api/results', {
    data: { answers, turnstileToken: TURNSTILE_DUMMY_TOKEN },
  })

  expect(response.status()).toBe(200)
  const payload = await response.json() as { record: { token: string } }
  return payload.record.token
}

export const createSavedCouplesReport = async (
  request: APIRequestContext,
  leftToken: string,
  rightToken: string,
) => {
  const response = await request.post('/api/couples', {
    data: {
      left: { token: leftToken },
      right: { token: rightToken },
      turnstileToken: TURNSTILE_DUMMY_TOKEN,
    },
  })

  expect(response.status()).toBe(200)
  const payload = await response.json() as { record: { token: string } }
  return payload.record.token
}

export const seedCompletedSession = async (page: Page, answers: Record<string, number>) => {
  const session = {
    slug: 'attachment',
    currentIndex: QUESTION_COUNT - 1,
    answers,
    startedAt: '2026-01-01T00:00:00.000Z',
    completedAt: '2026-01-01T00:05:00.000Z',
    lastResultType: null,
    lastComputedResult: null,
    lastSharedResultToken: null,
    email: '',
  }

  await page.addInitScript(([key, value]) => {
    window.localStorage.setItem(key, value)
  }, [SESSION_STORAGE_KEY, JSON.stringify(session)] as const)
}

export const waitForFonts = async (page: Page) => {
  await page.evaluate(async () => {
    await document.fonts.ready
  })
}

import { expect, test, type Page } from '@playwright/test'
import {
  QUESTION_COUNT,
  avoidantLeaningAnswers,
  createSavedResult,
  seedCompletedSession,
} from './helpers'

const answerEveryQuestion = async (page: Page) => {
  for (let questionNumber = 1; questionNumber <= QUESTION_COUNT; questionNumber += 1) {
    const question = page.locator('article').filter({ hasText: `Question ${questionNumber} of ${QUESTION_COUNT}` })

    await question.getByRole('button', { name: /Mostly like me/ }).click()
    await page.getByRole('button', {
      name: questionNumber === QUESTION_COUNT ? 'Finish the test' : 'Next question',
    }).click()
  }
}

test('landing page no longer sells a paid report', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Go beyond the label.' })).toBeVisible()
  await expect(page.getByText('Free · no account needed')).toBeVisible()
  await expect(page.getByText(/PDF|\$9|premium/i)).toHaveCount(0)
})

test('take the test without an email, then build and share a couples report', async ({ page, request }) => {
  const partnerToken = await createSavedResult(request, avoidantLeaningAnswers)

  await page.goto('/test/attachment')
  await page.getByRole('button', { name: 'Start the test' }).click()
  await answerEveryQuestion(page)

  await expect(page.getByRole('heading', { name: 'Your answers are complete.' })).toBeVisible()
  await expect(page.getByText('Email address (optional)')).toBeVisible()
  await page.getByRole('button', { name: 'Continue to my results' }).click()

  await page.waitForURL(/\/r\/[a-f0-9]{16}$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('attachment.')
  await expect(page.getByRole('heading', { name: 'Turn it into a couples read.' })).toBeVisible()
  await expect(page.getByText(/PDF|\$9|checkout/i)).toHaveCount(0)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')

  await page.getByRole('link', { name: /Compare with partner/ }).click()
  await page.waitForURL(/\/couples\?self=[a-f0-9]{16}$/)

  await page.getByLabel('Partner shared result link').fill(`/r/${partnerToken}`)
  await page.getByRole('button', { name: 'Build couples report' }).click()
  await page.waitForURL(new RegExp(`partner=${partnerToken}`))

  await expect(page.getByRole('heading', { name: 'Save this couples report.' })).toBeVisible()
  await page.getByRole('button', { name: 'Create share link' }).click()

  await page.waitForURL(/\/couples\/[a-f0-9]{16}$/)
  await expect(page.getByText('Source pair')).toBeVisible()
})

test('saving with an email shows a notice when the email could not be sent', async ({ page }) => {
  await seedCompletedSession(page, avoidantLeaningAnswers)
  await page.goto('/test/attachment')

  await page.getByLabel('Email address (optional)').fill(`e2e+${Date.now()}@example.com`)
  await page.getByRole('button', { name: 'Continue to my results' }).click()

  await page.waitForURL(/\/r\/[a-f0-9]{16}\?email=unsent$/)
  await expect(page.getByText('Email not sent')).toBeVisible()
})

test('an invalid email is rejected before anything is saved', async ({ page }) => {
  await seedCompletedSession(page, avoidantLeaningAnswers)
  await page.goto('/test/attachment')

  await page.getByLabel('Email address (optional)').fill('someone@localhost')
  await page.getByRole('button', { name: 'Continue to my results' }).click()

  await expect(page.getByText('Enter a valid email address, or leave the field empty.')).toBeVisible()
  await expect(page).toHaveURL(/\/test\/attachment$/)
})

test('the restart dialog can be dismissed without losing progress', async ({ page }) => {
  await page.goto('/test/attachment')
  await page.getByRole('button', { name: 'Start the test' }).click()

  const firstQuestion = page.locator('article').filter({ hasText: `Question 1 of ${QUESTION_COUNT}` })
  await firstQuestion.getByRole('button', { name: /Mostly like me/ }).click()
  await page.getByRole('button', { name: 'Restart' }).click()

  await expect(page.getByRole('heading', { name: 'Start over from the beginning?' })).toBeVisible()
  await page.getByRole('button', { name: 'Keep current progress' }).click()

  await expect(page.getByRole('heading', { name: 'Start over from the beginning?' })).toHaveCount(0)
  await expect(firstQuestion).toBeVisible()
})

test('unknown result and couples tokens return 404', async ({ page }) => {
  const resultResponse = await page.goto('/r/0000000000000000')
  expect(resultResponse?.status()).toBe(404)

  const couplesResponse = await page.goto('/couples/0000000000000000')
  expect(couplesResponse?.status()).toBe(404)
})

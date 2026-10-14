import { expect, test, type Locator, type Page } from '@playwright/test'
import {
  anxiousLeaningAnswers,
  avoidantLeaningAnswers,
  createSavedCouplesReport,
  createSavedResult,
  seedCompletedSession,
  waitForFonts,
} from './helpers'

let selfToken = ''
let partnerToken = ''
let couplesToken = ''

test.beforeAll(async ({ request }) => {
  selfToken = await createSavedResult(request, anxiousLeaningAnswers)
  partnerToken = await createSavedResult(request, avoidantLeaningAnswers)
  couplesToken = await createSavedCouplesReport(request, selfToken, partnerToken)
})

const capture = async (page: Page, name: string, mask: Locator[] = []) => {
  await waitForFonts(page)
  await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, mask })
}

const shareLinkText = (page: Page) => page.locator('p.break-all')

test('landing', async ({ page }) => {
  await page.goto('/')
  await capture(page, 'landing')
})

for (const type of ['secure', 'anxious', 'avoidant', 'fearful-avoidant']) {
  test(`type guide ${type}`, async ({ page }) => {
    await page.goto(`/results/${type}`)
    await capture(page, `results-${type}`)
  })
}

test('test intro', async ({ page }) => {
  await page.goto('/test/attachment')
  await capture(page, 'test-intro')
})

test('test first question', async ({ page }) => {
  await page.goto('/test/attachment')
  await page.getByRole('button', { name: 'Start the test' }).click()
  await expect(page.getByText('Pick one answer to continue')).toBeVisible()
  await capture(page, 'test-question')
})

test('test save step', async ({ page }) => {
  await seedCompletedSession(page, anxiousLeaningAnswers)
  await page.goto('/test/attachment')
  await expect(page.getByRole('button', { name: 'Continue to my results' })).toBeVisible()
  await capture(page, 'test-save-step')
})

test('test restart dialog', async ({ page }) => {
  await page.goto('/test/attachment')
  await page.getByRole('button', { name: 'Start the test' }).click()
  await page.getByRole('button', { name: 'Restart' }).click()
  await expect(page.getByRole('heading', { name: 'Start over from the beginning?' })).toBeVisible()
  await capture(page, 'test-restart-dialog')
})

test('saved result', async ({ page }) => {
  await page.goto(`/r/${selfToken}`)
  await capture(page, 'result', [shareLinkText(page)])
})

test('saved result with email notice', async ({ page }) => {
  await page.goto(`/r/${selfToken}?email=pending`)
  await capture(page, 'result-email-pending', [shareLinkText(page)])
})

test('couples builder empty', async ({ page }) => {
  await page.goto('/couples')
  await capture(page, 'couples-empty')
})

test('couples builder with report', async ({ page }) => {
  await page.goto(`/couples?self=${selfToken}&partner=${partnerToken}`)
  await expect(page.getByRole('heading', { name: 'Save this couples report.' })).toBeVisible()
  await capture(page, 'couples-report')
})

test('saved couples report', async ({ page }) => {
  await page.goto(`/couples/${couplesToken}`)
  await capture(page, 'couples-saved', [
    shareLinkText(page),
    page.getByText(/captured on/),
  ])
})

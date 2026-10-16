import 'dotenv/config'
import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.E2E_PORT ?? 3100)
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`

const serverEnv: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined),
  ),
  PORT: String(port),
  NEXT_PUBLIC_SITE_URL: baseURL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000BB',
  TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  TURNSTILE_ALLOW_TEST_KEYS: 'true',
  RATE_LIMIT_MULTIPLIER: '1000',
  RESEND_API_KEY: '',
}

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: process.env.E2E_SKIP_BUILD
          ? `npx next start -p ${port}`
          : `npx next build && npx next start -p ${port}`,
        url: baseURL,
        env: serverEnv,
        timeout: 300_000,
        reuseExistingServer: false,
        stdout: 'ignore',
        stderr: 'pipe',
      },
})

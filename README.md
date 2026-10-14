# Attachd.

A free attachment-style test. Answer 25 questions, get a personalized result page you can revisit and
share, optionally email yourself a copy, and compare your result with a partner's in a couples report.

Built as a portfolio project with Next.js 16 (App Router, React 19), Tailwind CSS v4, Drizzle ORM on
Postgres (Neon) and Resend.

> Educational and self-reflective only — not a diagnosis, therapy or mental health care.

## Features

- **Test runner** — 25 questions with progress saved in `localStorage`, so visitors can leave and resume.
- **Shared scoring** — the same scoring module runs in the browser (instant preview) and on the server,
  which recomputes every result instead of trusting the client.
- **Saved results** (`/r/:token`) — immutable snapshots tagged with question-set and scoring versions,
  rendered on the server with real 404s for unknown links.
- **Type guides** (`/results/:type`) — statically generated pages for the four attachment styles.
- **Couples report** (`/couples`) — compares two saved results and can be saved as its own snapshot.
- **Optional email copy** — double opt-in: a confirmation link first, then a one-time welcome email.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 App Router (React 19, Server Components, route handlers) |
| Styling | Tailwind CSS v4 |
| Database | Postgres via Drizzle ORM + `postgres` driver (hosted on Neon) |
| Email | Resend HTTP API |
| Bot protection | Cloudflare Turnstile |
| Tests | Playwright (journeys, API checks, screenshot baselines) |

## Getting started

```bash
npm install
cp .env.example .env    # set DATABASE_URL; Resend keys are optional
npm run db:migrate      # apply migrations in drizzle/
npm run dev             # http://localhost:3000
```

Without Resend keys the app works normally and simply skips emails. In development the verification
link is also printed to the server console, so the email flow can be tested without an inbox.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (use Neon's pooled URL in serverless deployments) |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO_EMAIL` | Email sending; optional |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for email links and canonical URLs |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile keys |
| `TURNSTILE_ALLOW_TEST_KEYS` | Allows Cloudflare's test keys in a production build (e2e runs only) |
| `RATE_LIMIT_MULTIPLIER` | Scales every abuse limit (e.g. `1000` for e2e, `0.01` to exercise daily caps) |

`NEXT_PUBLIC_*` values are inlined at build time, so set them in the **build** environment too and
rebuild after changing them.

## Abuse protection

The backend is public and free-tier hosted, so every write path is guarded. Cheap checks run first,
so automated traffic never reaches the database:

1. **Request guard** — JSON only, 16 KB body cap, and cross-site `Origin` headers are rejected.
2. **Validation** — answers must be integers 0–4 for all 25 questions; emails are length-capped
   before any regex runs.
3. **Cloudflare Turnstile** — required for creating results and couples reports. In production the
   API refuses to run without a secret, and refuses Cloudflare's public test keys.
4. **Rate limits and daily caps** — fixed-window counters in Postgres
   ([server/utils/abuse-limits.ts](server/utils/abuse-limits.ts)) keyed by SHA-256 hashes, never raw
   IPs or emails: results and couples reports per IP, emails per recipient and per IP, and global
   daily caps that keep the database and the Resend quota bounded.
5. **Email hygiene** — links are built from the configured site URL (never the `Host` header), the
   welcome email is claimed atomically so it cannot be sent twice, and Resend calls time out.

On Vercel the client IP comes from `x-real-ip` / `x-forwarded-for`, which Vercel overwrites. Under
`next start` elsewhere it is the socket address Next.js copies into `x-forwarded-for` (spoofable unless
a proxy in front overwrites that header), and under `next dev` per-IP limits are skipped while
Turnstile and the global caps still apply. Adjust `getClientIp` in
[server/utils/next-guards.ts](server/utils/next-guards.ts) if you deploy behind a different proxy.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js development server, production build, production server |
| `npm run lint` | ESLint with the Next.js core-web-vitals and TypeScript rules |
| `npm run typecheck` | Generates route types and type-checks the whole project |
| `npm run db:generate` / `db:migrate` / `db:studio` | Drizzle migrations and studio |
| `npm run test:e2e` | Builds the app, starts it with e2e settings and runs the journey and API tests |
| `npm run test:visual` | Full-page screenshots of every route at 390 / 768 / 1440 px |

Before the first e2e run, install a browser with `npx playwright install chromium`. Screenshot
baselines are not committed; create them with `npm run test:visual -- --update-snapshots`. Set
`E2E_SKIP_BUILD=1` to reuse an existing build, or `E2E_BASE_URL` to test an already running server.
E2E runs write test rows to the configured database, so point `DATABASE_URL` at a development branch.

## Deployment

The app targets Vercel: import the repository, set the environment variables above for the
production build (Neon's pooled connection string for `DATABASE_URL`, real Turnstile keys for the
deployment's hostname), and pick a function region close to the database.

## Project structure

```text
app/                routes: landing, test runner, results, type guides, couples, 404 and error pages
  api/              route handlers for results, couples and email verification
components/         UI components (landing sections, result card, transitions, Turnstile widget, ...)
lib/
  data/             question set, result copy and landing content
  hooks/            test session store (localStorage) and other client hooks
server/
  db/               Drizzle schema and client
  utils/            stores, email, abuse protection (plain functions + a thin Next.js adapter)
shared/             scoring and couples logic used by both client and server
drizzle/            SQL migrations
e2e/                Playwright tests
```

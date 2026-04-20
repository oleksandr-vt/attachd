# Personality Test App - Product Roadmap

## Overview

A web app for personality self-discovery, built around psychologically grounded tests with a viral sharing mechanic and a clear monetization funnel. The MVP focuses exclusively on the **Attachment Style test**.

## Test Selection Rationale

### Chosen for MVP: Attachment Style
- **4 result types:** Secure, Anxious, Avoidant, Fearful-Avoidant
- Each type comes with a clear description, strengths, challenges, and relationship advice
- Trending heavily in therapy and social content, where the result itself becomes an identity label
- Natural upsell path: partner compatibility reports
- Strong mix of shareability, relatability, and monetization potential

### Considered but deprioritized: Big Five (OCEAN)
- Scientifically validated but results feel more abstract
- Harder to share meaningfully
- Market is crowded

## MVP User Journey

```text
Ad / organic link
  -> Landing page
  -> Test (25 questions)
  -> Persisted result snapshot + share URL
  -> Email gate (required for full breakdown)
  -> Personalized result page (/r/:token)
  -> Upsell (deep report / partner test)
  -> Share
```

## Monetization Model

| Stream | Details |
|---|---|
| **Email gate** | Collect email before showing the fuller breakdown. |
| **Premium PDF report** | One-time purchase for a deeper analysis with triggers, patterns, and a growth plan. |
| **Couples / partner test** | Paid compatibility breakdown. |
| **Affiliate** | Wellness / therapy products fit naturally after the result flow. |
| **Ad revenue** | Later stage once traffic is high enough. |
| **Email drip** | Retakes, growth reminders, and report upsells. |
| **B2B / white-label** | Later licensing path for coaches and therapists. |
| **Test bundles** | Future bundle with additional tests. |

## Phased Roadmap

### Phase 1 - MVP (frontend + lightweight backend)
- Landing page with strong hook copy
- Attachment Style test (25 questions)
- Animated progress bar and question transitions
- Static type guide pages for secure / anxious / avoidant / fearful-avoidant
- Persisted result snapshots with generated share URLs
- Personalized result route separate from static guide routes
- Email gate before the full breakdown
- Shareable link and shareable result card
- Basic Stripe payment link for PDF report
- Shared scoring logic used by both client and server

### Phase 2 - Growth
- Drizzle + Postgres persistence for hosted durability
- User accounts and result history
- Partner / couples compatibility flow
- Second test: Love Language or Enneagram
- Server-side PDF report generation
- Email automation
- Affiliate link injection in results
- Admin dashboard
- A/B testing on results page copy

### Phase 3 - Scale
- Full test library
- Subscription "Full Profile" plan
- B2B white-label API
- Therapist / coach portal
- Retake tracking and growth insights
- Native app
- Community features
- Ad revenue integration

## Nuxt App Structure

```text
app/pages/
  index.vue                 - landing + hero
  test/[slug].vue          - test runner
  results/[type].vue       - static guide page per attachment type
  r/[token].vue            - personalized persisted result page

app/composables/
  useTest.ts               - test state and local progress
  useResults.ts            - client wrapper around shared scoring

app/data/tests/
  attachment.ts            - questions + scoring map
  results.ts               - type descriptions and copy

shared/attachment/
  scoring.ts               - shared scoring + result snapshot generation
  persistence.ts           - persisted result record types and versions

server/api/results/
  index.post.ts            - create persisted result snapshot
  [token].get.ts           - load a shareable result snapshot
  [token]/email.post.ts    - unlock the fuller result by email
```

## Viral Mechanics

- **Shareable result URLs** - Each completed test gets a persistent `/r/:token` link that opens on any device.
- **Shareable result card** - Pair the persisted result with a clean share card.
- **Direct ad links** - Ads point to `/test/attachment`, not the homepage.
- **Partner test CTA** - "Send to your partner" on the result page.
- **SEO content** - Static type guide pages double as long-form search pages.
- **Progress motivation** - Visible question count and progress bar.
- **Email retargeting** - Email unlock creates a follow-up channel for retakes and upsells.

## Tech Decisions

| Concern | Decision |
|---|---|
| **Framework** | Nuxt 4 |
| **Frontend routing** | Static SEO type pages + dynamic persisted result pages |
| **Backend** | Nitro server routes inside the same Nuxt repo |
| **CSS** | Tailwind v4 |
| **State** | Local state for in-progress answers; backend persistence for completed shareable results |
| **Persistence** | Start with app-owned persisted result snapshots; move to Drizzle + Postgres for hosted durability |
| **Email gate** | App backend unlocks fuller result access; third-party email sync can follow later |
| **Payments** | Stripe Payment Links |
| **Analytics** | Plausible or Umami |
| **Hosting** | Use durable server-side storage once share URLs matter; Postgres-backed hosting is the target path |
| **OG images** | Pre-generated static images for the 4 base types in MVP |

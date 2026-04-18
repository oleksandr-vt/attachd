# Personality Test App — Product Roadmap

## Overview

A web app for personality self-discovery, built around psychologically grounded tests with a viral sharing mechanic and a clear monetization funnel. The MVP focuses exclusively on the **Attachment Style test**.

---

## Test Selection Rationale

### ✅ Chosen for MVP: Attachment Style
- **4 result types:** Secure, Anxious, Avoidant, Fearful-Avoidant
- Each type comes with a clear description, strengths, challenges, and relationship advice
- Trending heavily in therapy and TikTok culture — the result *is* the identity ("I'm anxious attachment"), making it highly shareable
- Natural upsell path: partner compatibility reports
- Strengths: viral, relatable, monetizable

### ❌ Considered but deprioritized: Big Five (OCEAN)
- Scientifically validated but results feel abstract ("your Agreeableness is 72%")
- Hard to share meaningfully
- Market is saturated (16personalities dominates)

---

## MVP User Journey

```
Ad / organic link
  → Landing page (hook + start CTA)
  → Test (25 questions)
  → Email gate (required for full results)
  → Results page (type card + free summary)
  → Upsell (deep report / partner test)
  → Share (social card generator)
```

---

## Monetization Model

| Stream | Details |
|---|---|
| **Email gate** | Collect email before showing full results. Free, builds list for future campaigns. |
| **Premium PDF report** | $7–12 one-time. 15-page deep analysis: triggers, patterns, growth plan. |
| **Couples / partner test** | $14–18 for a compatibility breakdown. Strong referral driver. |
| **Affiliate** | BetterHelp, Calm, Headspace — natural fit for users in self-discovery mode. |
| **Ad revenue** | Phase 3+. Mental health/wellness CPMs are high (~$8–15). |
| **Email drip** | Post-test nurture sequence. "Have you grown? Retake after 3 months." |
| **B2B / white-label** | Phase 3. License tests to coaches, therapists, HR teams. |
| **Test bundles** | Phase 2. "Full Profile" — Attachment + Love Language + Enneagram at a discount. |

---

## Phased Roadmap

### Phase 1 — MVP (Weeks 1–4, frontend only)
- Landing page with viral hook copy
- Attachment Style test (25 questions)
- Animated progress bar and question transitions
- Results page: type card + summary
- Email gate modal before full results
- Shareable result image (OG card, one per type)
- Basic Stripe payment link for PDF report
- Test logic stored in static JSON (no backend required)

### Phase 2 — Growth (Weeks 5–10, add backend)
- User accounts and result history
- Partner / couples compatibility flow
- 2nd test: Love Language or Enneagram
- Server-side PDF report generation
- Email automation (drip sequences)
- Affiliate link injection in results
- Admin dashboard (conversions, funnel metrics)
- A/B testing on results page copy

### Phase 3 — Scale (Month 3+, monetize)
- Full test library (6–8 tests)
- Subscription "Full Profile" plan
- B2B white-label API
- Therapist / coach portal
- Retake tracking and growth insights
- Native app (Capacitor or native)
- Community features (type-based forums)
- Ad revenue integration

---

## Nuxt 4 App Structure (MVP)

```
pages/
  index.vue                 — landing + hero
  test/[slug].vue           — test runner (direct link target for ads)
  results/[type].vue        — result page per attachment type

composables/
  useTest.ts                — scoring logic and test state
  useResults.ts             — result type computation

data/tests/
  attachment.json           — questions + scoring map
  results.json              — type descriptions and copy

components/
  TestQuestion.vue          — animated question + answer input
  ProgressBar.vue
  ResultCard.vue            — shareable result card
  EmailGate.vue             — modal shown before full results
```

---

## Viral Mechanics (Build from Day 1)

- **Shareable result card** — Auto-generate a static OG image per type. "I got Anxious Attachment — what's yours?" links directly to the test.
- **Direct ad links** — Ads point to `/test/attachment`, not the homepage. Less friction → better conversion.
- **Partner test CTA** — "Send to your partner" button on the results page. Each share brings a new user who also converts.
- **SEO content** — Each result type page doubles as a long-form article ("What is anxious attachment?") to rank in search and funnel to the test.
- **Progress motivation** — Show "Question 12 of 25" with a visible progress bar. Keeps completion rates high.
- **Email retargeting** — The email gate gives you their address. "3 months later — have you grown? Retake free." Re-engagement with zero ad spend.

---

## Tech Decisions (MVP)

| Concern | Decision |
|---|---|
| **Framework** | Nuxt 4 — SSG for result pages (SEO) + SPA for test runner (no page reloads) |
| **CSS** | Tailwind v4 — utility classes, no component library needed for MVP |
| **State** | Pinia — stores test progress, answers, and computed result; survives navigation |
| **Email gate** | Mailchimp or Brevo API (free tier), called directly from frontend — no backend needed |
| **Payments** | Stripe Payment Links for PDF report — no backend, Stripe-hosted checkout page |
| **Analytics** | Plausible or Umami (privacy-first, no cookie banner) — funnel steps tracked as custom events |
| **Hosting** | Vercel or Netlify — free tier sufficient for MVP; edge functions available later if needed |
| **OG images** | 4 pre-generated static images (one per attachment type) — no dynamic generation for MVP |

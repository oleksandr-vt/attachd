import 'server-only'
import type { AttachmentPersistedResultRecord } from '@/shared/attachment/persistence'
import { consumeRateLimit } from '@/server/utils/rate-limit'

type ResendEmailPayload = {
  to: string[]
  subject: string
  html: string
  text: string
  reply_to?: string
}

type EmailButton = {
  href: string
  label: string
}

type EmailShellOptions = {
  preheader: string
  eyebrow: string
  title: string
  intro: string
  bodyHtml: string
  primaryButton: EmailButton
  secondaryButton?: EmailButton
  footerNote?: string
}

const brandName = 'Attachd'
const brandMark = 'Attachd.'
const RESEND_TIMEOUT_MS = 8000

const colors = {
  cream: '#fff7ef',
  surface: '#f5eee7',
  white: '#ffffff',
  dark: '#2f2926',
  body: '#625852',
  muted: '#7d716a',
  terra: '#9f4d31',
  terraSoft: '#f0d2c2',
  border: '#ded2c7',
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const getResendConfig = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()
  const replyTo = process.env.RESEND_REPLY_TO_EMAIL?.trim()

  if (!apiKey || !from) {
    return null
  }

  return {
    apiKey,
    from,
    replyTo,
  }
}

const formatFromAddress = (from: string) => {
  if (from.includes('<') && from.includes('>')) {
    return from
  }

  return `"${brandMark}" <${from}>`
}

const sendResendEmail = async (payload: ResendEmailPayload) => {
  const config = getResendConfig()

  if (!config) {
    return false
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      from: formatFromAddress(config.from),
      ...(config.replyTo ? { reply_to: config.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
  })

  if (!response.ok) {
    const responseText = await response.text()
    throw new Error(`Resend email failed with ${response.status}: ${responseText}`)
  }

  return true
}

const renderButton = (button: EmailButton, variant: 'primary' | 'secondary' = 'primary') => {
  const isPrimary = variant === 'primary'
  const escapedHref = escapeHtml(button.href)
  const escapedLabel = escapeHtml(button.label)

  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;">
      <tr>
        <td align="center" bgcolor="${isPrimary ? colors.dark : colors.white}" style="border: 1px solid ${isPrimary ? colors.dark : colors.border}; border-radius: 999px;">
          <a href="${escapedHref}" style="display: inline-block; padding: 12px 18px; font-family: Arial, sans-serif; font-size: 14px; line-height: 18px; font-weight: 700; color: ${isPrimary ? colors.cream : colors.dark}; text-decoration: none; border-radius: 999px;">
            ${escapedLabel}
          </a>
        </td>
      </tr>
    </table>
  `
}

const renderInfoRow = (label: string, copy: string) => `
  <tr>
    <td style="padding: 0 0 12px;">
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="${colors.surface}" style="border-collapse: collapse; background: ${colors.surface};">
        <tr>
          <td style="padding: 16px 18px;">
            <p style="margin: 0 0 5px; font-family: Arial, sans-serif; font-size: 11px; line-height: 15px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; color: ${colors.terra};">
              ${escapeHtml(label)}
            </p>
            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 22px; color: ${colors.body};">
              ${escapeHtml(copy)}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`

const renderEmailShell = ({
  preheader,
  eyebrow,
  title,
  intro,
  bodyHtml,
  primaryButton,
  secondaryButton,
  footerNote,
}: EmailShellOptions) => {
  const escapedPreheader = escapeHtml(preheader)

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin: 0; padding: 0; background: ${colors.cream};">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">
      ${escapedPreheader}
    </div>

    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background: ${colors.cream};">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 640px; border-collapse: collapse;">
            <tr>
              <td style="padding: 0 4px 14px;">
                <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; line-height: 34px; color: ${colors.dark};">
                  ${brandMark}
                </p>
              </td>
            </tr>

            <tr>
              <td bgcolor="${colors.white}" style="background: ${colors.white};">
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  <tr>
                    <td bgcolor="${colors.surface}" style="padding: 28px 28px 24px; background: ${colors.surface};">
                      <p style="margin: 0 0 12px; font-family: Arial, sans-serif; font-size: 11px; line-height: 15px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${colors.terra};">
                        ${escapeHtml(eyebrow)}
                      </p>
                      <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 34px; line-height: 38px; font-weight: 400; letter-spacing: 0; color: ${colors.dark};">
                        ${escapeHtml(title)}
                      </h1>
                      <p style="margin: 16px 0 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 26px; color: ${colors.body};">
                        ${escapeHtml(intro)}
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 26px 28px 28px;">
                      ${bodyHtml}

                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                        <tr>
                          <td style="padding: 8px 12px 0 0;">
                            ${renderButton(primaryButton)}
                          </td>
                          ${secondaryButton ? `
                            <td style="padding: 8px 0 0;">
                              ${renderButton(secondaryButton, 'secondary')}
                            </td>
                          ` : ''}
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 16px 4px 0;">
                <p style="margin: 0 0 6px; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; line-height: 24px; color: ${colors.dark};">
                  ${brandMark}
                </p>
                <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 20px; color: ${colors.muted};">
                  ${escapeHtml(footerNote ?? `${brandName} emails are educational and are not diagnosis, therapy, medical care, or professional mental health advice.`)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

const sendAttachmentEmail = async (payload: ResendEmailPayload) => {
  if (!getResendConfig()) {
    return false
  }

  try {
    const budget = await consumeRateLimit('emailsGlobal')

    if (!budget.allowed) {
      console.warn('Daily email budget reached; skipping email.')
      return false
    }

    return await sendResendEmail(payload)
  } catch (error) {
    console.warn(error)
    return false
  }
}

export const sendAttachmentResultVerificationEmail = async (
  record: AttachmentPersistedResultRecord,
  verificationUrl: string,
  shareUrl: string,
) => {
  const resultLabel = record.result.content.label
  const escapedVerificationUrl = escapeHtml(verificationUrl)
  const html = renderEmailShell({
    preheader: `Confirm your email to get a copy of your ${resultLabel} attachment result.`,
    eyebrow: 'Email confirmation',
    title: `Your ${resultLabel} result is ready.`,
    intro: 'Confirm this address and we will email you a copy of your saved result link, so it is easy to find later.',
    bodyHtml: `
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        ${renderInfoRow('Why confirm?', 'It makes sure the copy of your result goes to the right inbox. We only email you about this result.')}
        ${renderInfoRow('Your saved result', shareUrl)}
      </table>
      <p style="margin: 8px 0 0; font-family: Arial, sans-serif; font-size: 13px; line-height: 21px; color: ${colors.muted};">
        If the button does not work, open this link: <a href="${escapedVerificationUrl}" style="color: ${colors.terra}; text-decoration: underline;">${escapedVerificationUrl}</a>
      </p>
    `,
    primaryButton: {
      href: verificationUrl,
      label: 'Confirm my email',
    },
    secondaryButton: {
      href: shareUrl,
      label: 'Open result',
    },
    footerNote: `Did not take the ${brandName} test? Ignore this email and nothing else will be sent. The result itself is educational and not a diagnosis.`,
  })

  return sendAttachmentEmail({
    to: [record.email],
    subject: `Confirm your ${brandName} email`,
    html,
    text: [
      `Your ${resultLabel} attachment result is ready.`,
      '',
      'Confirm this address and we will email you a copy of your saved result link:',
      verificationUrl,
      '',
      `Open your result: ${shareUrl}`,
      '',
      brandMark,
      `Did not take the ${brandName} test? Ignore this email and nothing else will be sent. The result itself is educational and not a diagnosis.`,
    ].join('\n'),
  })
}

export const sendAttachmentWelcomeEmail = async (
  record: AttachmentPersistedResultRecord,
  resultUrl: string,
  couplesUrl: string,
) => {
  const resultLabel = record.result.content.label
  const html = renderEmailShell({
    preheader: `Your ${resultLabel} result is confirmed and saved.`,
    eyebrow: `Welcome to ${brandName}`,
    title: 'Your result is saved.',
    intro: `Thanks for confirming your email. Your ${resultLabel} attachment result is now saved and ready whenever you want to return to it.`,
    bodyHtml: `
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        ${renderInfoRow('What your result gives you', 'A clear read on your strongest attachment pattern, trigger clusters, relationship needs, and next steps.')}
        ${renderInfoRow('Compare with a partner', 'Send the test to your partner, then paste both result links into the couples report to see how your two patterns interact.')}
        ${renderInfoRow('A useful next move', 'Open your result, pick one trigger that feels familiar, and notice where it shows up before you try to fix everything at once.')}
      </table>
    `,
    primaryButton: {
      href: resultUrl,
      label: 'Open my result',
    },
    secondaryButton: {
      href: couplesUrl,
      label: 'Compare with a partner',
    },
    footerNote: `${brandName} is educational and does not replace therapy, medical care, or professional mental health support.`,
  })

  return sendAttachmentEmail({
    to: [record.email],
    subject: `Welcome to ${brandName}`,
    html,
    text: [
      `Thanks for confirming your email. Your ${resultLabel} attachment result is saved.`,
      '',
      'Your result gives you a clear read on your strongest attachment pattern, trigger clusters, relationship needs, and next steps.',
      '',
      `Open your result: ${resultUrl}`,
      `Compare with a partner: ${couplesUrl}`,
      '',
      brandMark,
      `${brandName} is educational and does not replace therapy, medical care, or professional mental health support.`,
    ].join('\n'),
  })
}

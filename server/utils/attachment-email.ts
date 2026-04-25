import type { AttachmentPersistedResultRecord } from '~~/shared/attachment/persistence'

type ResendEmailPayload = {
  to: string[]
  subject: string
  html: string
  text: string
  reply_to?: string
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
      from: config.from,
      ...(config.replyTo ? { reply_to: config.replyTo } : {}),
    }),
  })

  if (!response.ok) {
    const responseText = await response.text()
    throw new Error(`Resend email failed with ${response.status}: ${responseText}`)
  }

  return true
}

export const sendAttachmentResultVerificationEmail = async (
  record: AttachmentPersistedResultRecord,
  verificationUrl: string,
  shareUrl: string,
) => {
  const escapedVerificationUrl = escapeHtml(verificationUrl)
  const escapedShareUrl = escapeHtml(shareUrl)
  const resultLabel = escapeHtml(record.result.content.label)

  try {
    return await sendResendEmail({
      to: [record.email],
      subject: 'Confirm your Attachd email',
      html: `
        <div style="font-family: Inter, Arial, sans-serif; color: #2f2926; line-height: 1.6; max-width: 560px;">
          <p style="margin: 0 0 16px;">Your ${resultLabel} attachment result is ready.</p>
          <p style="margin: 0 0 20px;">Confirm this email address so we know where to send your saved result, attachment follow-ups, and Attachd updates. You can unsubscribe from future updates anytime.</p>
          <p style="margin: 0 0 24px;">
            <a href="${escapedVerificationUrl}" style="display: inline-block; background: #2f2926; color: #fff7ef; text-decoration: none; border-radius: 999px; padding: 12px 18px;">Confirm my email</a>
          </p>
          <p style="margin: 0 0 12px; font-size: 14px; color: #6d625c;">You can also open your result here:</p>
          <p style="margin: 0; font-size: 14px;"><a href="${escapedShareUrl}" style="color: #9f4d31;">${escapedShareUrl}</a></p>
        </div>
      `,
      text: [
        `Your ${record.result.content.label} attachment result is ready.`,
        '',
        'Confirm this email address so we know where to send your saved result, attachment follow-ups, and Attachd updates. You can unsubscribe from future updates anytime.',
        verificationUrl,
        '',
        `Open your result: ${shareUrl}`,
      ].join('\n'),
    })
  } catch (error) {
    console.warn(error)
    return false
  }
}

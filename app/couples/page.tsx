import type { Metadata } from 'next'
import CouplesBuilder, { type CouplesResultSource } from '@/components/CouplesBuilder'
import { getAttachmentResultRecord } from '@/server/utils/attachment-result-store'

const tokenPattern = /^[a-f0-9]{16}$/i

export const metadata: Metadata = {
  title: 'Couples Attachment Report',
  description:
    'Compare two completed attachment style results side by side to see likely conflict loops, stabilizers, and repair moves.',
  alternates: { canonical: '/couples' },
  openGraph: {
    title: 'Couples Attachment Report | Attachd.',
    description: 'Paste two attachment result links and generate a practical couples comparison.',
  },
  twitter: { card: 'summary' },
}

const getQueryValue = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? ''

const loadSource = async (rawQuery: string, contextLabel: string) => {
  if (!tokenPattern.test(rawQuery)) {
    return { source: null, error: '' }
  }

  const error = `We could not load the ${contextLabel} result link. Paste a valid shared result URL or token.`

  try {
    const record = await getAttachmentResultRecord(rawQuery.toLowerCase())
    const source: CouplesResultSource | null = record ? { token: record.token, result: record.result } : null
    return { source, error: source ? '' : error }
  } catch (loadError) {
    console.error(loadError)
    return { source: null, error }
  }
}

export default async function CouplesPage({ searchParams }: PageProps<'/couples'>) {
  const query = await searchParams
  const rawSelfQuery = getQueryValue(query.self)
  const rawPartnerQuery = getQueryValue(query.partner)
  const [self, partner] = await Promise.all([
    loadSource(rawSelfQuery, 'first'),
    loadSource(rawPartnerQuery, 'partner'),
  ])

  return (
    <CouplesBuilder
      rawSelfQuery={rawSelfQuery}
      rawPartnerQuery={rawPartnerQuery}
      selfSource={self.source}
      partnerSource={partner.source}
      selfFetchError={self.error}
      partnerFetchError={partner.error}
    />
  )
}

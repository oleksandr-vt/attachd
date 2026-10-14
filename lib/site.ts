import { resolveSiteOrigin } from '@/shared/site-url'

export const getMetadataBase = () => {
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const origin = resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL, vercelUrl ? `https://${vercelUrl}` : '')
  return origin ? new URL(origin) : undefined
}

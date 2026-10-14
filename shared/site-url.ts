export const resolveSiteOrigin = (configuredSiteUrl: string | null | undefined, fallbackOrigin: string) => {
  const siteUrl = configuredSiteUrl?.trim()

  if (siteUrl) {
    try {
      return new URL(siteUrl).origin
    } catch {
      return fallbackOrigin
    }
  }

  return fallbackOrigin
}

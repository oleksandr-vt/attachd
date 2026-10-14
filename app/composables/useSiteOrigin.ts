import { resolveSiteOrigin } from '~~/shared/site-url'

export const useSiteOrigin = () =>
  resolveSiteOrigin(useRuntimeConfig().public.siteUrl, useRequestURL().origin)

export const useCanonicalUrl = () =>
  `${useSiteOrigin()}${useRequestURL().pathname}`

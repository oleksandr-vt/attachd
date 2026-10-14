import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (onChange: () => void) => {
  const motionQuery = window.matchMedia(QUERY)
  motionQuery.addEventListener('change', onChange)
  return () => motionQuery.removeEventListener('change', onChange)
}

export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)

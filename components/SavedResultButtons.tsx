'use client'

import AppButton from '@/components/AppButton'
import { useTest } from '@/lib/hooks/useTest'

export function SavedResultButton() {
  const { session } = useTest()

  if (!session.lastSharedResultToken) {
    return null
  }

  return (
    <AppButton
      href={`/r/${session.lastSharedResultToken}`}
      label="Open my saved result"
      variant="secondary"
      size="sm"
      showArrow
    />
  )
}

export function CouplesReportButton() {
  const { session } = useTest()
  const href = session.lastSharedResultToken ? `/couples?self=${session.lastSharedResultToken}` : '/couples'

  return <AppButton href={href} label="Open couples report" size="sm" showArrow />
}

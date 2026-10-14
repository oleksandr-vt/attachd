'use client'

import { useEffect } from 'react'
import AppButton from '@/components/AppButton'
import StatusPanel from '@/components/StatusPanel'

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }, retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <StatusPanel
      kicker="Something went wrong"
      title="We could not load this page."
      description="This is usually temporary. Try again in a moment, or head back to the start."
    >
      <AppButton size="sm" onClick={() => retry()}>
        Try again
      </AppButton>
      <AppButton href="/" label="Go back home" variant="outline" size="sm" />
    </StatusPanel>
  )
}

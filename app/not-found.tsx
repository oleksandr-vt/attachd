import type { Metadata } from 'next'
import AppButton from '@/components/AppButton'
import StatusPanel from '@/components/StatusPanel'

export const metadata: Metadata = {
  title: 'Page not found',
}

export default function NotFound() {
  return (
    <StatusPanel
      kicker="404"
      title="Page not found."
      description="This page does not exist or the link was mistyped."
    >
      <AppButton href="/" label="Go back home" size="sm" showArrow />
      <AppButton href="/test/attachment" label="Take the test" variant="outline" size="sm" />
    </StatusPanel>
  )
}

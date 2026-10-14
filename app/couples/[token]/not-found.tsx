import AppButton from '@/components/AppButton'
import StatusPanel from '@/components/StatusPanel'

export default function CouplesReportNotFound() {
  return (
    <StatusPanel
      kicker="404"
      title="Couples report not found."
      description="This couples report link does not exist or was copied incompletely. You can build a new comparison from two result links."
    >
      <AppButton href="/couples" label="Open couples report" size="sm" showArrow />
      <AppButton href="/" label="Go back home" variant="outline" size="sm" />
    </StatusPanel>
  )
}

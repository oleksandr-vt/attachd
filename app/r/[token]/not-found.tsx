import AppButton from '@/components/AppButton'
import StatusPanel from '@/components/StatusPanel'

export default function ResultNotFound() {
  return (
    <StatusPanel
      kicker="404"
      title="Result not found."
      description="This result link does not exist or was copied incompletely. Check the link, or take the test to get a new result."
    >
      <AppButton href="/test/attachment" label="Take the test" size="sm" showArrow />
      <AppButton href="/" label="Go back home" variant="outline" size="sm" />
    </StatusPanel>
  )
}

'use client'

import AppButton from '@/components/AppButton'
import { useCopyState } from '@/lib/hooks/useCopyState'

type ShareActionsProps = {
  path: string
  linkHref: string
  linkLabel: string
}

export default function ShareActions({ path, linkHref, linkLabel }: ShareActionsProps) {
  const { copyState, copy } = useCopyState()

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <AppButton size="sm" onClick={() => copy(`${window.location.origin}${path}`)}>
          {copyState === 'copied' ? 'Link copied' : 'Copy share link'}
        </AppButton>
        <AppButton href={linkHref} label={linkLabel} size="sm" showArrow />
      </div>

      {copyState === 'failed' && (
        <p className="mt-3 text-sm text-muted">
          Copy failed. You can still share the current page URL.
        </p>
      )}
    </>
  )
}

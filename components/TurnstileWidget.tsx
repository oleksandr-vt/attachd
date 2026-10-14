'use client'

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import { loadTurnstile, type TurnstileApi } from '@/lib/turnstile'

export type TurnstileWidgetHandle = {
  getToken: () => Promise<string>
  reset: () => void
}

type WidgetState = {
  api: TurnstileApi | null
  widgetId: string | null
  token: string
  pendingResolvers: Array<(token: string) => void>
}

const TOKEN_TIMEOUT_MS = 15000
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

const resolvePending = (widget: WidgetState, token: string) => {
  const resolvers = widget.pendingResolvers
  widget.pendingResolvers = []
  resolvers.forEach((resolve) => resolve(token))
}

export default function TurnstileWidget({ action, ref }: { action: string, ref?: Ref<TurnstileWidgetHandle> }) {
  const container = useRef<HTMLDivElement | null>(null)
  const widgetRef = useRef<WidgetState>({ api: null, widgetId: null, token: '', pendingResolvers: [] })
  const [interactive, setInteractive] = useState(false)

  useEffect(() => {
    const widget = widgetRef.current
    let disposed = false

    if (!turnstileSiteKey) {
      return
    }

    loadTurnstile().then((api) => {
      if (disposed || !container.current) {
        return
      }

      widget.api = api
      widget.widgetId = api.render(container.current, {
        'sitekey': turnstileSiteKey,
        'action': action,
        'appearance': 'interaction-only',
        'callback': (token) => {
          widget.token = token
          resolvePending(widget, token)
        },
        'expired-callback': () => {
          widget.token = ''
        },
        'error-callback': () => {
          widget.token = ''
        },
        'before-interactive-callback': () => {
          setInteractive(true)
        },
        'after-interactive-callback': () => {
          setInteractive(false)
        },
      }) ?? null
    }).catch((error: unknown) => {
      console.warn(error)
    })

    return () => {
      disposed = true

      if (widget.widgetId && widget.api) {
        widget.api.remove(widget.widgetId)
      }

      widget.widgetId = null
      resolvePending(widget, '')
    }
  }, [action])

  useImperativeHandle(ref, () => ({
    getToken: () => {
      const widget = widgetRef.current

      if (!turnstileSiteKey || widget.token) {
        return Promise.resolve(widget.token)
      }

      return new Promise<string>((resolve) => {
        widget.pendingResolvers.push(resolve)
        window.setTimeout(() => {
          widget.pendingResolvers = widget.pendingResolvers.filter((pending) => pending !== resolve)
          resolve(widget.token)
        }, TOKEN_TIMEOUT_MS)
      })
    },
    reset: () => {
      const widget = widgetRef.current
      widget.token = ''

      if (widget.widgetId && widget.api) {
        widget.api.reset(widget.widgetId)
      }
    },
  }), [])

  return <div ref={container} className={interactive ? 'mt-4' : 'h-0 overflow-hidden'} />
}

export type TurnstileRenderOptions = {
  'sitekey': string
  'action': string
  'appearance': 'always' | 'execute' | 'interaction-only'
  'callback': (token: string) => void
  'expired-callback': () => void
  'error-callback': () => void
  'before-interactive-callback': () => void
  'after-interactive-callback': () => void
}

export type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string | undefined
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

type TurnstileWindow = Window & {
  turnstile?: TurnstileApi
}

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let turnstileLoadPromise: Promise<TurnstileApi> | null = null

export const loadTurnstile = () => {
  const loadedApi = (window as TurnstileWindow).turnstile

  if (loadedApi) {
    return Promise.resolve(loadedApi)
  }

  turnstileLoadPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = TURNSTILE_SCRIPT_SRC
    script.async = true
    script.addEventListener('load', () => {
      const api = (window as TurnstileWindow).turnstile

      if (api) {
        resolve(api)
      } else {
        reject(new Error('Turnstile did not initialize.'))
      }
    }, { once: true })
    script.addEventListener('error', () => {
      turnstileLoadPromise = null
      script.remove()
      reject(new Error('Turnstile script failed to load.'))
    }, { once: true })
    document.head.appendChild(script)
  })

  return turnstileLoadPromise
}

<script setup lang="ts">
import { loadTurnstile, type TurnstileApi } from '~/utils/turnstile'

const props = defineProps<{
  action: string
}>()

const TOKEN_TIMEOUT_MS = 15000

const { public: { turnstileSiteKey } } = useRuntimeConfig()
const container = ref<HTMLElement | null>(null)
const interactive = ref(false)
let turnstileApi: TurnstileApi | null = null
let widgetId: string | null = null
let currentToken = ''
let pendingResolvers: Array<(token: string) => void> = []

const resolvePending = (token: string) => {
  const resolvers = pendingResolvers
  pendingResolvers = []
  resolvers.forEach((resolve) => resolve(token))
}

onMounted(async () => {
  if (!turnstileSiteKey) {
    return
  }

  try {
    turnstileApi = await loadTurnstile()
  } catch (error) {
    console.warn(error)
    return
  }

  if (!container.value) {
    return
  }

  widgetId = turnstileApi.render(container.value, {
    'sitekey': turnstileSiteKey,
    'action': props.action,
    'appearance': 'interaction-only',
    'callback': (token) => {
      currentToken = token
      resolvePending(token)
    },
    'expired-callback': () => {
      currentToken = ''
    },
    'error-callback': () => {
      currentToken = ''
    },
    'before-interactive-callback': () => {
      interactive.value = true
    },
    'after-interactive-callback': () => {
      interactive.value = false
    },
  }) ?? null
})

onBeforeUnmount(() => {
  if (widgetId && turnstileApi) {
    turnstileApi.remove(widgetId)
  }

  widgetId = null
  resolvePending('')
})

const getToken = () => {
  if (!turnstileSiteKey || currentToken) {
    return Promise.resolve(currentToken)
  }

  return new Promise<string>((resolve) => {
    pendingResolvers.push(resolve)
    window.setTimeout(() => {
      pendingResolvers = pendingResolvers.filter((pending) => pending !== resolve)
      resolve(currentToken)
    }, TOKEN_TIMEOUT_MS)
  })
}

const reset = () => {
  currentToken = ''

  if (widgetId && turnstileApi) {
    turnstileApi.reset(widgetId)
  }
}

defineExpose({ getToken, reset })
</script>

<template>
  <div
    ref="container"
    :class="interactive ? 'mt-4' : 'h-0 overflow-hidden'"
  />
</template>

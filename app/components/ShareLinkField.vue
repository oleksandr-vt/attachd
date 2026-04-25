<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: string
  label?: string
}>(), {
  label: 'Share link',
})

const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
let resetCopyStateTimeout: number | null = null

const buttonLabel = computed(() => {
  if (copyState.value === 'copied') {
    return 'Link copied'
  }

  if (copyState.value === 'failed') {
    return 'Copy failed'
  }

  return 'Copy link'
})

const copyLink = async () => {
  if (!import.meta.client) {
    return
  }

  try {
    await navigator.clipboard.writeText(props.value)
    copyState.value = 'copied'

    if (resetCopyStateTimeout) {
      window.clearTimeout(resetCopyStateTimeout)
    }

    resetCopyStateTimeout = window.setTimeout(() => {
      copyState.value = 'idle'
      resetCopyStateTimeout = null
    }, 1600)
  } catch {
    copyState.value = 'failed'
  }
}

onBeforeUnmount(() => {
  if (resetCopyStateTimeout) {
    window.clearTimeout(resetCopyStateTimeout)
  }
})
</script>

<template>
  <div class="grid gap-2">
    <p class="mb-0.5 text-xs font-medium uppercase tracking-widest text-terra">
      {{ label }}
    </p>

    <div class="flex items-center gap-2 rounded-2xl border border-border bg-white px-3.5 py-2">
      <p class="min-w-0 flex-1 text-sm leading-6 break-all text-body">
        {{ value }}
      </p>

      <button
        type="button"
        class="flex size-6 shrink-0 items-center justify-center text-dark outline-none cursor-pointer transition-all duration-200 hover:text-terra"
        :aria-label="buttonLabel"
        :title="buttonLabel"
        @click="copyLink"
      >
        <svg
          v-if="copyState === 'copied'"
          class="block size-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m16 5-7.5 7.5L4 8" />
        </svg>

        <svg
          v-else
          class="block size-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M15 7.667C15 6.95967 14.719 6.28131 14.2189 5.78115C13.7187 5.28099 13.0403 5 12.333 5H3.667C3.31676 5 2.96996 5.06898 2.64638 5.20301C2.32281 5.33704 2.0288 5.53349 1.78115 5.78115C1.53349 6.0288 1.33704 6.32281 1.20301 6.64638C1.06898 6.96996 1 7.31676 1 7.667V16.333C1 16.6832 1.06898 17.03 1.20301 17.3536C1.33704 17.6772 1.53349 17.9712 1.78115 18.2189C2.0288 18.4665 2.32281 18.663 2.64638 18.797C2.96996 18.931 3.31676 19 3.667 19H12.333C12.6832 19 13.03 18.931 13.3536 18.797C13.6772 18.663 13.9712 18.4665 14.2189 18.2189C14.4665 17.9712 14.663 17.6772 14.797 17.3536C14.931 17.03 15 16.6832 15 16.333V7.667Z" />
          <path d="M17.988 14.737C18.295 14.5626 18.5504 14.31 18.7281 14.0049C18.9058 13.6998 18.9997 13.3531 19 13V3C19 1.9 18.1 1 17 1H7C6.25 1 5.842 1.385 5.5 2" />
        </svg>
      </button>
    </div>

    <p
      v-if="copyState === 'failed'"
      class="text-sm leading-6 text-muted"
      aria-live="polite"
    >
      Copy failed. You can still select the link manually.
    </p>
    <p
      v-else-if="copyState === 'copied'"
      class="text-sm leading-6 text-terra"
      aria-live="polite"
    >
      Link copied.
    </p>
  </div>
</template>

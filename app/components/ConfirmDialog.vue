<script setup lang="ts">
import AppButton from '~/components/AppButton.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    kicker?: string
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
  }>(),
  {
    kicker: 'Confirm action',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
)

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const handleKeydown = (event: KeyboardEvent) => {
  if (props.open && event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-100 flex items-center justify-center bg-dark/55 p-5"
        @click.self="$emit('close')"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-3 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-3 opacity-0"
        >
          <div
            v-if="open"
            class="relative w-full max-w-lg rounded-3xl border border-border bg-cream p-7 shadow-floating-card sm:p-8"
          >
            <button
              type="button"
              class="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/80 text-xl text-dark transition-colors duration-200 hover:bg-white"
              aria-label="Close confirmation dialog"
              @click="$emit('close')"
            >
              &times;
            </button>

            <p class="mb-3 text-xs font-medium uppercase tracking-widest text-terra">
              {{ kicker }}
            </p>
            <h2 class="font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-[2.5rem]">
              {{ title }}
            </h2>
            <p class="mt-4 max-w-120 text-[15px] leading-7 text-body">
              {{ description }}
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <AppButton size="sm" @click="$emit('confirm')">
                {{ confirmLabel }}
              </AppButton>
              <AppButton variant="outline" size="sm" @click="$emit('close')">
                {{ cancelLabel }}
              </AppButton>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

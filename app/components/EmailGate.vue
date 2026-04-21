<script setup lang="ts">
import AppButton from '~/components/AppButton.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    initialEmail?: string
    title?: string
    description?: string
  }>(),
  {
    initialEmail: '',
    title: 'Unlock your fuller breakdown',
    description:
      'Enter your email to continue to your expanded interpretation, relationship patterns, and growth directions.',
  },
)

const emit = defineEmits<{
  close: []
  submit: [email: string]
}>()

const email = ref(props.initialEmail)
const errorMessage = ref('')

const validateEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

const syncFromProps = () => {
  email.value = props.initialEmail
  errorMessage.value = ''
}

const handleSubmit = () => {
  if (!validateEmail(email.value)) {
    errorMessage.value = 'Enter a valid email address to continue.'
    return
  }

  errorMessage.value = ''
  emit('submit', email.value.trim())
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.open && event.key === 'Escape') {
    emit('close')
  }
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    syncFromProps()
  }
})

watch(() => props.initialEmail, syncFromProps)

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
        <div class="relative w-full max-w-lg rounded-3xl border border-border bg-cream p-7 shadow-floating-card sm:p-8">
          <button
            type="button"
            class="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/80 text-xl text-dark transition-colors duration-200 hover:bg-white"
            aria-label="Close email gate"
            @click="$emit('close')"
          >
            &times;
          </button>

          <p class="mb-3 text-xs font-medium uppercase tracking-widest text-terra">Email gate</p>
          <h2 class="font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-[2.5rem]">
            {{ title }}
          </h2>
          <p class="mt-4 max-w-md text-[15px] leading-7 text-body">{{ description }}</p>

          <form class="mt-6 grid gap-3" @submit.prevent="handleSubmit">
            <label class="grid gap-2">
              <span class="text-sm font-medium text-dark">Email address</span>
              <input
                v-model="email"
                type="email"
                autocomplete="email"
                class="rounded-[18px] border border-border bg-white px-4 py-4 text-dark outline-none transition-all duration-200 focus:border-[#c9b8a9] focus:shadow-[0_0_0_3px_rgba(184,92,56,0.12)]"
                placeholder="you@example.com"
              >
            </label>

            <p v-if="errorMessage" class="text-sm text-terra-dk">{{ errorMessage }}</p>

            <AppButton type="submit" size="sm">
              Continue to full results
            </AppButton>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

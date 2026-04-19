<script setup lang="ts">
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
      'Enter your email to continue to the expanded interpretation, relationship patterns, and growth directions. For now this stays frontend-only and is ready for API wiring next.',
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
    <Transition name="email-gate">
      <div v-if="open" class="email-gate-overlay" @click.self="$emit('close')">
        <div class="email-gate-panel border border-border bg-cream shadow-floating-card">
          <button
            type="button"
            class="email-gate-close"
            aria-label="Close email gate"
            @click="$emit('close')"
          >
            &times;
          </button>

          <p class="email-gate-kicker">Email gate</p>
          <h2 class="email-gate-title">{{ title }}</h2>
          <p class="email-gate-copy">{{ description }}</p>

          <form class="mt-6 grid gap-3" @submit.prevent="handleSubmit">
            <label class="grid gap-2">
              <span class="email-gate-label">Email address</span>
              <input
                v-model="email"
                type="email"
                autocomplete="email"
                class="email-gate-input"
                placeholder="you@example.com"
              >
            </label>

            <p v-if="errorMessage" class="email-gate-error">{{ errorMessage }}</p>

            <button type="submit" class="email-gate-submit">
              Continue to full breakdown
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.email-gate-overlay {
  align-items: center;
  background-color: rgb(28 23 18 / 52%);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1.25rem;
  position: fixed;
  z-index: 120;
}

.email-gate-panel {
  border-radius: 24px;
  max-width: 32rem;
  padding: 1.75rem;
  position: relative;
  width: 100%;
}

.email-gate-close {
  align-items: center;
  background-color: rgb(255 255 255 / 72%);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-dark);
  cursor: pointer;
  display: inline-flex;
  font-size: 1.25rem;
  height: 2.25rem;
  justify-content: center;
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 2.25rem;
}

.email-gate-kicker {
  color: var(--color-terra);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.email-gate-title {
  color: var(--color-dark);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.08;
  margin-bottom: 0.75rem;
}

.email-gate-copy {
  color: var(--color-body);
  font-size: 15px;
  line-height: 1.75;
  max-width: 28rem;
}

.email-gate-label {
  color: var(--color-dark);
  font-size: 13px;
  font-weight: 500;
}

.email-gate-input {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  color: var(--color-dark);
  outline: none;
  padding: 0.95rem 1rem;
}

.email-gate-input:focus {
  border-color: #c9b8a9;
  box-shadow: 0 0 0 3px rgba(184, 92, 56, 0.12);
}

.email-gate-error {
  color: var(--color-terra-dk);
  font-size: 13px;
}

.email-gate-submit {
  background-color: var(--color-terra);
  border-radius: 999px;
  color: var(--color-cream);
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  padding: 0.95rem 1.25rem;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.email-gate-submit:hover {
  background-color: var(--color-terra-dk);
  transform: translateY(-1px);
}

.email-gate-enter-active,
.email-gate-leave-active {
  transition: opacity 0.2s ease;
}

.email-gate-enter-active .email-gate-panel,
.email-gate-leave-active .email-gate-panel {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.email-gate-enter-from,
.email-gate-leave-to {
  opacity: 0;
}

.email-gate-enter-from .email-gate-panel,
.email-gate-leave-to .email-gate-panel {
  opacity: 0;
  transform: translateY(12px);
}

@media (min-width: 40rem) {
  .email-gate-panel {
    padding: 2rem;
  }
}
</style>

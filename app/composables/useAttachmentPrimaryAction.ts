import { useTest } from '~/composables/useTest'

export const useAttachmentPrimaryAction = () => {
  const {
    computedResult,
    hasStarted,
    hasSubmittedResults,
    session,
    storageHydrated,
  } = useTest('attachment')

  const storageReady = computed(() =>
    import.meta.client ? storageHydrated.value : true,
  )

  const label = computed(() => {
    if (!storageReady.value) {
      return 'Start free test'
    }

    if (hasSubmittedResults.value) {
      return 'See results'
    }

    if (hasStarted.value) {
      return 'Continue test'
    }

    return 'Start free test'
  })

  const href = computed(() => {
    if (!storageReady.value) {
      return '/test/attachment'
    }

    if (hasSubmittedResults.value) {
      if (session.value.lastSharedResultToken) {
        return `/r/${session.value.lastSharedResultToken}`
      }

      const resultType = session.value.lastResultType ?? computedResult.value?.type

      if (resultType) {
        return `/results/${resultType}`
      }
    }

    return '/test/attachment'
  })

  return {
    href,
    label,
    storageReady,
  }
}

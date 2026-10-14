import { useTest } from '@/lib/hooks/useTest'

export const usePrimaryAction = () => {
  const { hasStarted, hasSubmittedResults, session, storageHydrated } = useTest()

  if (!storageHydrated) {
    return { href: '/test/attachment', label: 'Start free test' }
  }

  return {
    href: hasSubmittedResults && session.lastSharedResultToken ? `/r/${session.lastSharedResultToken}` : '/test/attachment',
    label: hasSubmittedResults ? 'See results' : hasStarted ? 'Continue test' : 'Start free test',
  }
}

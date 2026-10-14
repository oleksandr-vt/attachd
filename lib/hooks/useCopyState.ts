import { useEffect, useRef, useState } from 'react'

export const useCopyState = () => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const resetTimeout = useRef<number | null>(null)

  useEffect(() => () => {
    if (resetTimeout.current) {
      window.clearTimeout(resetTimeout.current)
    }
  }, [])

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')

      if (resetTimeout.current) {
        window.clearTimeout(resetTimeout.current)
      }

      resetTimeout.current = window.setTimeout(() => {
        setCopyState('idle')
        resetTimeout.current = null
      }, 1600)
    } catch {
      setCopyState('failed')
    }
  }

  return { copyState, copy }
}

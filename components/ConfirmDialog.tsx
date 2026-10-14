'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import AppButton from '@/components/AppButton'
import Transition from '@/components/Transition'
import { useIsClient } from '@/lib/hooks/useIsClient'

let portalRoot: HTMLElement | null = null

// Prepended like the original Vue teleport, so the fixed navbar keeps painting above the backdrop
const getPortalRoot = () => {
  if (!portalRoot) {
    portalRoot = document.createElement('div')
    document.body.prepend(portalRoot)
  }

  return portalRoot
}

type ConfirmDialogProps = {
  open: boolean
  kicker?: string
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({
  open,
  kicker = 'Confirm action',
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const isClient = useIsClient()

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (open && event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [open, onClose])

  if (!isClient) {
    return null
  }

  return createPortal(
    <Transition
      enterActiveClass="transition duration-200 ease-out"
      enterFromClass="opacity-0"
      enterToClass="opacity-100"
      leaveActiveClass="transition duration-150 ease-in"
      leaveFromClass="opacity-100"
      leaveToClass="opacity-0"
    >
      {open && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-dark/55 p-5"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onClose()
            }
          }}
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-cream p-7 shadow-floating-card sm:p-8">
            <button
              type="button"
              className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/80 text-xl text-dark transition-colors duration-200 hover:bg-white"
              aria-label="Close confirmation dialog"
              onClick={onClose}
            >
              &times;
            </button>

            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-terra">
              {kicker}
            </p>
            <h2 className="font-display text-4xl leading-tight font-medium tracking-tight text-dark sm:text-[2.5rem]">
              {title}
            </h2>
            <p className="mt-4 max-w-120 text-[15px] leading-7 text-body">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AppButton size="sm" onClick={onConfirm}>
                {confirmLabel}
              </AppButton>
              <AppButton variant="outline" size="sm" onClick={onClose}>
                {cancelLabel}
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </Transition>,
    getPortalRoot(),
  )
}

'use client'

import Link from 'next/link'
import { usePrimaryAction } from '@/lib/hooks/usePrimaryAction'

export default function PrimaryActionLink({ className }: { className: string }) {
  const { href, label } = usePrimaryAction()

  return (
    <Link href={href} className={className}>
      {`${label} →`}
    </Link>
  )
}

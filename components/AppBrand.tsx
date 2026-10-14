import Link from 'next/link'
import { landingBrandName } from '@/lib/data/landing'

export default function AppBrand() {
  return (
    <Link href="/" aria-label={landingBrandName} className="shrink-0 select-none font-display text-2xl font-normal italic text-dark">
      <span className="pointer-events-none block">{landingBrandName}</span>
    </Link>
  )
}

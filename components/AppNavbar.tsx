import Link from 'next/link'
import AppBrand from '@/components/AppBrand'
import PrimaryActionLink from '@/components/PrimaryActionLink'
import { landingNavLinks } from '@/lib/data/landing'

export default function AppNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-100 border-b border-border bg-cream/95 backdrop-blur-sm transition-all duration-300">
      <div className="landing-container flex h-17 items-center gap-4 sm:gap-6">
        <AppBrand />

        <nav className="hidden items-center gap-8 lg:ml-auto lg:flex">
          {landingNavLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm text-muted transition-colors duration-200 hover:text-dark">
              {link.label}
            </Link>
          ))}
        </nav>

        <PrimaryActionLink className="ml-auto shrink-0 whitespace-nowrap rounded-full bg-dark px-4 py-2 text-xs font-medium text-cream transition-colors duration-200 hover:bg-dark2 sm:px-5 sm:text-sm lg:ml-0" />
      </div>
    </header>
  )
}

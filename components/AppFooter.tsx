import Link from 'next/link'
import AppBrand from '@/components/AppBrand'
import { landingFooterLinks } from '@/lib/data/landing'

export default function AppFooter() {
  const copyrightYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-cream py-10">
      <div className="landing-container flex flex-wrap items-center gap-6 sm:gap-10">
        <AppBrand />

        <nav className="flex w-full flex-wrap gap-5 sm:ml-auto sm:w-auto sm:gap-7">
          {landingFooterLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm text-muted transition-colors duration-200 hover:text-dark">
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="w-full text-xs leading-relaxed text-pale">
          {`© ${copyrightYear} Attachd. For educational purposes only. This attachment style test is not a diagnosis and does not replace therapy, medical care, or professional mental health support.`}
        </p>
      </div>
    </footer>
  )
}

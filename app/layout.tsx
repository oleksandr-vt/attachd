import type { Metadata } from 'next'
import AppFooter from '@/components/AppFooter'
import AppNavbar from '@/components/AppNavbar'
import { getMetadataBase } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: 'Attachd.',
    template: '%s | Attachd.',
  },
  description: 'Take a 25-question attachment style test to learn whether your relationship pattern is secure, anxious, avoidant, or fearful-avoidant.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap"
        />
      </head>
      <body>
        <div className="flex min-h-screen flex-col overflow-x-clip">
          <AppNavbar />
          <main className="flex-1">{children}</main>
          <AppFooter />
        </div>
      </body>
    </html>
  )
}

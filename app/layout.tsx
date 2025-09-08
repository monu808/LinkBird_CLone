import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/src/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinkBird - LinkedIn Lead Generation Platform',
  description: 'LinkBird - The ultimate LinkedIn lead generation and campaign management platform. Automate your outreach, manage campaigns, and convert prospects into customers.',
  keywords: 'LinkBird, LinkedIn, lead generation, automation, outreach, sales, CRM',
  authors: [{ name: 'LinkBird Team' }],
  creator: 'LinkBird',
  publisher: 'LinkBird',
  robots: 'index, follow',
  openGraph: {
    title: 'LinkBird - LinkedIn Lead Generation Platform',
    description: 'Automate your LinkedIn outreach and generate qualified leads with LinkBird.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkBird - LinkedIn Lead Generation Platform',
    description: 'Automate your LinkedIn outreach and generate qualified leads with LinkBird.',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

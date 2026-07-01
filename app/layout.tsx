import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

const previewImage = {
  url: '/images/hauslash-social-preview.jpg',
  width: 1200,
  height: 630,
  alt: 'Hauslash Korean lash lift studio in Stoke-on-Trent',
}

export const metadata: Metadata = {
  title: {
    default: 'Hauslash | Premium Lash Lift Studio',
    template: '%s | Hauslash',
  },
  description:
    'Elevate your natural beauty with expert Korean lash lifts and lash tinting. Book your appointment online today.',
  metadataBase: new URL('https://hauslash.co.uk'),
  keywords: [
    'lash lift',
    'Korean lash lift',
    // removed brow lamination
    'lash tint',
    'beauty studio',
    'eyelash treatment',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hauslash | Premium Korean Lash Lift Studio',
    description:
      'Expert Korean lash lifts and lash tinting in Stoke-on-Trent. Book your appointment online.',
    url: '/',
    siteName: 'Hauslash',
    images: [previewImage],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hauslash | Premium Korean Lash Lift Studio',
    description:
      'Expert Korean lash lifts and lash tinting in Stoke-on-Trent. Book your appointment online.',
    images: [previewImage],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}

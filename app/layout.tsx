import { cn } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import ViStore from '@/public/ViStore.png'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

import {
    SITE_CATEGORY,
    SITE_DESCRIPTION,
    SITE_IMAGE,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_URL,
    SITE_TITLE
} from '@/lib/constants'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    weight: ['400', '500', '600', '700'],
    display: 'swap'
})

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' }
    ]
}

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        template: `%s | ${SITE_TITLE}`,
        default: SITE_TITLE
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    alternates: {
        canonical: '/'
    },
    category: SITE_CATEGORY,
    openGraph: {
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        type: 'website',
        siteName: SITE_NAME,
        images: [
            {
                url: SITE_IMAGE
            }
        ]
    },
    icons: {
        icon: ViStore.src,
        shortcut: ViStore.src
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={cn('min-h-svh bg-background antialiased', inter.variable, inter.className)}>
                <main className='mx-auto max-w-7xl'>{children}</main>
                <Toaster />
            </body>
        </html>
    )
}

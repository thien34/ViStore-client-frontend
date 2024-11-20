import FloatingBar from '@/components/FloatingBar'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main className='mx-auto max-w-7xl'>
                <Header />
                {children}
                <Footer />
            </main>
            <FloatingBar />
            <Toaster />
        </>
    )
}

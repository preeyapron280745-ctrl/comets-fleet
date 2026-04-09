import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'COMETS Fleet',
  description: 'ระบบจัดการรถและคนขับ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="bg-bg text-text font-sans">
        <Providers>
          <div className="max-w-mobile mx-auto min-h-screen flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}

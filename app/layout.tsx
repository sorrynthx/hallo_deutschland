import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { LevelProvider } from './contexts/LevelContext'
import TopNav from './components/TopNav'

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700', '800', '900'] })

export const metadata: Metadata = {
  title: 'Hallo Deutschland',
  description: '독일어 A1-B2 학습 포트폴리오',
  manifest: '/manifest.json',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: '독일어 학습' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={nunito.className}>
        <LevelProvider>
          <div className="app-shell">
            <TopNav />
            {children}
          </div>
        </LevelProvider>
      </body>
    </html>
  )
}
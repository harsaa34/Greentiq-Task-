import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard CRM',
  description: 'Professional CRM Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />

          <div className="flex-1 flex flex-col">
            <TopBar />

            <main className="flex-1 overflow-hidden">
              <div className="p-6 h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

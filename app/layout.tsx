import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/hooks/use-auth'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Fulbito Championship 2025',
  description: 'Sistema de gestión para campeonatos de fulbito 2025',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

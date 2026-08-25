import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LG Art Sculptor Studio - Sistema de Facturación',
  description: 'Sistema de facturación para LG Art Sculptor Studio, Inc.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

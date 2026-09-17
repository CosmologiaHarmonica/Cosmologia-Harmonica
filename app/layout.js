import './globals.css'

export const metadata = {
  metadataBase: new URL('https://cosmologia-harmonica.vercel.app'),
  title: 'Cosmologia Harmônica',
  description: 'Uma jornada sonora pelo universo das frequências',
  openGraph: {
    title: 'Cosmologia Harmônica',
    description: 'Uma jornada sonora pelo universo das frequências',
    url: 'https://cosmologia-harmonica.vercel.app',
    siteName: 'Cosmologia Harmônica',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Cosmologia Harmônica',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cosmologia Harmônica',
    description: 'Uma jornada sonora pelo universo das frequências',
    images: ['/og-image.svg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'Georgia, serif' }}>{children}</body>
    </html>
  )
}
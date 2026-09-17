import './globals.css'

export const metadata = {
  title: 'Cosmologia Harmônica',
  description: 'Uma jornada sonora pelo universo das frequências',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'Georgia, serif' }}>{children}</body>
    </html>
  )
}
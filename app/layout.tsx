import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Amelies Pony-Party',
  description: 'Märchenhafte Geburtstags-Homepage für Amelies 9. Geburtstag',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Pacifico&family=Nunito:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}

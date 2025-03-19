import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Masjid Finance Manager",
  description: "A comprehensive finance management system for mosques",
  icons: {
    icon: "https://i.postimg.cc/PJsB3pKf/Leonardo-Kino-XL-Create-a-highquality-favicon-for-the-mosque-f-2-removebg-preview.png",
    apple:
      "https://i.postimg.cc/PJsB3pKf/Leonardo-Kino-XL-Create-a-highquality-favicon-for-the-mosque-f-2-removebg-preview.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://i.postimg.cc/PJsB3pKf/Leonardo-Kino-XL-Create-a-highquality-favicon-for-the-mosque-f-2-removebg-preview.png"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="https://i.postimg.cc/PJsB3pKf/Leonardo-Kino-XL-Create-a-highquality-favicon-for-the-mosque-f-2-removebg-preview.png"
        />
      </head>
      <body>
        <AuthProvider>
          <Toaster position="top-center" />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'
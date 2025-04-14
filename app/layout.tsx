"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/kokonutui/sidebar"
import { useRouter } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Panel de Control de ConfyaConstructor",
  description: "Un panel de control moderno para la gestión de construcción",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn")
    if (loggedIn) {
      setIsLoggedIn(true)
    } else {
      router.push("/login")
    }
  }, [router])

  if (!isLoggedIn) {
    return (
      <html lang="es" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

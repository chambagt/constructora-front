"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  return { logout }
}

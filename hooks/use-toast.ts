"use client"

import { useState } from "react"

type ToastProps = {
  title: string
  description: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts([...toasts, props])

    // En una aplicación real, esto mostraría un toast en la UI
    // Para esta demostración, simplemente mostramos un alert
    alert(`${props.title}: ${props.description}`)
  }

  return { toast }
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DetalleCedula } from "@/components/detalle-cedula"
import { useToast } from "@/hooks/use-toast"

export default function DetalleCedulaPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const cedulaId = params.id as string

  // Función para volver a la lista de cédulas
  const handleBack = () => {
    router.push("/cedulas")
  }

  useEffect(() => {
    // Verificar que el ID existe
    if (!cedulaId) {
      toast({
        title: "Error",
        description: "ID de cédula no válido",
        variant: "destructive",
      })
      router.push("/cedulas")
      return
    }

    // Verificar que la cédula existe en localStorage
    if (typeof window !== "undefined") {
      const cedulasGuardadas = JSON.parse(localStorage.getItem("cedulas") || "[]")
      const cedulaEncontrada = cedulasGuardadas.find((c: any) => c.id === cedulaId)

      if (!cedulaEncontrada) {
        toast({
          title: "Error",
          description: "No se encontró la cédula solicitada",
          variant: "destructive",
        })
        router.push("/cedulas")
        return
      }
    }

    setLoading(false)
  }, [cedulaId, router, toast])

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100 mb-4"></div>
          <p>Cargando detalles de la cédula...</p>
        </div>
      </div>
    )
  }

  return <DetalleCedula cedulaId={cedulaId} onBack={handleBack} />
}

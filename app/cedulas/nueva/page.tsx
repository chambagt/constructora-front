"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { NuevaCedula } from "@/components/kokonutui/nueva-cedula"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NuevaCedulaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Extraer parámetros de la URL
  const proyectoId = searchParams.get("proyectoId")

  // Estado para controlar si se ha cargado la página
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Función para volver a la página anterior
  const handleBack = () => {
    if (proyectoId) {
      router.push(`/proyectos/${proyectoId}`)
    } else {
      router.push("/cedulas")
    }
  }

  if (!isLoaded) {
    return <div className="container mx-auto py-10">Cargando...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">Nueva Cédula</h1>
      </div>

      <NuevaCedula proyectoId={proyectoId} />
    </div>
  )
}

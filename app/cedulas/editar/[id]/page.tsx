"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { NuevaCedula } from "@/components/nueva-cedula"

interface Params {
  id: string
}

export default function EditarCedula({ params }: { params: Params }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [cedulaExiste, setCedulaExiste] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const verificarCedula = () => {
      try {
        const storedCedulas = localStorage.getItem("cedulas")
        if (storedCedulas) {
          const cedulas = JSON.parse(storedCedulas)
          const cedulaEncontrada = cedulas.find((c: any) => c.id === params.id)

          if (cedulaEncontrada) {
            setCedulaExiste(true)
          } else {
            toast({
              title: "Error",
              description: "Cédula no encontrada",
              variant: "destructive",
            })
            router.push("/cedulas")
          }
        }
        setIsLoaded(true)
      } catch (error) {
        console.error("Error al verificar la cédula:", error)
        toast({
          title: "Error",
          description: "Error al verificar la cédula",
          variant: "destructive",
        })
      }
    }

    verificarCedula()
  }, [params.id, router, toast])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!cedulaExiste) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Cédula no encontrada</h1>
        <Button onClick={() => router.push("/cedulas")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la lista
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <Button variant="outline" onClick={() => router.push(`/cedulas/${params.id}`)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>

      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Editar Cédula</h1>

        {/* Renderizamos directamente el componente NuevaCedula con el ID para edición */}
        <div className="w-full">
          <NuevaCedula cedulaId={params.id} />
        </div>
      </Card>
    </div>
  )
}

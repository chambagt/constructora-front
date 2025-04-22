"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText } from "lucide-react"
import { NuevaCedula } from "@/components/kokonutui/nueva-cedula"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DetalleCedula } from "@/components/kokonutui/detalle-cedula"
import { useRouter } from "next/navigation"

// Tipo para la cédula
type Cedula = {
  id: string
  nombre: string
  fecha: string
  elementos: any[]
  total: number
}

export default function CedulasPage() {
  const [mostrarNuevaCedula, setMostrarNuevaCedula] = useState(false)
  const [cedulasGuardadas, setCedulasGuardadas] = useState<Cedula[]>([])
  const [cedulaSeleccionada, setCedulaSeleccionada] = useState<string | null>(null)
  const router = useRouter()

  // Cargar cédulas guardadas del localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")
      setCedulasGuardadas(cedulas)
    }
  }, [mostrarNuevaCedula]) // Actualizar cuando se cierra/abre el formulario de nueva cédula

  // Añadir una función para ver el detalle de una cédula
  const verDetalleCedula = (cedulaId: string) => {
    router.push(`/cedulas/${cedulaId}`)
  }

  // Función para volver a la lista de cédulas
  const volverALista = () => {
    setCedulaSeleccionada(null)
  }

  // Si hay una cédula seleccionada, mostrar sus detalles
  if (cedulaSeleccionada) {
    return <DetalleCedula cedulaId={cedulaSeleccionada} onBack={volverALista} />
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cédulas</h1>
        <Button onClick={() => setMostrarNuevaCedula(!mostrarNuevaCedula)}>
          {mostrarNuevaCedula ? "Cerrar Cédula" : "Nueva Cédula"}
          <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {mostrarNuevaCedula ? (
        <NuevaCedula />
      ) : (
        <div>
          {cedulasGuardadas.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cedulasGuardadas.map((cedula) => (
                <Card key={cedula.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{cedula.nombre}</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Q{cedula.total.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fecha: {new Date(cedula.fecha).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Elementos: {cedula.elementos.length}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => verDetalleCedula(cedula.id)}
                    >
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No hay cédulas guardadas. Presiona el botón "Nueva Cédula" para crear una.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

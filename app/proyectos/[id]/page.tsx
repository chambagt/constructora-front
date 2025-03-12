"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building, Calendar, FileText, PlusCircle } from "lucide-react"
import type { Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"
import { NuevaCedula } from "@/components/kokonutui/nueva-cedula"
import { DetalleCedula } from "@/components/kokonutui/detalle-cedula"

// Tipo para la cédula
type Cedula = {
  id: string
  nombre: string
  fecha: string
  elementos: any[]
  total: number
}

export default function DetalleProyectoPage() {
  const params = useParams()
  const router = useRouter()
  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [loading, setLoading] = useState(true)
  const [mostrarNuevaCedula, setMostrarNuevaCedula] = useState(false)
  const [mostrarSeleccionCedulas, setMostrarSeleccionCedulas] = useState(false)
  const [cedulasDisponibles, setCedulasDisponibles] = useState<Cedula[]>([])
  const [cedulasProyecto, setCedulasProyecto] = useState<Cedula[]>([])
  const [cedulaSeleccionada, setCedulaSeleccionada] = useState<string | null>(null)

  // Obtener el ID del proyecto de la URL
  const proyectoId = params.id as string

  // Cargar datos del proyecto
  useEffect(() => {
    if (typeof window !== "undefined") {
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)

      if (proyectoEncontrado) {
        setProyecto(proyectoEncontrado)

        // Cargar cédulas asociadas al proyecto
        const todasLasCedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")
        const cedulasDelProyecto = todasLasCedulas.filter((c: Cedula) => proyectoEncontrado.cedulas.includes(c.id))
        setCedulasProyecto(cedulasDelProyecto)

        // Cédulas disponibles (no asociadas al proyecto)
        const cedulasNoAsociadas = todasLasCedulas.filter((c: Cedula) => !proyectoEncontrado.cedulas.includes(c.id))
        setCedulasDisponibles(cedulasNoAsociadas)
      }

      setLoading(false)
    }
  }, [proyectoId, mostrarNuevaCedula])

  // Función para asociar una cédula al proyecto
  const asociarCedula = (cedulaId: string) => {
    if (!proyecto) return

    // Actualizar el proyecto con la nueva cédula
    const proyectoActualizado = {
      ...proyecto,
      cedulas: [...proyecto.cedulas, cedulaId],
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      const proyectosActualizados = proyectosGuardados.map((p: Proyecto) =>
        p.id === proyecto.id ? proyectoActualizado : p,
      )
      localStorage.setItem("proyectos", JSON.stringify(proyectosActualizados))

      // Actualizar estado
      setProyecto(proyectoActualizado)

      // Actualizar listas de cédulas
      const todasLasCedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")
      const cedulaAsociada = todasLasCedulas.find((c: Cedula) => c.id === cedulaId)

      setCedulasProyecto([...cedulasProyecto, cedulaAsociada])
      setCedulasDisponibles(cedulasDisponibles.filter((c) => c.id !== cedulaId))
    }

    // Cerrar el selector de cédulas
    setMostrarSeleccionCedulas(false)
  }

  // Función para ver detalles de una cédula
  const verDetalleCedula = (id: string) => {
    setCedulaSeleccionada(id)
  }

  // Función para volver a la lista de cédulas
  const volverALista = () => {
    setCedulaSeleccionada(null)
  }

  if (loading) {
    return <div className="text-center py-10">Cargando datos del proyecto...</div>
  }

  if (!proyecto) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">No se encontró el proyecto solicitado.</p>
        <Button onClick={() => router.push("/proyectos")}>Volver a Proyectos</Button>
      </div>
    )
  }

  // Si hay una cédula seleccionada, mostrar sus detalles
  if (cedulaSeleccionada) {
    return <DetalleCedula cedulaId={cedulaSeleccionada} onBack={volverALista} />
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push("/proyectos")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Proyectos
        </Button>
        <h1 className="text-2xl font-bold">{proyecto.nombre}</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detalles del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre del Proyecto</p>
              <p className="text-lg">{proyecto.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Empresa</p>
              <p className="text-lg flex items-center">
                <Building className="h-4 w-4 mr-2 text-gray-400" />
                {proyecto.empresa}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de Creación</p>
              <p className="text-lg flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {new Date(proyecto.fecha).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cédulas Asociadas</p>
              <p className="text-lg">{cedulasProyecto.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Cédulas del Proyecto</h2>
        <div className="space-x-2">
          <Button
            variant={mostrarSeleccionCedulas ? "default" : "outline"}
            onClick={() => {
              setMostrarSeleccionCedulas(!mostrarSeleccionCedulas)
              setMostrarNuevaCedula(false)
            }}
          >
            Seleccionar Cédulas Existentes
          </Button>
          <Button
            variant={mostrarNuevaCedula ? "default" : "outline"}
            onClick={() => {
              setMostrarNuevaCedula(!mostrarNuevaCedula)
              setMostrarSeleccionCedulas(false)
            }}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nueva Cédula
          </Button>
        </div>
      </div>

      {mostrarSeleccionCedulas && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Cédulas Existentes</CardTitle>
            </CardHeader>
            <CardContent>
              {cedulasDisponibles.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {cedulasDisponibles.map((cedula) => (
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
                          onClick={() => asociarCedula(cedula.id)}
                        >
                          Asociar al Proyecto
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No hay cédulas disponibles para asociar. Crea una nueva cédula.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {mostrarNuevaCedula && (
        <div className="mb-8">
          <NuevaCedula />
        </div>
      )}

      {/* Lista de cédulas asociadas al proyecto */}
      <div>
        {cedulasProyecto.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cedulasProyecto.map((cedula) => (
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
              Este proyecto no tiene cédulas asociadas. Selecciona cédulas existentes o crea una nueva.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


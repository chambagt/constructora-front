"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, PlusCircle, Eye, X, Search } from "lucide-react"
import type { Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

// Tipo para la cédula
type Cedula = {
  id: string
  nombre: string
  fecha: string
  elementos: any[]
  total: number
  proyecto?: string
}

export default function ProyectoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const proyectoId = params.id as string
  const { toast } = useToast()

  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [cedulasProyecto, setCedulasProyecto] = useState<Cedula[]>([])
  const [cedulasDisponibles, setCedulasDisponibles] = useState<Cedula[]>([])
  const [mostrarSeleccionCedulas, setMostrarSeleccionCedulas] = useState(false)
  const [busquedaCedula, setBusquedaCedula] = useState("")

  // Cargar proyecto y cédulas
  useEffect(() => {
    if (typeof window !== "undefined" && proyectoId) {
      // Cargar proyecto
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)
      setProyecto(proyectoEncontrado || null)

      // Cargar todas las cédulas
      const todasLasCedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")

      // Filtrar cédulas asociadas a este proyecto
      const cedulasAsociadas = todasLasCedulas.filter((c: Cedula) => c.proyecto === proyectoId)
      setCedulasProyecto(cedulasAsociadas)

      // Cédulas disponibles (no asociadas a ningún proyecto o a otro proyecto)
      const cedulasNoAsociadas = todasLasCedulas.filter((c: Cedula) => !c.proyecto || c.proyecto !== proyectoId)
      setCedulasDisponibles(cedulasNoAsociadas)
    }
  }, [proyectoId])

  // Ver detalle de cédula
  const verDetalleCedula = (cedulaId: string) => {
    router.push(`/cedulas/${cedulaId}`)
  }

  // Asociar cédula al proyecto
  const asociarCedula = (cedula: Cedula) => {
    if (!proyecto) return

    // Actualizar la cédula con el ID del proyecto
    const cedulaActualizada = {
      ...cedula,
      proyecto: proyectoId,
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      const todasLasCedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")
      const cedulasActualizadas = todasLasCedulas.map((c: Cedula) => (c.id === cedula.id ? cedulaActualizada : c))
      localStorage.setItem("cedulas", JSON.stringify(cedulasActualizadas))
    }

    // Actualizar estado
    setCedulasProyecto([...cedulasProyecto, cedulaActualizada])
    setCedulasDisponibles(cedulasDisponibles.filter((c) => c.id !== cedula.id))

    toast({
      title: "Cédula asociada",
      description: `La cédula "${cedula.nombre}" ha sido asociada al proyecto.`,
    })
  }

  // Desasociar cédula del proyecto
  const desasociarCedula = (cedula: Cedula) => {
    if (!proyecto) return

    // Actualizar la cédula para quitar el ID del proyecto
    const cedulaActualizada = {
      ...cedula,
      proyecto: undefined,
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      const todasLasCedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")
      const cedulasActualizadas = todasLasCedulas.map((c: Cedula) => (c.id === cedula.id ? cedulaActualizada : c))
      localStorage.setItem("cedulas", JSON.stringify(cedulasActualizadas))
    }

    // Actualizar estado
    setCedulasDisponibles([...cedulasDisponibles, cedulaActualizada])
    setCedulasProyecto(cedulasProyecto.filter((c) => c.id !== cedula.id))

    toast({
      title: "Cédula desasociada",
      description: `La cédula "${cedula.nombre}" ha sido desasociada del proyecto.`,
    })
  }

  // Filtrar cédulas disponibles según búsqueda
  const cedulasFiltradas = cedulasDisponibles.filter((cedula) =>
    cedula.nombre.toLowerCase().includes(busquedaCedula.toLowerCase()),
  )

  // Crear nueva cédula (redirección a la página de creación)
  const crearNuevaCedula = () => {
    if (!proyecto) return

    // Redirigir a la página de creación de cédulas con el ID del proyecto
    router.push(`/cedulas/nueva?proyectoId=${proyectoId}`)
  }

  // Ir a la página de resúmenes financieros
  const irAResumenesFinancieros = () => {
    router.push(`/proyectos/${proyectoId}/resumenes-financieros`)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Proyecto</h1>
          <p className="text-gray-500 dark:text-gray-400">{proyecto?.nombre || "Cargando..."}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={crearNuevaCedula}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nueva Cédula
          </Button>
          <Button onClick={irAResumenesFinancieros}>
            <FileText className="h-4 w-4 mr-2" />
            Resúmenes Financieros
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Información del Proyecto</h2>

        {proyecto ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2 font-medium">Nombre:</td>
                    <td className="py-2">{proyecto.nombre}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Empresa:</td>
                    <td className="py-2">{proyecto.empresa}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Fecha:</td>
                    <td className="py-2">{new Date(proyecto.fecha).toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2 font-medium">Ubicación:</td>
                    <td className="py-2">{proyecto.ubicacion || "No especificada"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Responsable:</td>
                    <td className="py-2">{proyecto.responsable || "No especificado"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Tipo:</td>
                    <td className="py-2">Proyecto Principal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Cargando información del proyecto...</p>
        )}
      </div>

      {/* Cédulas del Proyecto */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cédulas del Proyecto</CardTitle>
          <Button
            variant={mostrarSeleccionCedulas ? "default" : "outline"}
            onClick={() => setMostrarSeleccionCedulas(!mostrarSeleccionCedulas)}
          >
            {mostrarSeleccionCedulas ? "Ocultar" : "Asociar Cédulas"}
          </Button>
        </CardHeader>
        <CardContent>
          {/* Selección de Cédulas */}
          {mostrarSeleccionCedulas && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-base">Seleccionar Cédulas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder="Buscar cédulas..."
                    value={busquedaCedula}
                    onChange={(e) => setBusquedaCedula(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {cedulasDisponibles.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-zinc-700">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Acción
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                        {cedulasFiltradas.map((cedula) => (
                          <tr key={cedula.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{cedula.nombre}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {new Date(cedula.fecha).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                              Q{cedula.total.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              <Button size="sm" onClick={() => asociarCedula(cedula)}>
                                Asociar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No hay cédulas disponibles para asociar.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Lista de Cédulas del Proyecto */}
          {cedulasProyecto.length > 0 ? (
            <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-zinc-700">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Elementos
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                  {cedulasProyecto.map((cedula) => (
                    <tr key={cedula.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{cedula.nombre}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {new Date(cedula.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{cedula.elementos.length}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">Q{cedula.total.toFixed(2)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => verDetalleCedula(cedula.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => desasociarCedula(cedula)}>
                            <X className="h-4 w-4 mr-1" />
                            Quitar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No hay cédulas asociadas a este proyecto.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

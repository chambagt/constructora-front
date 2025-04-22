"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calculator, PlusCircle, Eye, X, Search } from "lucide-react"
import type { Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

// Tipo para el Resumen Financiero
type ResumenFinanciero = {
  id: string
  proyectoId: string
  tipo: "presupuesto" | "venta"
  notas: string
  fecha: string
  cedulasAsociadas: string[]
}

// Tipo para la cédula
type Cedula = {
  id: string
  nombre: string
  fecha: string
  elementos: any[]
  total: number
}

export default function ProyectoPresupuestoPage() {
  const params = useParams()
  const router = useRouter()
  const proyectoId = params.id as string
  const { toast } = useToast()

  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [resumenFinanciero, setResumenFinanciero] = useState<ResumenFinanciero | null>(null)
  const [cedulasAsociadas, setCedulasAsociadas] = useState<Cedula[]>([])
  const [cedulasDisponibles, setCedulasDisponibles] = useState<Cedula[]>([])
  const [mostrarSeleccionCedulas, setMostrarSeleccionCedulas] = useState(false)
  const [busquedaCedula, setBusquedaCedula] = useState("")

  // Cargar proyecto, RF y cédulas
  useEffect(() => {
    if (typeof window !== "undefined" && proyectoId) {
      // Cargar proyecto
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)
      setProyecto(proyectoEncontrado || null)

      // Cargar RF
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      const resumenEncontrado = resumenesGuardados.find(
        (r: ResumenFinanciero) => r.proyectoId === proyectoId && r.tipo === "presupuesto",
      )

      // Cargar todas las cédulas
      const todasLasCedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")

      if (resumenEncontrado) {
        // Obtener las cédulas asociadas al RF
        const cedulasDelRF = todasLasCedulas.filter((c: Cedula) => resumenEncontrado.cedulasAsociadas.includes(c.id))
        setCedulasAsociadas(cedulasDelRF)
        setResumenFinanciero(resumenEncontrado)

        // Cédulas disponibles (no asociadas)
        const cedulasNoAsociadas = todasLasCedulas.filter(
          (c: Cedula) => !resumenEncontrado.cedulasAsociadas.includes(c.id),
        )
        setCedulasDisponibles(cedulasNoAsociadas)
      } else {
        // Crear un RF vacío si no existe
        const nuevoRF: ResumenFinanciero = {
          id: `rf-${Date.now()}`,
          proyectoId,
          tipo: "presupuesto",
          notas: "",
          fecha: new Date().toISOString(),
          cedulasAsociadas: [],
        }
        setResumenFinanciero(nuevoRF)

        // Guardar el nuevo RF
        localStorage.setItem("resumenesFinancieros", JSON.stringify([...resumenesGuardados, nuevoRF]))

        // Si no hay RF, todas las cédulas están disponibles
        setCedulasDisponibles(todasLasCedulas)
      }
    }
  }, [proyectoId])

  // Modificar el useEffect que verifica nuevas cédulas para corregir la redirección
  useEffect(() => {
    // Verificar si hay un parámetro en la URL que indique que se creó una nueva cédula
    const checkForNewCedula = () => {
      if (typeof window !== "undefined" && resumenFinanciero) {
        const urlParams = new URLSearchParams(window.location.search)
        const nuevaCedulaId = urlParams.get("nuevaCedula")

        if (nuevaCedulaId) {
          // Cargar todas las cédulas
          const todasLasCedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")
          const nuevaCedula = todasLasCedulas.find((c: Cedula) => c.id === nuevaCedulaId)

          if (nuevaCedula && !resumenFinanciero.cedulasAsociadas.includes(nuevaCedulaId)) {
            // Asociar la nueva cédula al RF
            const rfActualizado = {
              ...resumenFinanciero,
              cedulasAsociadas: [...resumenFinanciero.cedulasAsociadas, nuevaCedulaId],
            }

            // Guardar en localStorage
            const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
            const resumenesActualizados = resumenesGuardados.map((r: ResumenFinanciero) =>
              r.id === resumenFinanciero.id ? rfActualizado : r,
            )
            localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))

            // Actualizar estado
            setResumenFinanciero(rfActualizado)
            setCedulasAsociadas([...cedulasAsociadas, nuevaCedula])

            // Limpiar URL
            window.history.replaceState({}, document.title, window.location.pathname)

            toast({
              title: "Cédula creada y asociada",
              description: `La cédula "${nuevaCedula.nombre}" ha sido creada y asociada al resumen financiero.`,
            })

            // Redirigir para ver la cédula recién creada después de un breve retraso
            setTimeout(() => {
              router.push(`/cedulas/${nuevaCedulaId}`)
            }, 500)
          }
        }
      }
    }

    checkForNewCedula()
  }, [resumenFinanciero, cedulasAsociadas, toast, router])

  // Ver detalle de cédula
  const verDetalleCedula = (cedulaId: string) => {
    router.push(`/cedulas/${cedulaId}`)
  }

  // Asociar cédula
  const asociarCedula = (cedula: Cedula) => {
    if (!resumenFinanciero) return

    // Actualizar la lista de cédulas asociadas
    const nuevasCedulasAsociadas = [...resumenFinanciero.cedulasAsociadas, cedula.id]

    // Actualizar RF
    const rfActualizado = {
      ...resumenFinanciero,
      cedulasAsociadas: nuevasCedulasAsociadas,
      fecha: new Date().toISOString(),
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      const resumenesActualizados = resumenesGuardados.map((r: ResumenFinanciero) =>
        r.id === resumenFinanciero.id ? rfActualizado : r,
      )
      localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
    }

    // Actualizar estado
    setResumenFinanciero(rfActualizado)
    setCedulasAsociadas([...cedulasAsociadas, cedula])
    setCedulasDisponibles(cedulasDisponibles.filter((c) => c.id !== cedula.id))

    toast({
      title: "Cédula asociada",
      description: `La cédula "${cedula.nombre}" ha sido asociada al resumen financiero.`,
    })
  }

  // Desasociar cédula
  const desasociarCedula = (cedula: Cedula) => {
    if (!resumenFinanciero) return

    // Actualizar la lista de cédulas asociadas
    const nuevasCedulasAsociadas = resumenFinanciero.cedulasAsociadas.filter((id) => id !== cedula.id)

    // Actualizar RF
    const rfActualizado = {
      ...resumenFinanciero,
      cedulasAsociadas: nuevasCedulasAsociadas,
      fecha: new Date().toISOString(),
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      const resumenesActualizados = resumenesGuardados.map((r: ResumenFinanciero) =>
        r.id === resumenFinanciero.id ? rfActualizado : r,
      )
      localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
    }

    // Actualizar estado
    setResumenFinanciero(rfActualizado)
    setCedulasDisponibles([...cedulasDisponibles, cedula])
    setCedulasAsociadas(cedulasAsociadas.filter((c) => c.id !== cedula.id))

    toast({
      title: "Cédula desasociada",
      description: `La cédula "${cedula.nombre}" ha sido desasociada del resumen financiero.`,
    })
  }

  // Filtrar cédulas disponibles según búsqueda
  const cedulasFiltradas = cedulasDisponibles.filter((cedula) =>
    cedula.nombre.toLowerCase().includes(busquedaCedula.toLowerCase()),
  )

  // Crear nueva cédula (redirección a la página de creación)
  const crearNuevaCedula = () => {
    if (!resumenFinanciero) return

    // Redirigir a la página de creación de cédulas con parámetros para asociarla automáticamente al RF
    router.push(`/cedulas/nueva?rfId=${resumenFinanciero.id}&proyectoId=${proyectoId}&tipo=presupuesto`)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/proyectos/${proyectoId}`)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Proyecto
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Resumen Financiero (RF) - Presupuesto</h1>
          <p className="text-gray-500 dark:text-gray-400">{proyecto?.nombre || "Cargando..."}</p>
        </div>
      </div>

      {/* Resumen Financiero - Simplificado */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Resumen Financiero
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resumenFinanciero && (
            <div className="space-y-4">
              {/* Cédulas Asociadas */}
              <div className="mt-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Cédulas Asociadas</h2>
                  <div className="flex space-x-2">
                    <Button
                      variant={mostrarSeleccionCedulas ? "default" : "outline"}
                      onClick={() => setMostrarSeleccionCedulas(!mostrarSeleccionCedulas)}
                    >
                      {mostrarSeleccionCedulas ? "Ocultar" : "Asociar Cédulas"}
                    </Button>
                    <Button onClick={crearNuevaCedula}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Nueva Cédula
                    </Button>
                  </div>
                </div>

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

                {/* Lista de Cédulas Asociadas */}
                {cedulasAsociadas.length > 0 ? (
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
                        {cedulasAsociadas.map((cedula) => (
                          <tr key={cedula.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{cedula.nombre}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {new Date(cedula.fecha).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{cedula.elementos.length}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                              Q{cedula.total.toFixed(2)}
                            </td>
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
                    <p className="text-gray-500 dark:text-gray-400">
                      No hay cédulas asociadas a este resumen financiero.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

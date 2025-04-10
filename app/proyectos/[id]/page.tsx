"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Building,
  Calendar,
  FileText,
  PlusCircle,
  DollarSign,
  Eye,
  Package,
  HardHat,
  Truck,
} from "lucide-react"
import type { Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"
import { NuevaCedula } from "@/components/kokonutui/nueva-cedula"
import { DetalleCedula } from "@/components/kokonutui/detalle-cedula"
import Link from "next/link"

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
  const [subproyectos, setSubproyectos] = useState<Proyecto[]>([])
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

        // Si es un proyecto principal, cargar sus subproyectos
        if (proyectoEncontrado.esProyectoPrincipal) {
          const subproyectos = proyectosGuardados.filter((p: Proyecto) => p.proyectoPrincipalId === proyectoId)
          setSubproyectos(subproyectos)
        }

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

  // Función para obtener el icono según el tipo de elementos predominante en la cédula
  const getIconoTipoCedula = (cedula: Cedula) => {
    const elementos = cedula.elementos || []
    const tiposMT = elementos.filter((e) => e.familia === "MT").length
    const tiposMO = elementos.filter((e) => e.familia === "MO").length
    const tiposEQ = elementos.filter((e) => e.familia === "EQ").length

    if (tiposMT >= tiposMO && tiposMT >= tiposEQ) {
      return <Package className="h-4 w-4 mr-2 text-blue-500" />
    } else if (tiposMO >= tiposMT && tiposMO >= tiposEQ) {
      return <HardHat className="h-4 w-4 mr-2 text-green-500" />
    } else {
      return <Truck className="h-4 w-4 mr-2 text-amber-500" />
    }
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
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo de Proyecto</p>
              <p className="text-lg flex items-center">
                {proyecto.tipo === "venta" ? (
                  <>
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    Venta
                  </>
                ) : proyecto.tipo === "presupuesto" ? (
                  <>
                    <Building className="h-4 w-4 mr-2 text-blue-500" />
                    Presupuesto
                  </>
                ) : (
                  <>
                    <Building className="h-4 w-4 mr-2 text-purple-500" />
                    Principal
                  </>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mostrar subproyectos si es un proyecto principal */}
      {proyecto.esProyectoPrincipal && subproyectos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Subproyectos</h2>
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-zinc-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cédulas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                  {subproyectos.map((subproyecto) => (
                    <tr key={subproyecto.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {subproyecto.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          {subproyecto.tipo === "venta" ? (
                            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <Building className="h-4 w-4 mr-2 text-blue-500" />
                          )}
                          {subproyecto.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            subproyecto.tipo === "venta"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {subproyecto.tipo === "venta" ? "Venta" : "Presupuesto"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          {subproyecto.cedulas?.length || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/proyectos/${subproyecto.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* No mostrar la sección de cédulas para proyectos principales */}
      {!proyecto.esProyectoPrincipal && (
        <>
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
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-zinc-700">
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Nombre
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Fecha
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Elementos
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Total
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                            {cedulasDisponibles.map((cedula) => (
                              <tr key={cedula.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                  {cedula.id.substring(0, 8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                                    {cedula.nombre}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    {new Date(cedula.fecha).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                  {cedula.elementos.length}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                  Q{cedula.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => asociarCedula(cedula.id)}
                                    className="text-blue-600 dark:text-blue-400"
                                  >
                                    Asociar
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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

          {/* Lista de cédulas asociadas al proyecto en formato tabla */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Cédulas Asociadas</h2>
            {cedulasProyecto.length > 0 ? (
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-700">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Elementos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                      {cedulasProyecto.map((cedula) => (
                        <tr key={cedula.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {cedula.id.substring(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            <div className="flex items-center">
                              {getIconoTipoCedula(cedula)}
                              {cedula.nombre}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {new Date(cedula.fecha).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-gray-400" />
                              {cedula.elementos.length}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                            Q{cedula.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => verDetalleCedula(cedula.id)}
                              className="text-blue-600 dark:text-blue-400"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Este proyecto no tiene cédulas asociadas. Selecciona cédulas existentes o crea una nueva.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

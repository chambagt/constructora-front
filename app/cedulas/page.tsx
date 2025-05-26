"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  PlusCircle,
  FileText,
  Search,
  Calendar,
  Package,
  HardHat,
  Truck,
  Filter,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react"
import { NuevaCedula } from "@/components/nueva-cedula"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DetalleCedula } from "@/components/detalle-cedula"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Tipo para la cédula
type Cedula = {
  id: string
  nombre: string
  fecha: string
  elementos: any[]
  total: number
  proyecto?: string
  cliente?: string
  ubicacion?: string
  responsable?: string
  notas?: string
}

export default function CedulasPage() {
  const [mostrarNuevaCedula, setMostrarNuevaCedula] = useState(false)
  const [cedulasGuardadas, setCedulasGuardadas] = useState<Cedula[]>([])
  const [cedulasFiltradas, setCedulasFiltradas] = useState<Cedula[]>([])
  const [cedulaSeleccionada, setCedulaSeleccionada] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [ordenarPor, setOrdenarPor] = useState<"fecha" | "nombre" | "total">("fecha")
  const [ordenAscendente, setOrdenAscendente] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const router = useRouter()

  // Cargar cédulas guardadas del localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")
      setCedulasGuardadas(cedulas)
      setCedulasFiltradas(cedulas)
    }
  }, [mostrarNuevaCedula]) // Actualizar cuando se cierra/abre el formulario de nueva cédula

  // Filtrar y ordenar cédulas
  useEffect(() => {
    let resultado = [...cedulasGuardadas]

    // Aplicar búsqueda
    if (busqueda) {
      resultado = resultado.filter(
        (cedula) =>
          cedula.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          (cedula.cliente && cedula.cliente.toLowerCase().includes(busqueda.toLowerCase())) ||
          (cedula.proyecto && cedula.proyecto.toLowerCase().includes(busqueda.toLowerCase())),
      )
    }

    // Aplicar filtro por tipo
    if (filtroTipo !== "todos") {
      resultado = resultado.filter((cedula) => {
        // Determinar el tipo predominante de la cédula
        const materialesCount = cedula.elementos.filter((e) => e.familia === "MT").length
        const manoObraCount = cedula.elementos.filter((e) => e.familia === "MO").length
        const equiposCount = cedula.elementos.filter((e) => e.familia === "EQ").length

        const tipoPredominante = Math.max(materialesCount, manoObraCount, equiposCount)

        if (filtroTipo === "materiales" && tipoPredominante === materialesCount) return true
        if (filtroTipo === "manoObra" && tipoPredominante === manoObraCount) return true
        if (filtroTipo === "equipos" && tipoPredominante === equiposCount) return true
        return false
      })
    }

    // Ordenar resultados
    resultado.sort((a, b) => {
      if (ordenarPor === "fecha") {
        return ordenAscendente
          ? new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
          : new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      } else if (ordenarPor === "nombre") {
        return ordenAscendente ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
      } else {
        // total
        return ordenAscendente ? a.total - b.total : b.total - a.total
      }
    })

    setCedulasFiltradas(resultado)
  }, [cedulasGuardadas, busqueda, ordenarPor, ordenAscendente, filtroTipo])

  // Añadir una función para ver el detalle de una cédula
  const verDetalleCedula = (cedulaId: string) => {
    router.push(`/cedulas/${cedulaId}`)
  }

  // Función para volver a la lista de cédulas
  const volverALista = () => {
    setCedulaSeleccionada(null)
  }

  // Función para eliminar una cédula
  const eliminarCedula = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se active el clic en la tarjeta

    if (confirm("¿Está seguro que desea eliminar esta cédula?")) {
      const cedulasActualizadas = cedulasGuardadas.filter((cedula) => cedula.id !== id)
      localStorage.setItem("cedulas", JSON.stringify(cedulasActualizadas))
      setCedulasGuardadas(cedulasActualizadas)
    }
  }

  // Función para obtener el tipo predominante de una cédula
  const obtenerTipoPredominante = (cedula: Cedula) => {
    const materialesCount = cedula.elementos.filter((e) => e.familia === "MT").length
    const manoObraCount = cedula.elementos.filter((e) => e.familia === "MO").length
    const equiposCount = cedula.elementos.filter((e) => e.familia === "EQ").length

    if (materialesCount >= manoObraCount && materialesCount >= equiposCount) {
      return { tipo: "materiales", color: "blue" }
    } else if (manoObraCount >= materialesCount && manoObraCount >= equiposCount) {
      return { tipo: "mano de obra", color: "green" }
    } else {
      return { tipo: "equipos", color: "amber" }
    }
  }

  // Función para calcular subtotales por familia
  const calcularSubtotales = (cedula: Cedula) => {
    const totalMateriales = cedula.elementos
      .filter((elemento) => elemento.familia === "MT")
      .reduce((sum, elemento) => sum + elemento.total, 0)

    const totalManoObra = cedula.elementos
      .filter((elemento) => elemento.familia === "MO")
      .reduce((sum, elemento) => sum + elemento.total, 0)

    const totalEquipos = cedula.elementos
      .filter((elemento) => elemento.familia === "EQ")
      .reduce((sum, elemento) => sum + elemento.total, 0)

    return { totalMateriales, totalManoObra, totalEquipos }
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
          {/* Filtros y búsqueda */}
          <div className="mb-6 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Buscar cédulas..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="materiales">Materiales</SelectItem>
                    <SelectItem value="manoObra">Mano de obra</SelectItem>
                    <SelectItem value="equipos">Equipos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <SortAsc className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Select
                  value={ordenarPor}
                  onValueChange={(value: "fecha" | "nombre" | "total") => setOrdenarPor(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fecha">Fecha</SelectItem>
                    <SelectItem value="nombre">Nombre</SelectItem>
                    <SelectItem value="total">Total</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={() => setOrdenAscendente(!ordenAscendente)}
                className="flex items-center justify-center"
              >
                {ordenAscendente ? (
                  <>
                    <SortAsc className="mr-2 h-4 w-4" />
                    Ascendente
                  </>
                ) : (
                  <>
                    <SortDesc className="mr-2 h-4 w-4" />
                    Descendente
                  </>
                )}
              </Button>
            </div>

            {/* Estadísticas */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-zinc-700 p-3 rounded-md flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total de cédulas</p>
                  <p className="text-lg font-bold">{cedulasGuardadas.length}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-700 p-3 rounded-md flex items-center">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Última actualización</p>
                  <p className="text-sm font-medium">
                    {cedulasGuardadas.length > 0
                      ? new Date(
                          Math.max(...cedulasGuardadas.map((c) => new Date(c.fecha).getTime())),
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-700 p-3 rounded-md flex items-center">
                <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full mr-3">
                  <Package className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Elementos totales</p>
                  <p className="text-lg font-bold">
                    {cedulasGuardadas.reduce((sum, cedula) => sum + cedula.elementos.length, 0)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-700 p-3 rounded-md flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-3">
                  <HardHat className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Valor total</p>
                  <p className="text-lg font-bold">
                    Q{cedulasGuardadas.reduce((sum, cedula) => sum + cedula.total, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pestañas para diferentes vistas */}
          <Tabs defaultValue="tarjetas" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="tarjetas">Vista de tarjetas</TabsTrigger>
              <TabsTrigger value="compacta">Vista compacta</TabsTrigger>
            </TabsList>

            <TabsContent value="tarjetas">
              {cedulasFiltradas.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {cedulasFiltradas.map((cedula) => {
                    const tipoPredominante = obtenerTipoPredominante(cedula)
                    const { totalMateriales, totalManoObra, totalEquipos } = calcularSubtotales(cedula)

                    return (
                      <Card
                        key={cedula.id}
                        className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
                        style={{
                          borderLeftColor:
                            tipoPredominante.color === "blue"
                              ? "#3b82f6"
                              : tipoPredominante.color === "green"
                                ? "#10b981"
                                : "#f59e0b",
                        }}
                        onClick={() => verDetalleCedula(cedula.id)}
                      >
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                          <div>
                            <CardTitle className="text-base font-medium">{cedula.nombre}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(cedula.fecha).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              className={`mr-2 ${
                                tipoPredominante.color === "blue"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : tipoPredominante.color === "green"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                              }`}
                            >
                              {tipoPredominante.tipo}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900"
                              onClick={(e) => eliminarCedula(cedula.id, e)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">Q{cedula.total.toFixed(2)}</div>

                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Package className="h-3 w-3 text-blue-500 mr-1" />
                                <span className="text-xs">Materiales</span>
                              </div>
                              <span className="text-xs font-medium">Q{totalMateriales.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <HardHat className="h-3 w-3 text-green-500 mr-1" />
                                <span className="text-xs">Mano de obra</span>
                              </div>
                              <span className="text-xs font-medium">Q{totalManoObra.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Truck className="h-3 w-3 text-amber-500 mr-1" />
                                <span className="text-xs">Equipos</span>
                              </div>
                              <span className="text-xs font-medium">Q{totalEquipos.toFixed(2)}</span>
                            </div>
                          </div>

                          {cedula.cliente && (
                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-700">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Cliente:{" "}
                                <span className="font-medium text-gray-700 dark:text-gray-300">{cedula.cliente}</span>
                              </p>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => verDetalleCedula(cedula.id)}
                          >
                            Ver Detalles
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 text-center border border-gray-200 dark:border-zinc-700">
                  <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    {busqueda || filtroTipo !== "todos"
                      ? "No se encontraron cédulas con los filtros aplicados."
                      : "No hay cédulas guardadas."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBusqueda("")
                      setFiltroTipo("todos")
                      setOrdenarPor("fecha")
                    }}
                    className="mt-2"
                  >
                    {busqueda || filtroTipo !== "todos" ? "Limpiar filtros" : "Crear nueva cédula"}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="compacta">
              {cedulasFiltradas.length > 0 ? (
                <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-700 border-b border-gray-200 dark:border-zinc-600">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Elementos
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                      {cedulasFiltradas.map((cedula) => {
                        const tipoPredominante = obtenerTipoPredominante(cedula)

                        return (
                          <tr
                            key={cedula.id}
                            className="hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer"
                            onClick={() => verDetalleCedula(cedula.id)}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-2">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {cedula.nombre}
                                  </div>
                                  {cedula.cliente && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{cedula.cliente}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(cedula.fecha).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Badge
                                className={`${
                                  tipoPredominante.color === "blue"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : tipoPredominante.color === "green"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                }`}
                              >
                                {tipoPredominante.tipo}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {cedula.elementos.length}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                Q{cedula.total.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  verDetalleCedula(cedula.id)
                                }}
                              >
                                Ver
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                onClick={(e) => eliminarCedula(cedula.id, e)}
                              >
                                Eliminar
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 text-center border border-gray-200 dark:border-zinc-700">
                  <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    {busqueda || filtroTipo !== "todos"
                      ? "No se encontraron cédulas con los filtros aplicados."
                      : "No hay cédulas guardadas."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBusqueda("")
                      setFiltroTipo("todos")
                      setOrdenarPor("fecha")
                    }}
                    className="mt-2"
                  >
                    {busqueda || filtroTipo !== "todos" ? "Limpiar filtros" : "Crear nueva cédula"}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

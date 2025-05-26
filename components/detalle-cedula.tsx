"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Package, HardHat, Truck, ArrowLeft, Calculator, Pencil } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Tipo para los elementos de la cédula
type ElementoCedula = {
  id: string
  codigo: string
  familia: string
  descripcion: string
  unidad: string
  precio: number
  cantidad: number
  total: number
  rendimiento?: number
  costoGlobal?: number
  costoUnidad?: number
  porcentaje?: number
  rendHora?: number
  mxHora?: number
}

// Actualizar el tipo Cedula para incluir la información de la fila de tarea
type Cedula = {
  id: string
  nombre: string
  fecha: string
  elementos: ElementoCedula[]
  total: number
  proyecto?: string
  cliente?: string
  ubicacion?: string
  responsable?: string
  notas?: string
  filaTarea?: string
  filaDescripcion?: string
  filaUnidad?: string
  filaCantidad?: number
  filaRendUnidad?: number
}

interface DetalleCedulaProps {
  cedulaId: string
  onBack: () => void
}

export function DetalleCedula({ cedulaId, onBack }: DetalleCedulaProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [cedula, setCedula] = useState<Cedula | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar la cédula desde localStorage
    if (typeof window !== "undefined") {
      const cedulasGuardadas = JSON.parse(localStorage.getItem("cedulas") || "[]")
      const cedulaEncontrada = cedulasGuardadas.find((c: Cedula) => c.id === cedulaId)

      if (cedulaEncontrada) {
        setCedula(cedulaEncontrada)
      }

      setLoading(false)
    }
  }, [cedulaId])

  // Calcular subtotales por familia
  const totalMateriales =
    cedula?.elementos
      .filter((elemento) => elemento.familia === "MT")
      .reduce((sum, elemento) => sum + (elemento.total || 0), 0) || 0

  const totalManoObra =
    cedula?.elementos
      .filter((elemento) => elemento.familia === "MO")
      .reduce((sum, elemento) => sum + (elemento.total || 0), 0) || 0

  const totalEquipos =
    cedula?.elementos
      .filter((elemento) => elemento.familia === "EQ")
      .reduce((sum, elemento) => sum + (elemento.total || 0), 0) || 0

  // Función para editar cédula completa
  const editarCedulaCompleta = () => {
    router.push(`/cedulas/editar/${cedulaId}`)
  }

  if (loading) {
    return <div className="text-center py-10">Cargando detalles de la cédula...</div>
  }

  if (!cedula) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">No se encontró la cédula solicitada.</p>
        <Button onClick={onBack}>Volver a la lista</Button>
      </div>
    )
  }

  // Calcular el total de insumos para la fila de tarea
  const totalInsumosFila = (cedula.filaCantidad || 0) * (cedula.filaRendUnidad || 0)

  // Filtrar elementos por familia
  const materialesSeleccionados = cedula.elementos.filter((elemento) => elemento.familia === "MT")
  const manoObraSeleccionada = cedula.elementos.filter((elemento) => elemento.familia === "MO")
  const equiposSeleccionados = cedula.elementos.filter((elemento) => elemento.familia === "EQ")

  return (
    <div className="space-y-6 relative pb-20">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h2 className="text-2xl font-bold flex-1">{cedula.nombre}</h2>
        <Button onClick={editarCedulaCompleta} variant="outline">
          <Pencil className="h-4 w-4 mr-2" />
          Editar Cédula Completa
        </Button>
      </div>

      <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg mb-4">
        <div className="text-sm mb-2">Fecha: {new Date(cedula.fecha).toLocaleDateString()}</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded-md">
            <Package className="h-4 w-4 text-blue-500 mr-2" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Materiales:</span>
              <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                Q{(totalMateriales || 0).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded-md">
            <HardHat className="h-4 w-4 text-green-500 mr-2" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Mano de Obra:</span>
              <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                Q{(totalManoObra || 0).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded-md">
            <Truck className="h-4 w-4 text-amber-500 mr-2" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Equipamiento:</span>
              <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                Q{(totalEquipos || 0).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded-md">
            <Calculator className="h-4 w-4 text-green-500 mr-2" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Total de la Cédula:</span>
              <span className="font-bold text-[11px] text-gray-900 dark:text-white">
                Q{(cedula.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fila de tareas - estilo exacto como en la imagen */}
      <table className="w-full border border-gray-200 dark:border-zinc-700 text-[10px] mb-4">
        <thead>
          <tr className="bg-gray-50 dark:bg-zinc-800 h-6">
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              Tarea
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              Unidad
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              Cant
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              %IMP
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              Q.IMP
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              %FACT IND
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              Q.IND.UTILD
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              TOTAL
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              P/U
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300">
              %INCIDENCIA
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white dark:bg-zinc-900 h-6">
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{cedula?.filaTarea || "-"}</td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{cedula?.filaUnidad || "-"}</td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{cedula?.filaCantidad || "0"}</td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">12%</td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">
              {(cedula.total * 0.12).toFixed(2)}
            </td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">15%</td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">
              {(cedula.total * 0.15).toFixed(2)}
            </td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 font-medium">
              {totalInsumosFila.toFixed(2)}
            </td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">
              {cedula.filaCantidad ? (cedula.total / cedula.filaCantidad).toFixed(2) : "0.00"}
            </td>
            <td className="px-2 py-1">100.00%</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-4">Detalles de la Cédula</h2>
        <Tabs defaultValue="elementos" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="elementos">Elementos</TabsTrigger>
            <TabsTrigger value="detalles">Detalles</TabsTrigger>
            <TabsTrigger value="analisis">Análisis</TabsTrigger>
          </TabsList>
          <TabsContent value="elementos" className="mt-0">
            {/* Sección de Materiales */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Package className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-md font-medium">Materiales (MT)</h3>
              </div>

              {materialesSeleccionados.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 dark:border-zinc-700 text-[10px]">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Código
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Familia
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Descripción
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Unidad
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Rend/Unidad
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Total insumos
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Costo
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Costo global
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Costo unidad
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y-0 divide-gray-200 dark:divide-zinc-700">
                      {materialesSeleccionados.map((elemento) => (
                        <tr
                          key={elemento.id}
                          className="hover:bg-gray-50 dark:hover:bg-zinc-700 border-b border-gray-200 dark:border-zinc-700 h-5 leading-none"
                        >
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                            {elemento.codigo}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.familia}
                          </td>
                          <td className="px-0.5 py-0 text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.descripcion}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.unidad}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.rendimiento || 1}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.total || 0).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.precio || 0).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoUnidad || (elemento.precio || 0) * (elemento.rendimiento || 1)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.porcentaje || 0).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                        <td
                          colSpan={6}
                          className="px-0.5 py-0 text-right text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700"
                        >
                          Subtotal:
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          -
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          Q
                          {materialesSeleccionados
                            .reduce(
                              (sum, elemento) =>
                                sum + (elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0)),
                              0,
                            )
                            .toFixed(2)}
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          -
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white">
                          Q
                          {materialesSeleccionados.reduce((sum, elemento) => sum + (elemento.total || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay materiales en esta cédula.</p>
              )}
            </div>

            {/* Sección de Mano de Obra */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <HardHat className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-md font-medium">Mano de Obra (MO)</h3>
              </div>

              {manoObraSeleccionada.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 dark:border-zinc-700 text-[10px]">
                    {/* Similar table structure as materials */}
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Código
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Familia
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Descripción
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Unidad
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Rend/Unidad
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Total insumos
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Costo
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Costo global
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Costo unidad
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y-0 divide-gray-200 dark:divide-zinc-700">
                      {manoObraSeleccionada.map((elemento) => (
                        <tr
                          key={elemento.id}
                          className="hover:bg-gray-50 dark:hover:bg-zinc-700 border-b border-gray-200 dark:border-zinc-700 h-5 leading-none"
                        >
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                            {elemento.codigo}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.familia}
                          </td>
                          <td className="px-0.5 py-0 text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.descripcion}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.unidad}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.rendimiento || 1}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.total || 0).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.precio || 0).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoUnidad || (elemento.precio || 0) * (elemento.rendimiento || 1)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.porcentaje || 0).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                        <td
                          colSpan={6}
                          className="px-0.5 py-0 text-right text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700"
                        >
                          Subtotal:
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          -
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          Q
                          {manoObraSeleccionada
                            .reduce(
                              (sum, elemento) =>
                                sum + (elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0)),
                              0,
                            )
                            .toFixed(2)}
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          -
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white">
                          Q{manoObraSeleccionada.reduce((sum, elemento) => sum + (elemento.total || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay mano de obra en esta cédula.</p>
              )}
            </div>

            {/* Sección de Equipamiento */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Truck className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="text-md font-medium">Equipamiento (EQ)</h3>
              </div>

              {equiposSeleccionados.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 dark:border-zinc-700 text-[10px]">
                    {/* Similar table structure as materials */}
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Código
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Familia
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Descripción
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Unidad
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Rend/Unidad
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Total insumos
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Costo
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Costo global
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          Costo unidad
                        </th>
                        <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y-0 divide-gray-200 dark:divide-zinc-700">
                      {equiposSeleccionados.map((elemento) => (
                        <tr
                          key={elemento.id}
                          className="hover:bg-gray-50 dark:hover:bg-zinc-700 border-b border-gray-200 dark:border-zinc-700 h-5 leading-none"
                        >
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                            {elemento.codigo}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.familia}
                          </td>
                          <td className="px-0.5 py-0 text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.descripcion}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.unidad}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {elemento.rendimiento || 1}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.total || 0).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.precio || 0).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoUnidad || (elemento.precio || 0) * (elemento.rendimiento || 1)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.porcentaje || 0).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                        <td
                          colSpan={6}
                          className="px-0.5 py-0 text-right text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700"
                        >
                          Subtotal:
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          -
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          Q
                          {equiposSeleccionados
                            .reduce(
                              (sum, elemento) =>
                                sum + (elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0)),
                              0,
                            )
                            .toFixed(2)}
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          -
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white">
                          Q{equiposSeleccionados.reduce((sum, elemento) => sum + (elemento.total || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay equipamiento en esta cédula.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="detalles">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Proyecto:</h3>
                  <p className="text-sm">{cedula.proyecto ? `Proyecto #${cedula.proyecto}` : "No asignado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Cliente:</h3>
                  <p className="text-sm">{cedula.cliente || "No especificado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Ubicación:</h3>
                  <p className="text-sm">{cedula.ubicacion || "No especificada"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Responsable:</h3>
                  <p className="text-sm">{cedula.responsable || "No especificado"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Notas:</h3>
                <p className="text-sm p-2 bg-gray-50 dark:bg-zinc-800 rounded-md min-h-[100px]">
                  {cedula.notas || "Sin notas adicionales"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analisis">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <h3 className="text-md font-medium mb-3">Distribución de Costos</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Materiales:</span>
                    <span className="text-sm font-medium">
                      {totalMateriales > 0 ? `${((totalMateriales / cedula.total) * 100).toFixed(2)}%` : "0%"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mano de Obra:</span>
                    <span className="text-sm font-medium">
                      {totalManoObra > 0 ? `${((totalManoObra / cedula.total) * 100).toFixed(2)}%` : "0%"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Equipamiento:</span>
                    <span className="text-sm font-medium">
                      {totalEquipos > 0 ? `${((totalEquipos / cedula.total) * 100).toFixed(2)}%` : "0%"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <h3 className="text-md font-medium mb-3">Factores Aplicados</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Impuestos:</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Indirectos:</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Utilidad:</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

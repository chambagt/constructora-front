"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Package, HardHat, Truck, DollarSign, ArrowLeft, Download, Printer, Calculator } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

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

  // Función para exportar la cédula a PDF (simulada)
  const exportarPDF = () => {
    toast({
      title: "Exportando a PDF",
      description: "La cédula se está exportando a PDF...",
    })
    // Aquí iría la lógica real para exportar a PDF
    setTimeout(() => {
      toast({
        title: "PDF generado",
        description: "La cédula ha sido exportada a PDF con éxito.",
      })
    }, 1500)
  }

  // Función para imprimir la cédula (simulada)
  const imprimirCedula = () => {
    toast({
      title: "Preparando impresión",
      description: "Preparando la cédula para imprimir...",
    })
    // Aquí iría la lógica real para imprimir
    setTimeout(() => {
      window.print()
    }, 1000)
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

  // Filtrar elementos por familia
  const materialesSeleccionados = cedula.elementos.filter((elemento) => elemento.familia === "MT")
  const manoObraSeleccionada = cedula.elementos.filter((elemento) => elemento.familia === "MO")
  const equiposSeleccionados = cedula.elementos.filter((elemento) => elemento.familia === "EQ")

  // Calcular subtotales por familia
  const totalMateriales = materialesSeleccionados.reduce((sum, elemento) => sum + elemento.total, 0)
  const totalManoObra = manoObraSeleccionada.reduce((sum, elemento) => sum + elemento.total, 0)
  const totalEquipos = equiposSeleccionados.reduce((sum, elemento) => sum + elemento.total, 0)

  // Calcular porcentajes
  const subtotalCedula = totalMateriales + totalManoObra + totalEquipos
  const porcentajeMateriales = subtotalCedula > 0 ? (totalMateriales / subtotalCedula) * 100 : 0
  const porcentajeManoObra = subtotalCedula > 0 ? (totalManoObra / subtotalCedula) * 100 : 0
  const porcentajeEquipos = subtotalCedula > 0 ? (totalEquipos / subtotalCedula) * 100 : 0

  // Modificar la función renderTablaElementos para usar el mismo estilo compacto que en NuevaCedula
  const renderTablaElementos = (elementos: ElementoCedula[], titulo: string, icono: React.ReactNode) => {
    if (elementos.length === 0) return null

    // Si es equipamiento, mostrar tabla con estructura diferente
    if (titulo.includes("Equipamiento")) {
      return (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            {icono}
            <h3 className="text-sm font-medium ml-2">{titulo}</h3>
          </div>
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
                    Rend/hora
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Mx/hora
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
                {elementos.map((elemento) => (
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
                      {elemento.rendHora || 1}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      {elemento.mxHora || 0}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      {elemento.unidad}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      {elemento.rendimiento || 1}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      {elemento.total.toFixed(2)}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      Q{elemento.precio.toFixed(2)}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      Q{elemento.costoGlobal?.toFixed(2) || (elemento.precio * elemento.cantidad).toFixed(2)}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      Q
                      {elemento.costoUnidad?.toFixed(2) ||
                        ((elemento.precio * elemento.cantidad) / (elemento.rendimiento || 1)).toFixed(2)}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      {elemento.porcentaje?.toFixed(2) || "0.00"}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                  <td
                    colSpan={11}
                    className="px-0.5 py-0 text-right text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700"
                  >
                    Subtotal:
                  </td>
                  <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white">
                    Q{elementos.reduce((sum, elemento) => sum + elemento.total, 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    // Para materiales y mano de obra, mantener la tabla original
    return (
      <div className="mb-4">
        <div className="flex items-center mb-2">
          {icono}
          <h3 className="text-sm font-medium ml-2">{titulo}</h3>
        </div>
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
              {elementos.map((elemento) => (
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
                    {elemento.total.toFixed(2)}
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    Q{elemento.precio.toFixed(2)}
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    Q{elemento.costoGlobal?.toFixed(2) || (elemento.precio * elemento.cantidad).toFixed(2)}
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    Q
                    {elemento.costoUnidad?.toFixed(2) ||
                      ((elemento.precio * elemento.cantidad) / (elemento.rendimiento || 1)).toFixed(2)}
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    {elemento.porcentaje?.toFixed(2) || "0.00"}%
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                <td
                  colSpan={9}
                  className="px-0.5 py-0 text-right text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700"
                >
                  Subtotal:
                </td>
                <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white">
                  Q{elementos.reduce((sum, elemento) => sum + elemento.total, 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative pb-20">
      <div className="flex items-center mb-4">
        <Button variant="outline" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h2 className="text-2xl font-bold">{cedula.nombre}</h2>
      </div>
      <Card>
        <CardHeader className="pb-0">
          <div>
            <h3 className="text-xl font-bold">{cedula.nombre}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fecha: {new Date(cedula.fecha).toLocaleDateString()}
            </p>
            {cedula.proyecto && <p className="text-sm text-gray-500 dark:text-gray-400">Proyecto: {cedula.proyecto}</p>}
            {cedula.cliente && <p className="text-sm text-gray-500 dark:text-gray-400">Cliente: {cedula.cliente}</p>}
          </div>

          {/* Panel de totales sticky */}
          <div className="sticky top-0 z-50 bg-white dark:bg-[#0F0F12] border-b border-gray-200 dark:border-zinc-700 pt-4 pb-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-2 rounded-md">
                <Package className="h-4 w-4 text-blue-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Materiales:</span>
                  <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                    Q{totalMateriales.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-2 rounded-md">
                <HardHat className="h-4 w-4 text-green-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Mano de Obra:</span>
                  <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                    Q{totalManoObra.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-2 rounded-md">
                <Truck className="h-4 w-4 text-amber-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Equipamiento:</span>
                  <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                    Q{totalEquipos.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-2 rounded-md">
                <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Total de la Cédula:</span>
                  <span className="font-bold text-[11px] text-gray-900 dark:text-white">
                    Q{cedula.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Fila de tarea */}
            {(cedula.filaTarea || cedula.filaDescripcion || cedula.filaUnidad || cedula.filaCantidad) && (
              <div className="mt-2 border border-gray-200 dark:border-zinc-700 rounded-md overflow-hidden">
                <div className="grid grid-cols-12 gap-0 bg-gray-50 dark:bg-zinc-800 text-[9px] font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-zinc-700 h-4">
                  <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">
                    Tarea
                  </div>
                  <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center"></div>
                  <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">
                    Unidad
                  </div>
                  <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">
                    Cant
                  </div>
                  <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center"></div>
                  <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">
                    %IMP
                  </div>
                  <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">
                    Q.IMP
                  </div>
                  <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">
                    %FACT IND
                  </div>
                  <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">
                    Q.IND.UTILD
                  </div>
                  <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">
                    TOTAL
                  </div>
                  <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">P/U</div>
                  <div className="px-0.5 py-0 flex items-center">%INCIDENCIA</div>
                </div>
                <div className="grid grid-cols-12 gap-0 bg-white dark:bg-zinc-900 h-5">
                  <div className="p-0 border-r border-gray-200 dark:border-zinc-700 px-0.5 py-0 text-[10px] flex items-center">
                    {cedula.filaTarea || "-"}
                  </div>
                  <div className="p-0 border-r border-gray-200 dark:border-zinc-700 px-0.5 py-0 text-[10px] flex items-center">
                    {cedula.filaDescripcion || "-"}
                  </div>
                  <div className="p-0 border-r border-gray-200 dark:border-zinc-700 px-0.5 py-0 text-[10px] flex items-center">
                    {cedula.filaUnidad || "-"}
                  </div>
                  <div className="p-0 border-r border-gray-200 dark:border-zinc-700 px-0.5 py-0 text-[10px] flex items-center">
                    {cedula.filaCantidad || "0"}
                  </div>
                  <div className="p-0 border-r border-gray-200 dark:border-zinc-700 px-0.5 py-0 text-[10px] flex items-center">
                    -
                  </div>
                  <div className="p-0 border-r border-gray-200 dark:border-zinc-700 px-0.5 py-0 text-[10px] flex items-center">
                    -
                  </div>
                  <div className="p-0 border-r border-gray-200 dark:border-zinc-700 px-0.5 py-0 text-[10px] flex items-center">
                    -
                  </div>
                  <div className="p-0 border-r border-gray-200 dark:border-zinc-700 px-0.5 py-0 text-[10px] flex items-center">
                    -
                  </div>
                  <div className="p-0 border-r border-gray-200 dark:border-zinc-700 px-0.5 py-0 text-[10px] flex items-center">
                    -
                  </div>
                  <div className="p-0 border-r border-gray-200 dark:border-zinc-700 px-0.5 py-0 text-[10px] flex items-center">
                    -
                  </div>
                  <div className="p-0 border-r border-gray-200 dark:border-zinc-700 px-0.5 py-0 text-[10px] flex items-center">
                    -
                  </div>
                  <div className="p-0 px-0.5 py-0 text-[10px] flex items-center">-</div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="elementos" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="elementos">Elementos</TabsTrigger>
              <TabsTrigger value="detalles">Detalles</TabsTrigger>
              <TabsTrigger value="analisis">Análisis</TabsTrigger>
            </TabsList>

            <TabsContent value="elementos" className="space-y-6">
              {/* Elementos de la cédula por familia */}
              <div>
                {/* Materiales */}
                {renderTablaElementos(
                  materialesSeleccionados,
                  "Materiales (MT)",
                  <Package className="h-5 w-5 text-blue-500" />,
                )}

                {/* Mano de Obra */}
                {renderTablaElementos(
                  manoObraSeleccionada,
                  "Mano de Obra (MO)",
                  <HardHat className="h-5 w-5 text-green-500" />,
                )}

                {/* Equipamiento */}
                {renderTablaElementos(
                  equiposSeleccionados,
                  "Equipamiento (EQ)",
                  <Truck className="h-5 w-5 text-amber-500" />,
                )}
              </div>
            </TabsContent>

            <TabsContent value="detalles" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <h4 className="text-md font-medium mb-3">Información del Proyecto</h4>
                  <div className="space-y-2">
                    {cedula.proyecto && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Proyecto:</span>
                        <span className="font-medium">{cedula.proyecto}</span>
                      </div>
                    )}
                    {cedula.cliente && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cliente:</span>
                        <span className="font-medium">{cedula.cliente}</span>
                      </div>
                    )}
                    {cedula.ubicacion && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ubicación:</span>
                        <span className="font-medium">{cedula.ubicacion}</span>
                      </div>
                    )}
                    {cedula.responsable && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Responsable:</span>
                        <span className="font-medium">{cedula.responsable}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fecha de creación:</span>
                      <span className="font-medium">{new Date(cedula.fecha).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <h4 className="text-md font-medium mb-3 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-gray-500" />
                    Resumen de Totales
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Materiales:</span>
                      <span className="font-medium">Q{totalMateriales.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Mano de Obra:</span>
                      <span className="font-medium">Q{totalManoObra.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Equipamiento:</span>
                      <span className="font-medium">Q{totalEquipos.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold">TOTAL GENERAL:</span>
                        <span className="font-bold">Q{cedula.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {cedula.notas && (
                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <h4 className="text-md font-medium mb-2">Notas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{cedula.notas}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analisis" className="space-y-4">
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                <h4 className="text-md font-medium mb-3">Distribución de Costos</h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Materiales</span>
                      <span>{porcentajeMateriales.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${porcentajeMateriales}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Mano de Obra</span>
                      <span>{porcentajeManoObra.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${porcentajeManoObra}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Equipamiento</span>
                      <span>{porcentajeEquipos.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${porcentajeEquipos}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <h4 className="text-md font-medium mb-2">Elementos</h4>
                  <div className="text-3xl font-bold">{cedula.elementos.length}</div>
                  <p className="text-sm text-gray-500">Total de elementos en la cédula</p>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <h4 className="text-md font-medium mb-2">Costo Promedio</h4>
                  <div className="text-3xl font-bold">
                    Q{(cedula.total / (cedula.elementos.length || 1)).toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-500">Costo promedio por elemento</p>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <h4 className="text-md font-medium mb-2">Fecha</h4>
                  <div className="text-xl font-bold">{new Date(cedula.fecha).toLocaleDateString()}</div>
                  <p className="text-sm text-gray-500">Fecha de creación</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Tablas separadas para cada categoría con los títulos solicitados */}

          {/* Botones de acción */}
          <div className="flex justify-between mt-6">
            <div className="space-x-2">
              <Button variant="outline" onClick={exportarPDF} className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button variant="outline" onClick={imprimirCedula} className="flex items-center">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
            </div>
            <Button variant="outline" onClick={onBack} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la lista
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

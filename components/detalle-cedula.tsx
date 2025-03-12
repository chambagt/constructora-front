"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Package, HardHat, Truck, DollarSign, ArrowLeft } from "lucide-react"

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
}

// Tipo para la cédula completa
type Cedula = {
  id: string
  nombre: string
  fecha: string
  elementos: ElementoCedula[]
  total: number
}

interface DetalleCedulaProps {
  cedulaId: string
  onBack: () => void
}

export function DetalleCedula({ cedulaId, onBack }: DetalleCedulaProps) {
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

  // Renderizar tabla de elementos por familia
  const renderTablaElementos = (elementos: ElementoCedula[], titulo: string, icono: React.ReactNode) => {
    if (elementos.length === 0) return null

    return (
      <div className="mb-6">
        <div className="flex items-center mb-2">
          {icono}
          <h3 className="text-lg font-medium ml-2">{titulo}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-700">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Familia
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
              {elementos.map((elemento) => (
                <tr key={elemento.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {elemento.codigo}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {elemento.familia}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300">{elemento.descripcion}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {elemento.unidad}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Q{elemento.precio.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {elemento.cantidad}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Q{elemento.total.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-zinc-700">
                <td colSpan={6} className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                  Subtotal:
                </td>
                <td className="px-4 py-2 text-sm font-bold text-gray-900 dark:text-white">
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
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="outline" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h2 className="text-2xl font-bold">{cedula.nombre}</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            <div>
              <h3 className="text-xl font-bold">{cedula.nombre}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fecha: {new Date(cedula.fecha).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-3 rounded-md">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total de la Cédula:</span>
                <span className="font-bold text-xl text-gray-900 dark:text-white">Q{cedula.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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

            {/* Resumen de totales */}
            <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Resumen de Totales</h3>
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
        </CardContent>
      </Card>
    </div>
  )
}


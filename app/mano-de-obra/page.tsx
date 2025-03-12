"use client"

import { useState } from "react"
import { AgregarManoObraForm } from "@/components/kokonutui/agregar-mano-obra-form"
import { Button } from "@/components/ui/button"
import { HardHat } from "lucide-react"

// Tipo para representar un trabajo de mano de obra
type ManoObra = {
  id: string
  codigo: string
  familia: string
  trabajo: string
  unidad: string
  precio: number
}

// Mano de obra de ejemplo (en una aplicación real, estos vendrían de una base de datos)
const manoObraEjemplo: ManoObra[] = [
  { id: "1", codigo: "MO-001", familia: "MO", trabajo: "Albañilería", unidad: "día", precio: 150.0 },
  { id: "2", codigo: "MO-002", familia: "MO", trabajo: "Electricista", unidad: "hora", precio: 75.5 },
  { id: "3", codigo: "MO-003", familia: "MO", trabajo: "Pintura", unidad: "m²", precio: 25.0 },
  { id: "4", codigo: "MO-004", familia: "MO", trabajo: "Plomería", unidad: "hora", precio: 80.0 },
  { id: "5", codigo: "MO-005", familia: "MO", trabajo: "Carpintería", unidad: "día", precio: 200.0 },
]

export default function ManoDeObraPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mano de Obra</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cerrar Formulario" : "Agregar Mano de Obra"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <AgregarManoObraForm />
        </div>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Familia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trabajo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
              {manoObraEjemplo.map((manoObra) => (
                <tr key={manoObra.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {manoObra.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {manoObra.familia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <HardHat className="h-4 w-4 mr-2 text-gray-400" />
                      {manoObra.trabajo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {manoObra.unidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Q{manoObra.precio.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


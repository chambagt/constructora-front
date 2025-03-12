"use client"

import { useState } from "react"
import { AgregarMaterialForm } from "@/components/kokonutui/agregar-material-form"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

// Tipo para representar un material
type Material = {
  id: string
  codigo: string
  familia: string
  nombre: string
  unidad: string
  precio: number
}

// Materiales de ejemplo (en una aplicación real, estos vendrían de una base de datos)
const materialesEjemplo: Material[] = [
  { id: "1", codigo: "MAT-001", familia: "MT", nombre: "Cemento Portland", unidad: "saco", precio: 85.5 },
  { id: "2", codigo: "MAT-002", familia: "MT", nombre: "Arena de río", unidad: "m³", precio: 150.0 },
  { id: "3", codigo: "MAT-003", familia: "MT", nombre: 'Varilla de acero 3/8"', unidad: "unidad", precio: 45.75 },
  { id: "4", codigo: "MAT-004", familia: "MT", nombre: "Bloque de concreto", unidad: "unidad", precio: 8.25 },
  { id: "5", codigo: "MAT-005", familia: "MT", nombre: "Madera para encofrado", unidad: "pie²", precio: 12.5 },
]

export default function MaterialesPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Materiales</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cerrar Formulario" : "Agregar Material"}</Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <AgregarMaterialForm />
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
                  Material
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
              {materialesEjemplo.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {material.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {material.familia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-gray-400" />
                      {material.nombre}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {material.unidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Q{material.precio.toFixed(2)}
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


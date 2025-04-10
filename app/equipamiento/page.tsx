"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react"

// Tipo para representar un equipo
type Equipo = {
  id: string
  codigo: string
  familia: string
  nombre: string
  consumoCombustible: number
  precioAlquiler: number
  unidad: string
}

export default function EquipamientoPage() {
  const [showForm, setShowForm] = useState(false)
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [cargando, setCargando] = useState(true)

  // Cargar datos de ejemplo al montar el componente
  useEffect(() => {
    // Datos de ejemplo
    const equiposEjemplo: Equipo[] = [
      {
        id: "1",
        codigo: "EQ-001",
        familia: "EQ",
        nombre: "Excavadora",
        consumoCombustible: 15,
        precioAlquiler: 350.0,
        unidad: "hora",
      },
      {
        id: "2",
        codigo: "EQ-002",
        familia: "EQ",
        nombre: "Mezcladora de concreto",
        consumoCombustible: 5,
        precioAlquiler: 200.0,
        unidad: "día",
      },
      {
        id: "3",
        codigo: "EQ-003",
        familia: "EQ",
        nombre: "Andamio",
        consumoCombustible: 0,
        precioAlquiler: 50.0,
        unidad: "día",
      },
      {
        id: "4",
        codigo: "EQ-004",
        familia: "EQ",
        nombre: "Compactadora",
        consumoCombustible: 8,
        precioAlquiler: 180.0,
        unidad: "día",
      },
      {
        id: "5",
        codigo: "EQ-005",
        familia: "EQ",
        nombre: "Generador eléctrico",
        consumoCombustible: 12,
        precioAlquiler: 120.0,
        unidad: "día",
      },
    ]

    // Simular una carga de datos
    setTimeout(() => {
      setEquipos(equiposEjemplo)
      setCargando(false)
    }, 500)
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipamiento</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cerrar Formulario" : "Agregar Equipamiento"}
        </Button>
      </div>

      {cargando ? (
        <div className="text-center py-10">Cargando equipamiento...</div>
      ) : equipos.length === 0 ? (
        <div className="text-center py-10">No hay equipamiento disponible.</div>
      ) : (
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
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Consumo Combustible (L/h)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Precio Alquiler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Unidad
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                {equipos.map((equipo) => (
                  <tr key={equipo.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {equipo.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {equipo.familia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-gray-400" />
                        {equipo.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {equipo.consumoCombustible}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Q{equipo.precioAlquiler.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {equipo.unidad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

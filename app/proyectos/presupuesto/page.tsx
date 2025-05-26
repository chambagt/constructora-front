"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Building, Calendar, FileText, Eye } from "lucide-react"
import { NuevoProyectoForm, type Proyecto } from "@/components/nuevo-proyecto-form"
import Link from "next/link"

export default function ProyectosPresupuestoPage() {
  const [showForm, setShowForm] = useState(false)
  const [proyectos, setProyectos] = useState<Proyecto[]>([])

  // Cargar proyectos guardados
  useEffect(() => {
    if (typeof window !== "undefined") {
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      // Filtrar solo proyectos de tipo presupuesto o sin tipo (para compatibilidad)
      const proyectosPresupuesto = proyectosGuardados.filter((p: Proyecto) => !p.tipo || p.tipo === "presupuesto")
      setProyectos(proyectosPresupuesto)
    }
  }, [showForm])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Proyectos de Presupuesto</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cerrar Formulario" : "Nuevo Proyecto de Presupuesto"}
          <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <NuevoProyectoForm tipo="presupuesto" />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Proyectos de Presupuesto Existentes</h2>

        {proyectos.length > 0 ? (
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
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fecha
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
                  {proyectos.map((proyecto) => (
                    <tr key={proyecto.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {proyecto.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-gray-400" />
                          {proyecto.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {proyecto.empresa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(proyecto.fecha).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          {proyecto.cedulas?.length || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/proyectos/${proyecto.id}`}>
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
        ) : (
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No hay proyectos de presupuesto. Presiona el botón "Nuevo Proyecto de Presupuesto" para crear uno.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

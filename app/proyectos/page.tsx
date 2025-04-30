"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Building, Calendar, DollarSign, Filter, Eye, FileText } from "lucide-react"
import { NuevoProyectoForm, type Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"
import Link from "next/link"

export default function ProyectosPage() {
  const [showForm, setShowForm] = useState(false)
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [filtro, setFiltro] = useState<"todos" | "presupuesto" | "venta" | "principales">("todos")

  // Cargar proyectos guardados
  useEffect(() => {
    if (typeof window !== "undefined") {
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      setProyectos(proyectosGuardados)
    }
  }, [showForm])

  // Filtrar proyectos según el tipo seleccionado
  const proyectosFiltrados = proyectos.filter((proyecto) => {
    if (filtro === "todos") return true
    if (filtro === "principales") return proyecto.esProyectoPrincipal
    if (filtro === "presupuesto") return proyecto.tipo === "presupuesto"
    return proyecto.tipo === filtro
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cerrar Formulario" : "Nuevo Proyecto"}
          <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <NuevoProyectoForm />
        </div>
      )}

      <div className="flex items-center mb-6 space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">Filtrar por:</span>
        <div className="flex space-x-2">
          <Button variant={filtro === "todos" ? "default" : "outline"} size="sm" onClick={() => setFiltro("todos")}>
            Todos
          </Button>
          <Button
            variant={filtro === "principales" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltro("principales")}
          >
            Principales
          </Button>
          <Button
            variant={filtro === "presupuesto" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltro("presupuesto")}
          >
            Presupuesto
          </Button>
          <Button variant={filtro === "venta" ? "default" : "outline"} size="sm" onClick={() => setFiltro("venta")}>
            Venta
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Proyectos Existentes</h2>

        {proyectosFiltrados.length > 0 ? (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-zinc-700">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cédulas
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                  {proyectosFiltrados.map((proyecto) => (
                    <tr key={proyecto.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                      <td className="px-3 py-1.5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {proyecto.id.substring(0, 8)}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          {proyecto.esProyectoPrincipal ? (
                            <Building className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                          ) : proyecto.tipo === "venta" ? (
                            <DollarSign className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                          ) : (
                            <Building className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                          )}
                          {proyecto.nombre}
                        </div>
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {proyecto.empresa}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <span
                          className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${
                            proyecto.esProyectoPrincipal
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                              : proyecto.tipo === "venta"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {proyecto.esProyectoPrincipal
                            ? "Principal"
                            : proyecto.tipo === "venta"
                              ? "Venta"
                              : "Presupuesto"}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          {new Date(proyecto.fecha).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          {proyecto.cedulas?.length || 0}
                        </div>
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-sm font-medium">
                        <Link href={`/proyectos/${proyecto.id}`}>
                          <Button variant="ghost" size="xs" className="text-blue-600 dark:text-blue-400 h-6 px-2">
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
              No hay proyectos que coincidan con el filtro seleccionado. Presiona el botón "Nuevo Proyecto" para crear
              uno.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

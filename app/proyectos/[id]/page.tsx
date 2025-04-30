"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { FileText, MapPin, Building, Calendar, User, Tag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"

export default function ProyectoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const proyectoId = params.id as string

  const [proyecto, setProyecto] = useState<Proyecto | null>(null)

  // Cargar proyecto
  useEffect(() => {
    if (typeof window !== "undefined" && proyectoId) {
      // Cargar proyecto
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)
      setProyecto(proyectoEncontrado || null)
    }
  }, [proyectoId])

  // Ir a la página de resúmenes financieros
  const irAResumenesFinancieros = () => {
    router.push(`/proyectos/${proyectoId}/resumenes-financieros`)
  }

  // Volver a la lista de proyectos
  const volverAProyectos = () => {
    router.push("/proyectos")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={volverAProyectos} className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a proyectos
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{proyecto?.nombre || "Cargando..."}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Detalles del proyecto</p>
          </div>
          <Button onClick={irAResumenesFinancieros} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <FileText className="h-5 w-5 mr-2" />
            Resúmenes Financieros
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Información del Proyecto</h2>
        </CardHeader>
        <CardContent className="p-6">
          {proyecto ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{proyecto.nombre}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Building className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Empresa</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{proyecto.empresa}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {new Date(proyecto.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ubicación</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {proyecto.ubicacion || (
                        <span className="text-gray-400 dark:text-gray-500 italic">No especificada</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Responsable</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {proyecto.responsable || (
                        <span className="text-gray-400 dark:text-gray-500 italic">No especificado</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo</p>
                    <Badge className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Proyecto Principal
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Cargando información del proyecto...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección para estadísticas o información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-1">Presupuesto</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">Gestiona el presupuesto del proyecto</p>
            <Button
              variant="outline"
              className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30"
              onClick={() => router.push(`/proyectos/${proyectoId}/presupuesto`)}
            >
              Ver presupuesto
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-1">Ventas</h3>
            <p className="text-sm text-green-600 dark:text-green-400">Revisa las ventas asociadas al proyecto</p>
            <Button
              variant="outline"
              className="mt-4 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/30"
              onClick={() => router.push(`/proyectos/${proyectoId}/venta`)}
            >
              Ver ventas
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-1">Cédulas</h3>
            <p className="text-sm text-amber-600 dark:text-amber-400">Administra las cédulas del proyecto</p>
            <Button
              variant="outline"
              className="mt-4 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
              onClick={() => router.push(`/cedulas`)}
            >
              Ver cédulas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

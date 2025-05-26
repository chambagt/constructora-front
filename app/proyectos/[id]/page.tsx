"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building, Calendar, Tag, MapPin, User } from "lucide-react"
import type { Proyecto } from "@/components/nuevo-proyecto-form"

export default function ProyectoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const proyectoId = params.id as string

  const [proyecto, setProyecto] = useState<Proyecto | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && proyectoId) {
      try {
        const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
        const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)
        setProyecto(proyectoEncontrado || null)
      } catch (error) {
        console.error("Error al cargar el proyecto:", error)
      }
    }
  }, [proyectoId])

  const handlePresupuestoClick = () => {
    router.push(`/proyectos/${proyectoId}/resumenes-financieros`)
  }

  if (!proyecto) {
    return <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Header with only back arrow */}
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/proyectos")}
          className="text-zinc-400 hover:text-white p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Project title */}
      <div className="px-4 pb-4">
        <h1 className="text-2xl font-bold">{proyecto.nombre}</h1>
      </div>

      {/* Project info card */}
      <div className="px-4 pb-6">
        <div className="bg-zinc-900 rounded-md p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <Building className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-400">Empresa</p>
                <p className="font-medium">{proyecto.empresa || "Din Holdings"}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-400">Ubicación</p>
                <p className="font-medium">{proyecto.ubicacion || "No especificada"}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-400">Fecha</p>
                <p className="font-medium">
                  {proyecto.fechaInicio
                    ? new Date(proyecto.fechaInicio).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <User className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-400">Responsable</p>
                <p className="font-medium">{proyecto.responsable || "No especificado"}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Tag className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-400">Tipo</p>
                <p className="font-medium">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Proyecto Principal
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="px-4">
        <Button
          onClick={handlePresupuestoClick}
          className="w-full h-14 mb-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-between px-4"
        >
          <div className="flex flex-col items-start">
            <span className="text-lg font-medium">Presupuesto</span>
            <span className="text-xs text-blue-200">Gestiona el presupuesto del proyecto</span>
          </div>
          <ArrowLeft className="h-5 w-5 transform rotate-180" />
        </Button>
      </div>
    </div>
  )
}

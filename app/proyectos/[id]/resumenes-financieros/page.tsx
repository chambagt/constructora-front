"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Trash2 } from "lucide-react"
import type { Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"
import { useToast } from "@/hooks/use-toast"

// Tipo para el Resumen Financiero
type ResumenFinanciero = {
  id: string
  proyectoId: string
  tipo: "presupuesto" | "venta"
  nombre: string
  descripcion: string
  costoDirecto: number
  costoIndirecto: number
  utilidad: number
  impuestos: number
  total: number
  notas: string
  fecha: string
  cedulasAsociadas: string[]
}

export default function ResumenesFinancierosPage() {
  const params = useParams()
  const router = useRouter()
  const proyectoId = params.id as string
  const { toast } = useToast()

  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [resumenesFinancieros, setResumenesFinancieros] = useState<ResumenFinanciero[]>([])
  const [tipoActivo, setTipoActivo] = useState<"presupuesto" | "venta">("presupuesto")

  // Cargar proyecto y resúmenes financieros
  useEffect(() => {
    if (typeof window !== "undefined" && proyectoId) {
      // Cargar proyecto
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)
      setProyecto(proyectoEncontrado || null)

      // Cargar resúmenes financieros
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      const resumenesFiltrados = resumenesGuardados.filter((r: ResumenFinanciero) => r.proyectoId === proyectoId)
      setResumenesFinancieros(resumenesFiltrados)
    }
  }, [proyectoId])

  // Crear nuevo RF
  const crearNuevoRF = (tipo: "presupuesto" | "venta") => {
    if (!proyecto) return

    const nuevoRF: ResumenFinanciero = {
      id: `rf-${Date.now()}`,
      proyectoId,
      tipo,
      nombre: `${tipo === "presupuesto" ? "Presupuesto" : "Venta"} - ${proyecto.nombre}`,
      descripcion: "",
      costoDirecto: 0,
      costoIndirecto: 0,
      utilidad: 0,
      impuestos: 0,
      total: 0,
      notas: "",
      fecha: new Date().toISOString(),
      cedulasAsociadas: [],
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      localStorage.setItem("resumenesFinancieros", JSON.stringify([...resumenesGuardados, nuevoRF]))
    }

    // Actualizar estado
    setResumenesFinancieros([...resumenesFinancieros, nuevoRF])

    // Redirigir a la página de detalle del RF
    router.push(`/proyectos/${proyectoId}/resumenes-financieros/${nuevoRF.id}`)

    toast({
      title: "Resumen financiero creado",
      description: `Se ha creado un nuevo resumen financiero de ${tipo}.`,
    })
  }

  // Ver detalle de RF
  const verDetalleRF = (rfId: string) => {
    router.push(`/proyectos/${proyectoId}/resumenes-financieros/${rfId}`)
  }

  // Eliminar RF
  const eliminarRF = (rfId: string) => {
    // Eliminar de localStorage
    if (typeof window !== "undefined") {
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      const resumenesActualizados = resumenesGuardados.filter((r: ResumenFinanciero) => r.id !== rfId)
      localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
    }

    // Actualizar estado
    setResumenesFinancieros(resumenesFinancieros.filter((r) => r.id !== rfId))

    toast({
      title: "Resumen financiero eliminado",
      description: "El resumen financiero ha sido eliminado con éxito.",
    })
  }

  // Formatear número como moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }

  if (!proyecto) {
    return <div className="container mx-auto py-10">Cargando...</div>
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Encabezado */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/proyectos/${proyectoId}`)}
            className="mr-4 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Proyecto
          </Button>
          <div>
            <h1 className="text-xl font-bold">Resúmenes Financieros</h1>
            <p className="text-sm text-zinc-400">{proyecto.nombre}</p>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="grid grid-cols-2 gap-1 p-2">
        <button
          className={`py-3 px-4 text-center rounded-sm transition-colors ${
            tipoActivo === "presupuesto" ? "bg-zinc-800 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          }`}
          onClick={() => setTipoActivo("presupuesto")}
        >
          Presupuesto
        </button>
        <button
          className={`py-3 px-4 text-center rounded-sm transition-colors ${
            tipoActivo === "venta" ? "bg-zinc-800 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          }`}
          onClick={() => setTipoActivo("venta")}
        >
          Venta
        </button>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Resúmenes de {tipoActivo === "presupuesto" ? "Presupuesto" : "Venta"}</h2>
          <Button
            onClick={() => crearNuevoRF(tipoActivo)}
            className="bg-zinc-800 hover:bg-zinc-700 text-white border-none"
          >
            Nuevo RF {tipoActivo === "presupuesto" ? "Presupuesto" : "Venta"}
          </Button>
        </div>

        {/* Tabla */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 px-4 font-medium text-zinc-400">Nombre</th>
                <th className="text-left py-2 px-4 font-medium text-zinc-400">Descripción</th>
                <th className="text-left py-2 px-4 font-medium text-zinc-400">Fecha</th>
                <th className="text-right py-2 px-4 font-medium text-zinc-400">Total</th>
                <th className="text-right py-2 px-4 font-medium text-zinc-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resumenesFinancieros
                .filter((rf) => rf.tipo === tipoActivo)
                .map((rf) => (
                  <tr key={rf.id} className="border-b border-zinc-800 hover:bg-zinc-900">
                    <td className="py-3 px-4">{rf.nombre}</td>
                    <td className="py-3 px-4">{rf.descripcion || "-"}</td>
                    <td className="py-3 px-4">{formatDate(rf.fecha)}</td>
                    <td className="py-3 px-4 text-right">${formatCurrency(rf.total)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => verDetalleRF(rf.id)}
                          className="h-8 px-2 text-zinc-400 hover:text-white"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarRF(rf.id)}
                          className="h-8 px-2 text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              {resumenesFinancieros.filter((rf) => rf.tipo === tipoActivo).length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    No hay resúmenes financieros de {tipoActivo} disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

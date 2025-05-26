"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Trash2 } from "lucide-react"
import type { Proyecto } from "@/components/nuevo-proyecto-form"
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
  const [isLoading, setIsLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Cargar proyecto y resúmenes financieros - solo una vez al montar el componente
  useEffect(() => {
    // Skip if already loaded
    if (dataLoaded) return

    const loadData = () => {
      try {
        if (typeof window === "undefined") return

        setIsLoading(true)

        // Cargar proyecto
        const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
        const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)

        // Cargar resúmenes financieros (solo de tipo presupuesto)
        const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
        const resumenesFiltrados = resumenesGuardados.filter(
          (r: ResumenFinanciero) => r.proyectoId === proyectoId && r.tipo === "presupuesto",
        )

        setProyecto(proyectoEncontrado || null)
        setResumenesFinancieros(resumenesFiltrados)
        setDataLoaded(true)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "Hubo un problema al cargar los datos. Inténtalo de nuevo.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [proyectoId, toast, dataLoaded])

  // Crear nuevo RF
  const crearNuevoRF = () => {
    if (!proyecto) return

    try {
      // Siempre creamos un resumen de tipo presupuesto
      const nuevoRF: ResumenFinanciero = {
        id: `rf-${Date.now()}`,
        proyectoId,
        tipo: "presupuesto", // Siempre será de tipo presupuesto
        nombre: `Presupuesto - ${proyecto.nombre}`,
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

      // Redirigir a la página de detalle del RF
      router.push(`/proyectos/${proyectoId}/resumenes-financieros/${nuevoRF.id}`)

      toast({
        title: "Presupuesto creado",
        description: "Se ha creado un nuevo presupuesto.",
      })
    } catch (error) {
      console.error("Error al crear presupuesto:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al crear el presupuesto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Ver detalle de RF
  const verDetalleRF = (rfId: string) => {
    router.push(`/proyectos/${proyectoId}/resumenes-financieros/${rfId}`)
  }

  // Eliminar RF
  const eliminarRF = (rfId: string) => {
    try {
      // Eliminar de localStorage
      if (typeof window !== "undefined") {
        const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
        const resumenesActualizados = resumenesGuardados.filter((r: ResumenFinanciero) => r.id !== rfId)
        localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
      }

      // Actualizar estado
      setResumenesFinancieros(resumenesFinancieros.filter((r) => r.id !== rfId))

      toast({
        title: "Presupuesto eliminado",
        description: "El presupuesto ha sido eliminado con éxito.",
      })
    } catch (error) {
      console.error("Error al eliminar presupuesto:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el presupuesto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
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

  if (isLoading) {
    return <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">Cargando...</div>
  }

  if (!proyecto) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
        Proyecto no encontrado
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Header with only back arrow */}
      <div className="p-4 border-b border-zinc-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/proyectos/${proyectoId}`)}
          className="text-zinc-400 hover:text-white p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Presupuestos</h2>
          <Button onClick={crearNuevoRF} className="bg-zinc-800 hover:bg-zinc-700 text-white border-none">
            Nuevo Presupuesto
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
              {resumenesFinancieros.map((rf) => (
                <tr key={rf.id} className="border-b border-zinc-800 hover:bg-zinc-900">
                  <td className="py-3 px-4">{rf.nombre}</td>
                  <td className="py-3 px-4">{rf.descripcion || "-"}</td>
                  <td className="py-3 px-4">{formatDate(rf.fecha)}</td>
                  <td className="py-3 px-4 text-right">Q{formatCurrency(rf.total)}</td>
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
              {resumenesFinancieros.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    No hay presupuestos disponibles.
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

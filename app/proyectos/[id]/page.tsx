"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign, ArrowRight } from "lucide-react"
import type { Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"

export default function ProyectoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const proyectoId = params.id as string

  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [tieneRFPresupuesto, setTieneRFPresupuesto] = useState(false)
  const [tieneRFVenta, setTieneRFVenta] = useState(false)

  // Cargar proyecto y verificar si tiene RF
  useEffect(() => {
    if (typeof window !== "undefined" && proyectoId) {
      // Cargar proyecto
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)
      setProyecto(proyectoEncontrado || null)

      // Verificar si tiene RF
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")

      const tienePresupuesto = resumenesGuardados.some(
        (r: any) => r.proyectoId === proyectoId && r.tipo === "presupuesto",
      )
      setTieneRFPresupuesto(tienePresupuesto)

      const tieneVenta = resumenesGuardados.some((r: any) => r.proyectoId === proyectoId && r.tipo === "venta")
      setTieneRFVenta(tieneVenta)
    }
  }, [proyectoId])

  // Ir a la página de RF de presupuesto
  const irAPresupuesto = () => {
    router.push(`/proyectos/${proyectoId}/presupuesto`)
  }

  // Ir a la página de RF de venta
  const irAVenta = () => {
    router.push(`/proyectos/${proyectoId}/venta`)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Proyecto</h1>
          <p className="text-gray-500 dark:text-gray-400">{proyecto?.nombre || "Cargando..."}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Presupuesto (RF)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {tieneRFPresupuesto
                ? "Ver o editar el resumen financiero de presupuesto y sus cédulas asociadas."
                : "Crea un resumen financiero de presupuesto para este proyecto."}
            </p>
            <Button onClick={irAPresupuesto}>
              {tieneRFPresupuesto ? "Ver RF Presupuesto" : "Crear RF Presupuesto"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Venta (RF)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {tieneRFVenta
                ? "Ver o editar el resumen financiero de venta y sus cédulas asociadas."
                : "Crea un resumen financiero de venta para este proyecto."}
            </p>
            <Button onClick={irAVenta}>
              {tieneRFVenta ? "Ver RF Venta" : "Crear RF Venta"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Información del Proyecto</h2>

        {proyecto ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2 font-medium">Nombre:</td>
                    <td className="py-2">{proyecto.nombre}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Empresa:</td>
                    <td className="py-2">{proyecto.empresa}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Fecha:</td>
                    <td className="py-2">{new Date(proyecto.fecha).toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2 font-medium">Ubicación:</td>
                    <td className="py-2">{proyecto.ubicacion || "No especificada"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Responsable:</td>
                    <td className="py-2">{proyecto.responsable || "No especificado"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Tipo:</td>
                    <td className="py-2">Proyecto Principal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Cargando información del proyecto...</p>
        )}
      </div>
    </div>
  )
}

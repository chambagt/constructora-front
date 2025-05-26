"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calculator, Save } from "lucide-react"
import type { Proyecto } from "@/components/nuevo-proyecto-form"

// Tipo para el Resumen Financiero
type ResumenFinanciero = {
  id: string
  proyectoId: string
  tipo: "presupuesto" | "venta"
  costoDirecto: number
  costoIndirecto: number
  utilidad: number
  impuestos: number
  total: number
  notas: string
  fecha: string
  cedulasAsociadas: string[]
}

export default function EditarRFPresupuestoPage() {
  const params = useParams()
  const router = useRouter()
  const proyectoId = params.id as string

  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [resumenFinanciero, setResumenFinanciero] = useState<ResumenFinanciero | null>(null)

  // Valores de edición
  const [costoDirecto, setCostoDirecto] = useState("0")
  const [costoIndirecto, setCostoIndirecto] = useState("0")
  const [utilidad, setUtilidad] = useState("0")
  const [impuestos, setImpuestos] = useState("0")
  const [notas, setNotas] = useState("")

  // Cargar proyecto y RF
  useEffect(() => {
    if (typeof window !== "undefined" && proyectoId) {
      // Cargar proyecto
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)
      setProyecto(proyectoEncontrado || null)

      // Cargar RF
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      const resumenEncontrado = resumenesGuardados.find(
        (r: ResumenFinanciero) => r.proyectoId === proyectoId && r.tipo === "presupuesto",
      )

      if (resumenEncontrado) {
        setResumenFinanciero(resumenEncontrado)
        setCostoDirecto(resumenEncontrado.costoDirecto.toString())
        setCostoIndirecto(resumenEncontrado.costoIndirecto.toString())
        setUtilidad(resumenEncontrado.utilidad.toString())
        setImpuestos(resumenEncontrado.impuestos.toString())
        setNotas(resumenEncontrado.notas)
      }
    }
  }, [proyectoId])

  // Calcular total
  const calcularTotal = () => {
    const cd = Number.parseFloat(costoDirecto) || 0
    const ci = Number.parseFloat(costoIndirecto) || 0
    const ut = Number.parseFloat(utilidad) || 0
    const imp = Number.parseFloat(impuestos) || 0
    return cd + ci + ut + imp
  }

  // Guardar RF
  const guardarResumenFinanciero = () => {
    const nuevoResumen: ResumenFinanciero = {
      id: resumenFinanciero?.id || `rf-${Date.now()}`,
      proyectoId,
      tipo: "presupuesto",
      costoDirecto: Number.parseFloat(costoDirecto) || 0,
      costoIndirecto: Number.parseFloat(costoIndirecto) || 0,
      utilidad: Number.parseFloat(utilidad) || 0,
      impuestos: Number.parseFloat(impuestos) || 0,
      total: calcularTotal(),
      notas,
      fecha: new Date().toISOString(),
      cedulasAsociadas: resumenFinanciero?.cedulasAsociadas || [],
    }

    if (typeof window !== "undefined") {
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")

      // Actualizar o agregar
      if (resumenFinanciero) {
        const resumenesActualizados = resumenesGuardados.map((r: ResumenFinanciero) =>
          r.id === resumenFinanciero.id ? nuevoResumen : r,
        )
        localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
      } else {
        localStorage.setItem("resumenesFinancieros", JSON.stringify([...resumenesGuardados, nuevoResumen]))
      }

      // Volver a la página del RF
      router.push(`/proyectos/${proyectoId}/presupuesto`)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/proyectos/${proyectoId}/presupuesto`)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al RF
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Editar Resumen Financiero - Presupuesto</h1>
          <p className="text-gray-500 dark:text-gray-400">{proyecto?.nombre || "Cargando..."}</p>
        </div>
      </div>

      {/* Formulario de edición */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            {resumenFinanciero ? "Editar Resumen Financiero" : "Crear Resumen Financiero"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Costo Directo (Q)</label>
                <Input
                  type="number"
                  value={costoDirecto}
                  onChange={(e) => setCostoDirecto(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Costo Indirecto (Q)</label>
                <Input
                  type="number"
                  value={costoIndirecto}
                  onChange={(e) => setCostoIndirecto(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Utilidad (Q)</label>
                <Input
                  type="number"
                  value={utilidad}
                  onChange={(e) => setUtilidad(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Impuestos (Q)</label>
                <Input
                  type="number"
                  value={impuestos}
                  onChange={(e) => setImpuestos(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notas</label>
              <Textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Notas adicionales sobre el resumen financiero"
                rows={3}
              />
            </div>
            <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-bold">Q{calcularTotal().toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={guardarResumenFinanciero}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PlusCircle, Eye, X, Search, Calculator, DollarSign, Save, Pencil } from "lucide-react"
import type { Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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

// Tipo para la cédula
type Cedula = {
  id: string
  nombre: string
  fecha: string
  elementos: any[]
  total: number
  proyecto?: string
}

export default function DetalleResumenFinancieroPage() {
  const params = useParams()
  const router = useRouter()
  const proyectoId = params.id as string
  const rfId = params.rfId as string
  const { toast } = useToast()

  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [resumenFinanciero, setResumenFinanciero] = useState<ResumenFinanciero | null>(null)
  const [cedulasAsociadas, setCedulasAsociadas] = useState<Cedula[]>([])
  const [cedulasDisponibles, setCedulasDisponibles] = useState<Cedula[]>([])
  const [mostrarSeleccionCedulas, setMostrarSeleccionCedulas] = useState(false)
  const [busquedaCedula, setBusquedaCedula] = useState("")
  const [modoEdicion, setModoEdicion] = useState(false)

  // Estados para edición
  const [editNombre, setEditNombre] = useState("")
  const [editDescripcion, setEditDescripcion] = useState("")
  const [editCostoDirecto, setEditCostoDirecto] = useState("")
  const [editCostoIndirecto, setEditCostoIndirecto] = useState("")
  const [editUtilidad, setEditUtilidad] = useState("")
  const [editImpuestos, setEditImpuestos] = useState("")
  const [editNotas, setEditNotas] = useState("")

  // Cargar proyecto, RF y cédulas
  useEffect(() => {
    if (typeof window !== "undefined" && proyectoId && rfId) {
      // Cargar proyecto
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)
      setProyecto(proyectoEncontrado || null)

      // Cargar RF
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      const resumenEncontrado = resumenesGuardados.find((r: ResumenFinanciero) => r.id === rfId)

      if (resumenEncontrado) {
        setResumenFinanciero(resumenEncontrado)

        // Inicializar estados de edición
        setEditNombre(resumenEncontrado.nombre)
        setEditDescripcion(resumenEncontrado.descripcion || "")
        setEditCostoDirecto(resumenEncontrado.costoDirecto.toString())
        setEditCostoIndirecto(resumenEncontrado.costoIndirecto.toString())
        setEditUtilidad(resumenEncontrado.utilidad.toString())
        setEditImpuestos(resumenEncontrado.impuestos.toString())
        setEditNotas(resumenEncontrado.notas || "")

        // Cargar todas las cédulas
        const todasLasCedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")

        // Obtener las cédulas asociadas al RF
        const cedulasDelRF = todasLasCedulas.filter((c: Cedula) => resumenEncontrado.cedulasAsociadas.includes(c.id))
        setCedulasAsociadas(cedulasDelRF)

        // Cédulas disponibles (no asociadas a este RF)
        const cedulasNoAsociadas = todasLasCedulas.filter(
          (c: Cedula) => !resumenEncontrado.cedulasAsociadas.includes(c.id) && c.proyecto === proyectoId,
        )
        setCedulasDisponibles(cedulasNoAsociadas)
      } else {
        // Si no se encuentra el RF, redirigir a la página de resúmenes financieros
        router.push(`/proyectos/${proyectoId}/resumenes-financieros`)
      }
    }
  }, [proyectoId, rfId, router])

  // Calcular total para la edición
  const calcularTotalEdicion = () => {
    const cd = Number.parseFloat(editCostoDirecto) || 0
    const ci = Number.parseFloat(editCostoIndirecto) || 0
    const ut = Number.parseFloat(editUtilidad) || 0
    const imp = Number.parseFloat(editImpuestos) || 0
    return cd + ci + ut + imp
  }

  // Guardar cambios en el RF
  const guardarCambios = () => {
    if (!resumenFinanciero) return

    if (!editNombre) {
      toast({
        title: "Error",
        description: "El nombre del resumen financiero es obligatorio.",
        variant: "destructive",
      })
      return
    }

    const rfActualizado: ResumenFinanciero = {
      ...resumenFinanciero,
      nombre: editNombre,
      descripcion: editDescripcion,
      costoDirecto: Number.parseFloat(editCostoDirecto) || 0,
      costoIndirecto: Number.parseFloat(editCostoIndirecto) || 0,
      utilidad: Number.parseFloat(editUtilidad) || 0,
      impuestos: Number.parseFloat(editImpuestos) || 0,
      total: calcularTotalEdicion(),
      notas: editNotas,
      fecha: new Date().toISOString(),
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      const resumenesActualizados = resumenesGuardados.map((r: ResumenFinanciero) =>
        r.id === rfId ? rfActualizado : r,
      )
      localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
    }

    // Actualizar estado
    setResumenFinanciero(rfActualizado)
    setModoEdicion(false)

    toast({
      title: "Cambios guardados",
      description: "Los cambios en el resumen financiero han sido guardados con éxito.",
    })
  }

  // Ver detalle de cédula
  const verDetalleCedula = (cedulaId: string) => {
    router.push(`/cedulas/${cedulaId}`)
  }

  // Asociar cédula al RF
  const asociarCedula = (cedula: Cedula) => {
    if (!resumenFinanciero) return

    // Actualizar la lista de cédulas asociadas
    const nuevasCedulasAsociadas = [...resumenFinanciero.cedulasAsociadas, cedula.id]

    // Actualizar RF
    const rfActualizado = {
      ...resumenFinanciero,
      cedulasAsociadas: nuevasCedulasAsociadas,
      fecha: new Date().toISOString(),
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      const resumenesActualizados = resumenesGuardados.map((r: ResumenFinanciero) =>
        r.id === resumenFinanciero.id ? rfActualizado : r,
      )
      localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
    }

    // Actualizar estado
    setResumenFinanciero(rfActualizado)
    setCedulasAsociadas([...cedulasAsociadas, cedula])
    setCedulasDisponibles(cedulasDisponibles.filter((c) => c.id !== cedula.id))

    toast({
      title: "Cédula asociada",
      description: `La cédula "${cedula.nombre}" ha sido asociada al resumen financiero.`,
    })
  }

  // Desasociar cédula del RF
  const desasociarCedula = (cedula: Cedula) => {
    if (!resumenFinanciero) return

    // Actualizar la lista de cédulas asociadas
    const nuevasCedulasAsociadas = resumenFinanciero.cedulasAsociadas.filter((id) => id !== cedula.id)

    // Actualizar RF
    const rfActualizado = {
      ...resumenFinanciero,
      cedulasAsociadas: nuevasCedulasAsociadas,
      fecha: new Date().toISOString(),
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      const resumenesActualizados = resumenesGuardados.map((r: ResumenFinanciero) =>
        r.id === resumenFinanciero.id ? rfActualizado : r,
      )
      localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
    }

    // Actualizar estado
    setResumenFinanciero(rfActualizado)
    setCedulasDisponibles([...cedulasDisponibles, cedula])
    setCedulasAsociadas(cedulasAsociadas.filter((c) => c.id !== cedula.id))

    toast({
      title: "Cédula desasociada",
      description: `La cédula "${cedula.nombre}" ha sido desasociada del resumen financiero.`,
    })
  }

  // Filtrar cédulas disponibles según búsqueda
  const cedulasFiltradas = cedulasDisponibles.filter((cedula) =>
    cedula.nombre.toLowerCase().includes(busquedaCedula.toLowerCase()),
  )

  // Crear nueva cédula (redirección a la página de creación)
  const crearNuevaCedula = () => {
    if (!resumenFinanciero) return

    // Redirigir a la página de creación de cédulas con el ID del proyecto
    router.push(`/cedulas/nueva?proyectoId=${proyectoId}`)
  }

  if (!resumenFinanciero) {
    return <div className="container mx-auto py-10">Cargando...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.push(`/proyectos/${proyectoId}/resumenes-financieros`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Resúmenes Financieros
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {resumenFinanciero.tipo === "presupuesto"
              ? "Resumen Financiero - Presupuesto"
              : "Resumen Financiero - Venta"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{proyecto?.nombre || "Cargando..."}</p>
        </div>
        <Button onClick={() => setModoEdicion(!modoEdicion)}>
          {modoEdicion ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancelar Edición
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editar RF
            </>
          )}
        </Button>
      </div>

      {/* Detalles del RF */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            {resumenFinanciero.tipo === "presupuesto" ? (
              <Calculator className="mr-2 h-5 w-5" />
            ) : (
              <DollarSign className="mr-2 h-5 w-5" />
            )}
            {modoEdicion ? "Editar Resumen Financiero" : resumenFinanciero.nombre}
          </CardTitle>
          {modoEdicion && (
            <Button onClick={guardarCambios}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {modoEdicion ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    placeholder="Nombre del resumen financiero"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Input
                    id="descripcion"
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                    placeholder="Descripción del resumen financiero"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costoDirecto">Costo Directo (Q)</Label>
                  <Input
                    id="costoDirecto"
                    type="number"
                    value={editCostoDirecto}
                    onChange={(e) => setEditCostoDirecto(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costoIndirecto">Costo Indirecto (Q)</Label>
                  <Input
                    id="costoIndirecto"
                    type="number"
                    value={editCostoIndirecto}
                    onChange={(e) => setEditCostoIndirecto(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilidad">Utilidad (Q)</Label>
                  <Input
                    id="utilidad"
                    type="number"
                    value={editUtilidad}
                    onChange={(e) => setEditUtilidad(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impuestos">Impuestos (Q)</Label>
                  <Input
                    id="impuestos"
                    type="number"
                    value={editImpuestos}
                    onChange={(e) => setEditImpuestos(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  value={editNotas}
                  onChange={(e) => setEditNotas(e.target.value)}
                  placeholder="Notas adicionales sobre el resumen financiero"
                  rows={3}
                />
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold">Q{calcularTotalEdicion().toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Información General</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                      <span className="font-medium">{resumenFinanciero.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                      <span className="font-medium capitalize">{resumenFinanciero.tipo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
                      <span className="font-medium">{new Date(resumenFinanciero.fecha).toLocaleDateString()}</span>
                    </div>
                    {resumenFinanciero.descripcion && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Descripción:</span>
                        <span className="font-medium">{resumenFinanciero.descripcion}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Resumen Financiero</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Costo Directo:</span>
                      <span className="font-medium">Q{resumenFinanciero.costoDirecto.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Costo Indirecto:</span>
                      <span className="font-medium">Q{resumenFinanciero.costoIndirecto.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Utilidad:</span>
                      <span className="font-medium">Q{resumenFinanciero.utilidad.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Impuestos:</span>
                      <span className="font-medium">Q{resumenFinanciero.impuestos.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold">TOTAL:</span>
                        <span className="font-bold">Q{resumenFinanciero.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {resumenFinanciero.notas && (
                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <h4 className="text-md font-medium mb-2">Notas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{resumenFinanciero.notas}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cédulas Asociadas */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cédulas Asociadas</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={mostrarSeleccionCedulas ? "default" : "outline"}
              onClick={() => setMostrarSeleccionCedulas(!mostrarSeleccionCedulas)}
            >
              {mostrarSeleccionCedulas ? "Ocultar" : "Asociar Cédulas"}
            </Button>
            <Button onClick={crearNuevaCedula}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nueva Cédula
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Selección de Cédulas */}
          {mostrarSeleccionCedulas && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-base">Seleccionar Cédulas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder="Buscar cédulas..."
                    value={busquedaCedula}
                    onChange={(e) => setBusquedaCedula(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {cedulasDisponibles.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-zinc-700">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Acción
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                        {cedulasFiltradas.map((cedula) => (
                          <tr key={cedula.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{cedula.nombre}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {new Date(cedula.fecha).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                              Q{cedula.total.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              <Button size="sm" onClick={() => asociarCedula(cedula)}>
                                Asociar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No hay cédulas disponibles para asociar.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Lista de Cédulas Asociadas */}
          {cedulasAsociadas.length > 0 ? (
            <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-zinc-700">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Elementos
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                  {cedulasAsociadas.map((cedula) => (
                    <tr key={cedula.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{cedula.nombre}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {new Date(cedula.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{cedula.elementos.length}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">Q{cedula.total.toFixed(2)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => verDetalleCedula(cedula.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => desasociarCedula(cedula)}>
                            <X className="h-4 w-4 mr-1" />
                            Quitar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No hay cédulas asociadas a este resumen financiero.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

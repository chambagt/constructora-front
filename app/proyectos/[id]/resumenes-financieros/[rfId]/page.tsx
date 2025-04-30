"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, Trash2, PlusCircle } from "lucide-react"
import type { Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { TablaCedulasAsociadas } from "@/components/kokonutui/tabla-cedulas-asociadas"

// Importar el nuevo componente
import { ResumenFinancieroHeader } from "@/components/kokonutui/resumen-financiero-header"

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

// Tipo para los elementos detallados
type ElementoDetallado = {
  id: string
  cedulaId: string
  cedulaNombre: string
  meta: string
  renglon: string
  actividad: string
  unidad: string
  cantidad: number
  costoDirecto: number
  porcentajeInp: number
  montoInp: number
  porcentajeFactInt: number
  montoIndirUtilidad: number
  total: number
  precioUnitario: number
  porcentaje: number
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
  const [elementosDetallados, setElementosDetallados] = useState<ElementoDetallado[]>([])
  const [cedulasDisponibles, setCedulasDisponibles] = useState<Cedula[]>([])
  const [mostrarSeleccionCedulas, setMostrarSeleccionCedulas] = useState(false)
  const [busquedaCedula, setBusquedaCedula] = useState("")
  const [modoEdicion, setModoEdicion] = useState(false)

  // Estados para edición
  const [editNombre, setEditNombre] = useState("")
  const [editDescripcion, setEditDescripcion] = useState("")

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

        // Cargar todas las cédulas
        const todasLasCedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")

        // Obtener las cédulas asociadas al RF
        const cedulasDelRF = todasLasCedulas.filter((c: Cedula) => resumenEncontrado.cedulasAsociadas.includes(c.id))

        // Crear elementos detallados para cada cédula
        const elementos: ElementoDetallado[] = []
        cedulasDelRF.forEach((cedula: Cedula) => {
          // Crear un elemento detallado para cada cédula
          elementos.push({
            id: `elem-${cedula.id}`,
            cedulaId: cedula.id,
            cedulaNombre: cedula.nombre,
            meta: `Meta-${cedula.id.substring(0, 3)}`,
            renglon: `R-${cedula.id.substring(0, 4)}`,
            actividad: cedula.nombre || "Actividad de construcción",
            unidad: "m²",
            cantidad: 100,
            costoDirecto: (cedula.total || 0) * 0.7,
            porcentajeInp: 12,
            montoInp: (cedula.total || 0) * 0.12,
            porcentajeFactInt: 15,
            montoIndirUtilidad: (cedula.total || 0) * 0.15,
            total: cedula.total || 0,
            precioUnitario: (cedula.total || 0) / 100,
            porcentaje: 100,
          })
        })

        setCedulasAsociadas(cedulasDelRF)
        setElementosDetallados(elementos)

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

    // Crear elemento detallado para la cédula
    const nuevoElemento: ElementoDetallado = {
      id: `elem-${cedula.id}`,
      cedulaId: cedula.id,
      cedulaNombre: cedula.nombre,
      meta: `Meta-${cedula.id.substring(0, 3)}`,
      renglon: `R-${cedula.id.substring(0, 4)}`,
      actividad: cedula.nombre || "Actividad de construcción",
      unidad: "m²",
      cantidad: 100,
      costoDirecto: (cedula.total || 0) * 0.7,
      porcentajeInp: 12,
      montoInp: (cedula.total || 0) * 0.12,
      porcentajeFactInt: 15,
      montoIndirUtilidad: (cedula.total || 0) * 0.15,
      total: cedula.total || 0,
      precioUnitario: (cedula.total || 0) / 100,
      porcentaje: 100,
    }

    // Actualizar estado
    setResumenFinanciero(rfActualizado)
    setCedulasAsociadas([...cedulasAsociadas, cedula])
    setElementosDetallados([...elementosDetallados, nuevoElemento])
    setCedulasDisponibles(cedulasDisponibles.filter((c) => c.id !== cedula.id))

    toast({
      title: "Cédula asociada",
      description: `La cédula "${cedula.nombre}" ha sido asociada al resumen financiero.`,
    })
  }

  // Desasociar cédula del RF
  const desasociarCedula = (cedulaId: string) => {
    if (!resumenFinanciero) return

    // Encontrar la cédula
    const cedula = cedulasAsociadas.find((c) => c.id === cedulaId)
    if (!cedula) return

    // Actualizar la lista de cédulas asociadas
    const nuevasCedulasAsociadas = resumenFinanciero.cedulasAsociadas.filter((id) => id !== cedulaId)

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

    // Eliminar elementos asociados a esta cédula
    const elementosActualizados = elementosDetallados.filter((elemento) => elemento.cedulaId !== cedulaId)

    // Actualizar estado
    setResumenFinanciero(rfActualizado)
    setCedulasDisponibles([...cedulasDisponibles, cedula])
    setCedulasAsociadas(cedulasAsociadas.filter((c) => c.id !== cedulaId))
    setElementosDetallados(elementosActualizados)

    toast({
      title: "Cédula desasociada",
      description: `La cédula "${cedula.nombre}" ha sido desasociada del resumen financiero.`,
    })
  }

  // Filtrar cédulas disponibles según búsqueda
  const cedulasFiltradas = cedulasDisponibles.filter((cedula) =>
    cedula.nombre.toLowerCase().includes(busquedaCedula.toLowerCase()),
  )

  // Función para crear una nueva cédula directamente
  const crearNuevaCedula = () => {
    if (!resumenFinanciero) return

    try {
      // Crear un ID único para la nueva cédula
      const cedulaId = Date.now().toString()

      // Crear una nueva cédula en blanco
      const nuevaCedula = {
        id: cedulaId,
        nombre: "Nueva Cédula",
        fecha: new Date().toISOString(),
        elementos: [],
        total: 0,
        proyecto: proyectoId,
      }

      // Guardar la nueva cédula en localStorage
      if (typeof window !== "undefined") {
        const cedulasGuardadas = JSON.parse(localStorage.getItem("cedulas") || "[]")
        cedulasGuardadas.push(nuevaCedula)
        localStorage.setItem("cedulas", JSON.stringify(cedulasGuardadas))

        // Notificar al usuario
        toast({
          title: "Cédula creada",
          description: "Se ha creado una nueva cédula. Ahora serás redirigido para editarla.",
        })

        // Redirigir a la página de edición de la cédula
        router.push(`/cedulas/${cedulaId}`)
      }
    } catch (error) {
      console.error("Error al crear la cédula:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al crear la cédula. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Eliminar RF
  const eliminarRF = () => {
    if (!resumenFinanciero) return

    // Eliminar de localStorage
    if (typeof window !== "undefined") {
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      const resumenesActualizados = resumenesGuardados.filter((r: ResumenFinanciero) => r.id !== rfId)
      localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
    }

    // Redirigir a la página de resúmenes financieros
    router.push(`/proyectos/${proyectoId}/resumenes-financieros`)

    toast({
      title: "Resumen financiero eliminado",
      description: "El resumen financiero ha sido eliminado con éxito.",
    })
  }

  if (!resumenFinanciero) {
    return <div className="container mx-auto py-10">Cargando...</div>
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => router.push(`/proyectos/${proyectoId}/resumenes-financieros`)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Proyecto
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Resumen Financiero (RF) - {resumenFinanciero.tipo === "presupuesto" ? "Presupuesto" : "Venta"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{proyecto?.nombre || "Cargando..."}</p>
          </div>
        </div>
        <Button variant="destructive" onClick={eliminarRF}>
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar RF
        </Button>
      </div>

      {/* Detalles del RF */}
      {resumenFinanciero && (
        <ResumenFinancieroHeader
          nombre={resumenFinanciero.nombre}
          tipo={resumenFinanciero.tipo === "presupuesto" ? "Presupuesto" : "Venta"}
          fecha={new Date(resumenFinanciero.fecha).toLocaleDateString()}
          onEdit={() => setModoEdicion(!modoEdicion)}
        />
      )}

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
              Crear Cédula
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
                          <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Acción
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                        {cedulasFiltradas.map((cedula) => (
                          <tr key={cedula.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                            <td className="px-2 py-1 whitespace-nowrap text-xs">{cedula.nombre}</td>
                            <td className="px-2 py-1 whitespace-nowrap text-xs">
                              {new Date(cedula.fecha).toLocaleDateString()}
                            </td>
                            <td className="px-2 py-1 whitespace-nowrap text-xs font-medium">
                              Q{(cedula.total || 0).toFixed(2)}
                            </td>
                            <td className="px-2 py-1 whitespace-nowrap text-xs">
                              <Button size="xs" onClick={() => asociarCedula(cedula)}>
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

          {/* Usar el componente TablaCedulasAsociadas para mostrar los campos detallados */}
          <TablaCedulasAsociadas
            elementosDetallados={elementosDetallados}
            onVerDetalle={verDetalleCedula}
            onDesasociar={desasociarCedula}
          />
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, PlusCircle, FileText, Pencil, Eye, X, FolderPlus, FolderTree, Database } from "lucide-react"
import type { Proyecto } from "@/components/nuevo-proyecto-form"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  familias?: Familia[]
}

// Tipo para la cédula
type Cedula = {
  id: string
  nombre: string
  fecha: string
  elementos: any[]
  total: number
  proyecto?: string
  familiaId?: string
  subfamiliaId?: string
}

// Tipo para Familia
type Familia = {
  id: string
  nombre: string
  orden: number
  subfamilias: Subfamilia[]
}

// Tipo para Subfamilia
type Subfamilia = {
  id: string
  familiaId: string
  nombre: string
  orden: number
}

// Tipo para ElementoDetallado
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
  familiaId?: string
  subfamiliaId?: string
}

// Tipo para elementos de la base de datos
type ElementoDB = {
  id: string
  nombre: string
  familia: string
  unidad: string
  precio: number
  cantidadTotal: number
  costoTotal: number
  cedulasUsadas: string[]
  descripcion?: string
}

export default function DetalleResumenFinancieroPage() {
  const params = useParams()
  const router = useRouter()
  const proyectoId = params.id as string
  const rfId = params.rfId as string
  const { toast } = useToast()

  // Estados iniciales
  const [isLoading, setIsLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [resumenFinanciero, setResumenFinanciero] = useState<ResumenFinanciero | null>(null)
  const [cedulasAsociadas, setCedulasAsociadas] = useState<Cedula[]>([])
  const [cedulasDisponibles, setCedulasDisponibles] = useState<Cedula[]>([])
  const [elementosDetallados, setElementosDetallados] = useState<ElementoDetallado[]>([])
  const [familias, setFamilias] = useState<Familia[]>([])

  // Estados de UI
  const [mostrarSeleccionCedulas, setMostrarSeleccionCedulas] = useState(false)
  const [busquedaCedula, setBusquedaCedula] = useState("")
  const [modoEdicion, setModoEdicion] = useState(false)
  const [editNombre, setEditNombre] = useState("")
  const [editDescripcion, setEditDescripcion] = useState("")

  // Estados para diálogos
  const [dialogoFamiliaAbierto, setDialogoFamiliaAbierto] = useState(false)
  const [dialogoSubfamiliaAbierto, setDialogoSubfamiliaAbierto] = useState(false)
  const [nuevaFamilia, setNuevaFamilia] = useState("")
  const [nuevaSubfamilia, setNuevaSubfamilia] = useState("")
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState<string | null>(null)

  // Estado para diálogo de asignación de familia/subfamilia
  const [dialogoAsignarAbierto, setDialogoAsignarAbierto] = useState(false)
  const [cedulaParaAsignar, setCedulaParaAsignar] = useState<string | null>(null)
  const [familiaParaAsignar, setFamiliaParaAsignar] = useState<string | null>(null)
  const [subfamiliaParaAsignar, setSubfamiliaParaAsignar] = useState<string | null>(null)

  // Estados para la base de datos
  const [dialogoDBAbiert, setDialogoDBAbiert] = useState(false)
  const [elementosDB, setElementosDB] = useState<{
    materiales: ElementoDB[]
    equipamiento: ElementoDB[]
    manoDeObra: ElementoDB[]
  }>({
    materiales: [],
    equipamiento: [],
    manoDeObra: [],
  })
  const [busquedaDB, setBusquedaDB] = useState("")

  // Función para formatear moneda en Quetzales
  const formatQuetzales = (value: number): string => {
    return `Q${value.toLocaleString("es-GT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`
  }

  // Función para extraer elementos de las cédulas y organizarlos por tipo
  const extraerElementosDB = () => {
    const materiales: ElementoDB[] = []
    const equipamiento: ElementoDB[] = []
    const manoDeObra: ElementoDB[] = []

    // Obtener todos los elementos de todas las cédulas asociadas
    cedulasAsociadas.forEach((cedula) => {
      if (cedula.elementos && cedula.elementos.length > 0) {
        cedula.elementos.forEach((elemento) => {
          // Determinar el tipo basado en la familia del elemento
          let tipoElemento = ""
          if (elemento.familia === "MT" || elemento.familia === "Materiales") {
            tipoElemento = "materiales"
          } else if (elemento.familia === "EQ" || elemento.familia === "Equipamiento") {
            tipoElemento = "equipamiento"
          } else if (elemento.familia === "MO" || elemento.familia === "Mano de Obra") {
            tipoElemento = "manoDeObra"
          }

          if (tipoElemento) {
            const elementoExistente =
              tipoElemento === "materiales"
                ? materiales.find((m) => m.nombre === elemento.nombre)
                : tipoElemento === "equipamiento"
                  ? equipamiento.find((e) => e.nombre === elemento.nombre)
                  : manoDeObra.find((mo) => mo.nombre === elemento.nombre)

            if (elementoExistente) {
              // Si ya existe, sumar cantidades y costos
              elementoExistente.cantidadTotal += elemento.cantidad || 0
              elementoExistente.costoTotal += elemento.costoGlobal || 0
              if (!elementoExistente.cedulasUsadas.includes(cedula.id)) {
                elementoExistente.cedulasUsadas.push(cedula.id)
              }
            } else {
              // Si no existe, crear nuevo elemento
              const nuevoElemento: ElementoDB = {
                id: `${tipoElemento}-${elemento.id || Date.now()}`,
                nombre: elemento.nombre || "Sin nombre",
                familia: elemento.familia || tipoElemento.toUpperCase(),
                unidad: elemento.unidad || "u",
                precio: elemento.costoUnitario || 0,
                cantidadTotal: elemento.cantidad || 0,
                costoTotal: elemento.costoGlobal || 0,
                cedulasUsadas: [cedula.id],
                descripcion: elemento.descripcion || "",
              }

              if (tipoElemento === "materiales") {
                materiales.push(nuevoElemento)
              } else if (tipoElemento === "equipamiento") {
                equipamiento.push(nuevoElemento)
              } else {
                manoDeObra.push(nuevoElemento)
              }
            }
          }
        })
      }
    })

    setElementosDB({
      materiales: materiales.sort((a, b) => a.nombre.localeCompare(b.nombre)),
      equipamiento: equipamiento.sort((a, b) => a.nombre.localeCompare(b.nombre)),
      manoDeObra: manoDeObra.sort((a, b) => a.nombre.localeCompare(b.nombre)),
    })
  }

  // Cargar datos iniciales - solo una vez al montar el componente
  useEffect(() => {
    // Skip if already loaded
    if (dataLoaded) return

    // Modificar la función loadData para extraer datos reales de las cédulas
    const loadData = () => {
      try {
        if (typeof window === "undefined") return

        setIsLoading(true)

        // Cargar proyecto
        const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
        const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)

        // Cargar RF
        const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
        const resumenEncontrado = resumenesGuardados.find((r: ResumenFinanciero) => r.id === rfId)

        if (!resumenEncontrado) {
          router.push(`/proyectos/${proyectoId}/resumenes-financieros`)
          return
        }

        // Inicializar estados de edición
        setEditNombre(resumenEncontrado.nombre)
        setEditDescripcion(resumenEncontrado.descripcion || "")

        // Cargar todas las cédulas
        const todasLasCedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")

        // Asegurarse de que cedulasAsociadas sea un array
        const cedulasAsociadasIds = resumenEncontrado.cedulasAsociadas || []

        // Obtener las cédulas asociadas al RF
        const cedulasDelRF = todasLasCedulas.filter((c: Cedula) => cedulasAsociadasIds.includes(c.id))

        // Cargar o inicializar familias
        const familiasExistentes = resumenEncontrado.familias || []
        setFamilias(familiasExistentes)

        // Crear elementos detallados para cada cédula con datos reales
        let elementos: ElementoDetallado[] = []
        if (cedulasDelRF.length > 0) {
          elementos = cedulasDelRF.map((cedula: Cedula) => {
            // Extraer el primer elemento de la cédula para mostrar sus datos
            // o usar valores por defecto si no hay elementos
            const primerElemento = cedula.elementos && cedula.elementos.length > 0 ? cedula.elementos[0] : null

            return {
              id: `elem-${cedula.id}`,
              cedulaId: cedula.id,
              cedulaNombre: cedula.nombre || "Sin nombre",
              meta: primerElemento?.meta || "Sin meta",
              renglon: primerElemento?.renglon || "Sin renglón",
              actividad: cedula.nombre || "Sin actividad",
              unidad: primerElemento?.unidad || "u",
              cantidad: primerElemento?.cantidad || 0,
              costoDirecto: cedula.total || 0,
              porcentajeInp: 12, // Valores por defecto que pueden ajustarse según necesidad
              montoInp: (cedula.total || 0) * 0.12,
              porcentajeFactInt: 15,
              montoIndirUtilidad: (cedula.total || 0) * 0.15,
              total: (cedula.total || 0) * 1.27, // Total con impuestos e indirectos
              precioUnitario: primerElemento?.cantidad ? ((cedula.total || 0) * 1.27) / primerElemento.cantidad : 0,
              porcentaje: 100,
              familiaId: cedula.familiaId,
              subfamiliaId: cedula.subfamiliaId,
            }
          })
        }

        // Cédulas disponibles (no asociadas a este RF)
        // Incluir cédulas que pertenezcan al proyecto o que no tengan proyecto asignado
        const cedulasNoAsociadas = todasLasCedulas.filter((c: Cedula) => {
          // No incluir cédulas ya asociadas a este RF
          if (cedulasAsociadasIds.includes(c.id)) {
            return false
          }

          // Incluir cédulas que:
          // 1. Tienen el proyecto asignado correctamente
          // 2. No tienen proyecto asignado (cédulas creadas sin proyecto específico)
          // 3. Tienen el proyecto como string igual al proyectoId
          return (
            c.proyecto === proyectoId || !c.proyecto || c.proyecto === "" || String(c.proyecto) === String(proyectoId)
          )
        })

        console.log("Todas las cédulas:", todasLasCedulas)
        console.log("Cédulas asociadas IDs:", cedulasAsociadasIds)
        console.log("Cédulas no asociadas filtradas:", cedulasNoAsociadas)
        console.log("Proyecto ID:", proyectoId)

        // Actualizar estados
        setProyecto(proyectoEncontrado || null)
        setResumenFinanciero(resumenEncontrado)
        setCedulasAsociadas(cedulasDelRF)
        setElementosDetallados(elementos)
        setCedulasDisponibles(cedulasNoAsociadas)
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
  }, [proyectoId, rfId, router, toast, dataLoaded])

  // Extraer elementos de la DB cuando cambien las cédulas asociadas
  useEffect(() => {
    if (cedulasAsociadas.length > 0) {
      extraerElementosDB()
    }
  }, [cedulasAsociadas])

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

    try {
      const rfActualizado = {
        ...resumenFinanciero,
        nombre: editNombre,
        descripcion: editDescripcion,
        fecha: new Date().toISOString(),
        familias: familias,
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
    } catch (error) {
      console.error("Error al guardar cambios:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al guardar los cambios. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Ver detalle de cédula
  const verDetalleCedula = (cedulaId: string) => {
    router.push(`/cedulas/${cedulaId}`)
  }

  // Asociar cédula al RF
  const asociarCedula = (cedula: Cedula) => {
    if (!resumenFinanciero) return

    try {
      // Asegurarse de que cedulasAsociadas sea un array
      const cedulasActuales = resumenFinanciero.cedulasAsociadas || []

      // Actualizar la lista de cédulas asociadas
      const nuevasCedulasAsociadas = [...cedulasActuales, cedula.id]

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

      // Extraer el primer elemento de la cédula para mostrar sus datos
      const primerElemento = cedula.elementos && cedula.elementos.length > 0 ? cedula.elementos[0] : null

      // Crear elemento detallado para la cédula con datos reales
      const nuevoElemento: ElementoDetallado = {
        id: `elem-${cedula.id}`,
        cedulaId: cedula.id,
        cedulaNombre: cedula.nombre || "Sin nombre",
        meta: primerElemento?.meta || "Sin meta",
        renglon: primerElemento?.renglon || "Sin renglón",
        actividad: cedula.nombre || "Sin actividad",
        unidad: primerElemento?.unidad || "u",
        cantidad: primerElemento?.cantidad || 0,
        costoDirecto: cedula.total || 0,
        porcentajeInp: 12,
        montoInp: (cedula.total || 0) * 0.12,
        porcentajeFactInt: 15,
        montoIndirUtilidad: (cedula.total || 0) * 0.15,
        total: (cedula.total || 0) * 1.27,
        precioUnitario: primerElemento?.cantidad ? ((cedula.total || 0) * 1.27) / primerElemento.cantidad : 0,
        porcentaje: 100,
        familiaId: cedula.familiaId,
        subfamiliaId: cedula.subfamiliaId,
      }

      // Actualizar estados
      setResumenFinanciero(rfActualizado)
      setCedulasAsociadas([...cedulasAsociadas, cedula])
      setElementosDetallados([...elementosDetallados, nuevoElemento])
      setCedulasDisponibles(cedulasDisponibles.filter((c) => c.id !== cedula.id))

      toast({
        title: "Cédula asociada",
        description: `La cédula "${cedula.nombre}" ha sido asociada al resumen financiero.`,
      })
    } catch (error) {
      console.error("Error al asociar cédula:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al asociar la cédula. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Desasociar cédula del RF
  const desasociarCedula = (cedulaId: string) => {
    if (!resumenFinanciero) return

    try {
      // Encontrar la cédula
      const cedula = cedulasAsociadas.find((c) => c.id === cedulaId)
      if (!cedula) return

      // Asegurarse de que cedulasAsociadas sea un array
      const cedulasActuales = resumenFinanciero.cedulasAsociadas || []

      // Actualizar la lista de cédulas asociadas
      const nuevasCedulasAsociadas = cedulasActuales.filter((id) => id !== cedulaId)

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

      // Actualizar estados
      setResumenFinanciero(rfActualizado)
      setCedulasDisponibles([...cedulasDisponibles, cedula])
      setCedulasAsociadas(cedulasAsociadas.filter((c) => c.id !== cedulaId))
      setElementosDetallados(elementosActualizados)

      toast({
        title: "Cédula desasociada",
        description: `La cédula "${cedula.nombre}" ha sido desasociada del resumen financiero.`,
      })
    } catch (error) {
      console.error("Error al desasociar cédula:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al desasociar la cédula. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Crear una nueva cédula
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

  // Crear nueva familia
  const crearFamilia = () => {
    if (!nuevaFamilia.trim() || !resumenFinanciero) return

    try {
      const familiaId = `fam-${Date.now()}`
      const nuevaFamiliaObj: Familia = {
        id: familiaId,
        nombre: nuevaFamilia,
        orden: familias.length + 1,
        subfamilias: [],
      }

      const familiasActualizadas = [...familias, nuevaFamiliaObj]

      // Actualizar estado local
      setFamilias(familiasActualizadas)

      // Actualizar en el resumen financiero
      const rfActualizado = {
        ...resumenFinanciero,
        familias: familiasActualizadas,
      }

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
        const resumenesActualizados = resumenesGuardados.map((r: ResumenFinanciero) =>
          r.id === rfId ? rfActualizado : r,
        )
        localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
      }

      setResumenFinanciero(rfActualizado)
      setNuevaFamilia("")
      setDialogoFamiliaAbierto(false)

      toast({
        title: "Familia creada",
        description: `La familia "${nuevaFamilia}" ha sido creada con éxito.`,
      })
    } catch (error) {
      console.error("Error al crear familia:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al crear la familia. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Crear nueva subfamilia
  const crearSubfamilia = () => {
    if (!nuevaSubfamilia.trim() || !familiaSeleccionada || !resumenFinanciero) return

    try {
      const subfamiliaId = `subfam-${Date.now()}`
      const nuevaSubfamiliaObj: Subfamilia = {
        id: subfamiliaId,
        familiaId: familiaSeleccionada,
        nombre: nuevaSubfamilia,
        orden: familias.find((f) => f.id === familiaSeleccionada)?.subfamilias.length || 0 + 1,
      }

      // Actualizar familias
      const familiasActualizadas = familias.map((familia) => {
        if (familia.id === familiaSeleccionada) {
          return {
            ...familia,
            subfamilias: [...familia.subfamilias, nuevaSubfamiliaObj],
          }
        }
        return familia
      })

      // Actualizar estado local
      setFamilias(familiasActualizadas)

      // Actualizar en el resumen financiero
      const rfActualizado = {
        ...resumenFinanciero,
        familias: familiasActualizadas,
      }

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
        const resumenesActualizados = resumenesGuardados.map((r: ResumenFinanciero) =>
          r.id === rfId ? rfActualizado : r,
        )
        localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
      }

      setResumenFinanciero(rfActualizado)
      setNuevaSubfamilia("")
      setFamiliaSeleccionada(null)
      setDialogoSubfamiliaAbierto(false)

      toast({
        title: "Subfamilia creada",
        description: `La subfamilia "${nuevaSubfamilia}" ha sido creada con éxito.`,
      })
    } catch (error) {
      console.error("Error al crear subfamilia:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al crear la subfamilia. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Asignar cédula a familia/subfamilia
  const asignarCedulaAFamilia = () => {
    if (!cedulaParaAsignar || !resumenFinanciero) return

    try {
      // Actualizar la cédula con la familia/subfamilia asignada
      const cedulasActualizadas = cedulasAsociadas.map((cedula) => {
        if (cedula.id === cedulaParaAsignar) {
          return {
            ...cedula,
            familiaId: familiaParaAsignar || undefined,
            subfamiliaId: subfamiliaParaAsignar || undefined,
          }
        }
        return cedula
      })

      // Actualizar elementos detallados
      const elementosActualizados = elementosDetallados.map((elemento) => {
        if (elemento.cedulaId === cedulaParaAsignar) {
          return {
            ...elemento,
            familiaId: familiaParaAsignar || undefined,
            subfamiliaId: subfamiliaParaAsignar || undefined,
          }
        }
        return elemento
      })

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        const todasLasCedulas = JSON.parse(localStorage.getItem("cedulas") || "[]")
        const cedulasGuardadasActualizadas = todasLasCedulas.map((c: Cedula) => {
          if (c.id === cedulaParaAsignar) {
            return {
              ...c,
              familiaId: familiaParaAsignar || undefined,
              subfamiliaId: subfamiliaParaAsignar || undefined,
            }
          }
          return c
        })
        localStorage.setItem("cedulas", JSON.stringify(cedulasGuardadasActualizadas))
      }

      // Actualizar estados
      setCedulasAsociadas(cedulasActualizadas)
      setElementosDetallados(elementosActualizados)
      setDialogoAsignarAbierto(false)
      setCedulaParaAsignar(null)
      setFamiliaParaAsignar(null)
      setSubfamiliaParaAsignar(null)

      toast({
        title: "Cédula asignada",
        description: "La cédula ha sido asignada a la familia/subfamilia seleccionada.",
      })
    } catch (error) {
      console.error("Error al asignar cédula:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al asignar la cédula. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Abrir diálogo para asignar cédula a familia/subfamilia
  const abrirDialogoAsignar = (cedulaId: string) => {
    setCedulaParaAsignar(cedulaId)
    setDialogoAsignarAbierto(true)
  }

  // Filtrar cédulas disponibles según búsqueda
  const cedulasFiltradas = cedulasDisponibles.filter((cedula) =>
    cedula.nombre.toLowerCase().includes(busquedaCedula.toLowerCase()),
  )

  // Filtrar elementos de la DB según búsqueda
  const filtrarElementosDB = (elementos: ElementoDB[]) => {
    if (!busquedaDB) return elementos
    return elementos.filter(
      (elemento) =>
        elemento.nombre.toLowerCase().includes(busquedaDB.toLowerCase()) ||
        elemento.descripcion?.toLowerCase().includes(busquedaDB.toLowerCase()),
    )
  }

  // Agrupar elementos por familia y subfamilia
  const elementosAgrupados = () => {
    // Elementos sin familia
    const sinFamilia = elementosDetallados.filter((elem) => !elem.familiaId)
    const totalSinFamilia = sinFamilia.reduce((sum, elem) => sum + elem.total, 0)

    // Elementos agrupados por familia y subfamilia
    const agrupados: Record<string, any> = {}

    // Agrupar por familia
    familias.forEach((familia) => {
      // Elementos directamente en la familia (sin subfamilia)
      const elementosFamilia = elementosDetallados.filter((elem) => elem.familiaId === familia.id && !elem.subfamiliaId)
      const totalElementosFamilia = elementosFamilia.reduce((sum, elem) => sum + elem.total, 0)

      // Elementos por subfamilia
      const subfamiliasConElementos = familia.subfamilias.map((subfamilia) => {
        const elementosSubfamilia = elementosDetallados.filter((elem) => elem.subfamiliaId === subfamilia.id)
        const totalSubfamilia = elementosSubfamilia.reduce((sum, elem) => sum + elem.total, 0)
        return {
          ...subfamilia,
          elementos: elementosSubfamilia,
          total: totalSubfamilia,
        }
      })

      // Calcular total de la familia (elementos directos + subfamilias)
      const totalSubfamilias = subfamiliasConElementos.reduce((sum, subfam) => sum + subfam.total, 0)
      const totalFamilia = totalElementosFamilia + totalSubfamilias

      agrupados[familia.id] = {
        familia,
        elementosFamilia,
        totalElementosFamilia,
        subfamilias: subfamiliasConElementos,
        totalFamilia,
      }
    })

    return { sinFamilia, totalSinFamilia, agrupados }
  }

  if (isLoading) {
    return <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">Cargando...</div>
  }

  if (!resumenFinanciero) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
        Resumen financiero no encontrado
      </div>
    )
  }

  const { sinFamilia, totalSinFamilia, agrupados } = elementosAgrupados()

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Header with back arrow and summary box side by side */}
      <div className="p-4">
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/proyectos/${proyectoId}/resumenes-financieros`)}
            className="text-zinc-400 hover:text-white p-2 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Summary box */}
          <div className="flex-1 bg-zinc-900 rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Resumen Financiero</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDialogoDBAbiert(true)}
                  className="h-7 px-2 text-white hover:bg-zinc-800"
                >
                  <Database className="h-3.5 w-3.5 mr-1" />
                  DB
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDialogoFamiliaAbierto(true)}
                  className="h-7 px-2 text-white hover:bg-zinc-800"
                >
                  <FolderPlus className="h-3.5 w-3.5 mr-1" />
                  Crear Familia
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDialogoSubfamiliaAbierto(true)}
                  className="h-7 px-2 text-white hover:bg-zinc-800"
                >
                  <FolderTree className="h-3.5 w-3.5 mr-1" />
                  Crear Subfamilia
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setModoEdicion(!modoEdicion)}
                  className="h-7 px-2 text-white hover:bg-zinc-800"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Editar RF
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
              <div>
                <span className="text-gray-400">Nombre:</span>
                <span className="ml-1 font-medium">
                  {resumenFinanciero.nombre} - {proyecto?.nombre || ""}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Tipo:</span>
                <span className="ml-1 font-medium capitalize">
                  {resumenFinanciero.tipo === "presupuesto" ? "Presupuesto" : "Venta"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Fecha:</span>
                <span className="ml-1 font-medium">{new Date(resumenFinanciero.fecha).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cédulas Asociadas */}
      <div className="px-4 pb-4">
        <div className="bg-zinc-900 rounded-md p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Cédulas Asociadas</h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setMostrarSeleccionCedulas(!mostrarSeleccionCedulas)}
                className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
              >
                Asociar Cédulas
              </Button>
              <Button onClick={crearNuevaCedula} className="bg-white text-black hover:bg-gray-200">
                <PlusCircle className="h-4 w-4 mr-2" />
                Crear Cédula
              </Button>
            </div>
          </div>

          {/* Tabla de cédulas asociadas */}
          <div className="overflow-x-auto">
            {elementosDetallados.length > 0 ? (
              <div>
                {/* Elementos sin familia */}
                {sinFamilia.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-gray-400 flex justify-between items-center">
                      <span>Sin clasificar</span>
                      <span className="text-white">{formatQuetzales(totalSinFamilia)}</span>
                    </h3>
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-gray-400 border-b border-zinc-700">
                          <th className="text-left py-2 px-2">META</th>
                          <th className="text-left py-2 px-2">RENGLÓN</th>
                          <th className="text-left py-2 px-2">ACTIVIDAD</th>
                          <th className="text-left py-2 px-2">UNID</th>
                          <th className="text-left py-2 px-2">CANT</th>
                          <th className="text-left py-2 px-2">COSTO DIRECTO</th>
                          <th className="text-left py-2 px-2">%INP</th>
                          <th className="text-left py-2 px-2">Q. INP</th>
                          <th className="text-left py-2 px-2">%FACT INT</th>
                          <th className="text-left py-2 px-2">Q INDIR/UTILI</th>
                          <th className="text-left py-2 px-2">TOTAL</th>
                          <th className="text-left py-2 px-2">P/U</th>
                          <th className="text-left py-2 px-2">%</th>
                          <th className="text-left py-2 px-2">ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sinFamilia.map((elemento) => (
                          <tr key={elemento.id} className="text-xs border-b border-zinc-800 hover:bg-zinc-800">
                            <td className="py-2 px-2">{elemento.meta}</td>
                            <td className="py-2 px-2">{elemento.renglon}</td>
                            <td className="py-2 px-2">{elemento.actividad}</td>
                            <td className="py-2 px-2">{elemento.unidad}</td>
                            <td className="py-2 px-2">{elemento.cantidad}</td>
                            <td className="py-2 px-2">{formatQuetzales(elemento.costoDirecto)}</td>
                            <td className="py-2 px-2">{elemento.porcentajeInp}%</td>
                            <td className="py-2 px-2">{formatQuetzales(elemento.montoInp)}</td>
                            <td className="py-2 px-2">{elemento.porcentajeFactInt}%</td>
                            <td className="py-2 px-2">{formatQuetzales(elemento.montoIndirUtilidad)}</td>
                            <td className="py-2 px-2 font-medium">{formatQuetzales(elemento.total)}</td>
                            <td className="py-2 px-2">{formatQuetzales(elemento.precioUnitario)}</td>
                            <td className="py-2 px-2">{elemento.porcentaje}%</td>
                            <td className="py-2 px-2">
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => abrirDialogoAsignar(elemento.cedulaId)}
                                  className="h-6 w-6 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700"
                                  title="Asignar a familia"
                                >
                                  <FolderPlus className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => verDetalleCedula(elemento.cedulaId)}
                                  className="h-6 w-6 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700"
                                  title="Ver detalle"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => desasociarCedula(elemento.cedulaId)}
                                  className="h-6 w-6 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700"
                                  title="Desasociar"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Elementos agrupados por familia */}
                {Object.values(agrupados).map((grupo: any) => (
                  <div key={grupo.familia.id} className="mb-6">
                    {/* Encabezado de familia */}
                    <h3 className="text-sm font-medium mb-2 bg-blue-900 p-2 rounded flex justify-between items-center">
                      <span>
                        {grupo.familia.orden}. {grupo.familia.nombre}
                      </span>
                      <span>{formatQuetzales(grupo.totalFamilia)}</span>
                    </h3>

                    {/* Elementos directamente en la familia */}
                    {grupo.elementosFamilia.length > 0 && (
                      <table className="w-full mb-4">
                        <thead>
                          <tr className="text-xs text-gray-400 border-b border-zinc-700">
                            <th className="text-left py-2 px-2">META</th>
                            <th className="text-left py-2 px-2">RENGLÓN</th>
                            <th className="text-left py-2 px-2">ACTIVIDAD</th>
                            <th className="text-left py-2 px-2">UNID</th>
                            <th className="text-left py-2 px-2">CANT</th>
                            <th className="text-left py-2 px-2">COSTO DIRECTO</th>
                            <th className="text-left py-2 px-2">%INP</th>
                            <th className="text-left py-2 px-2">Q. INP</th>
                            <th className="text-left py-2 px-2">%FACT INT</th>
                            <th className="text-left py-2 px-2">Q INDIR/UTILI</th>
                            <th className="text-left py-2 px-2">TOTAL</th>
                            <th className="text-left py-2 px-2">P/U</th>
                            <th className="text-left py-2 px-2">%</th>
                            <th className="text-left py-2 px-2">ACCIONES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grupo.elementosFamilia.map((elemento: ElementoDetallado) => (
                            <tr key={elemento.id} className="text-xs border-b border-zinc-800 hover:bg-zinc-800">
                              <td className="py-2 px-2">{elemento.meta}</td>
                              <td className="py-2 px-2">{elemento.renglon}</td>
                              <td className="py-2 px-2">{elemento.actividad}</td>
                              <td className="py-2 px-2">{elemento.unidad}</td>
                              <td className="py-2 px-2">{elemento.cantidad}</td>
                              <td className="py-2 px-2">{formatQuetzales(elemento.costoDirecto)}</td>
                              <td className="py-2 px-2">{elemento.porcentajeInp}%</td>
                              <td className="py-2 px-2">{formatQuetzales(elemento.montoInp)}</td>
                              <td className="py-2 px-2">{elemento.porcentajeFactInt}%</td>
                              <td className="py-2 px-2">{formatQuetzales(elemento.montoIndirUtilidad)}</td>
                              <td className="py-2 px-2 font-medium">{formatQuetzales(elemento.total)}</td>
                              <td className="py-2 px-2">{formatQuetzales(elemento.precioUnitario)}</td>
                              <td className="py-2 px-2">{elemento.porcentaje}%</td>
                              <td className="py-2 px-2">
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => abrirDialogoAsignar(elemento.cedulaId)}
                                    className="h-6 w-6 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700"
                                    title="Asignar a familia"
                                  >
                                    <FolderPlus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => verDetalleCedula(elemento.cedulaId)}
                                    className="h-6 w-6 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700"
                                    title="Ver detalle"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => desasociarCedula(elemento.cedulaId)}
                                    className="h-6 w-6 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700"
                                    title="Desasociar"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* Subfamilias */}
                    {grupo.subfamilias.map(
                      (subfamilia: any) =>
                        subfamilia.elementos.length > 0 && (
                          <div key={subfamilia.id} className="ml-6 mb-4">
                            {/* Encabezado de subfamilia */}
                            <h4 className="text-xs font-medium mb-2 bg-zinc-800 p-2 rounded flex justify-between items-center">
                              <span>
                                {grupo.familia.orden}.{subfamilia.orden} {subfamilia.nombre}
                              </span>
                              <span>{formatQuetzales(subfamilia.total)}</span>
                            </h4>

                            {/* Elementos de la subfamilia */}
                            <table className="w-full">
                              <thead>
                                <tr className="text-xs text-gray-400 border-b border-zinc-700">
                                  <th className="text-left py-2 px-2">META</th>
                                  <th className="text-left py-2 px-2">RENGLÓN</th>
                                  <th className="text-left py-2 px-2">ACTIVIDAD</th>
                                  <th className="text-left py-2 px-2">UNID</th>
                                  <th className="text-left py-2 px-2">CANT</th>
                                  <th className="text-left py-2 px-2">COSTO DIRECTO</th>
                                  <th className="text-left py-2 px-2">%INP</th>
                                  <th className="text-left py-2 px-2">Q. INP</th>
                                  <th className="text-left py-2 px-2">%FACT INT</th>
                                  <th className="text-left py-2 px-2">Q INDIR/UTILI</th>
                                  <th className="text-left py-2 px-2">TOTAL</th>
                                  <th className="text-left py-2 px-2">P/U</th>
                                  <th className="text-left py-2 px-2">%</th>
                                  <th className="text-left py-2 px-2">ACCIONES</th>
                                </tr>
                              </thead>
                              <tbody>
                                {subfamilia.elementos.map((elemento: ElementoDetallado) => (
                                  <tr key={elemento.id} className="text-xs border-b border-zinc-800 hover:bg-zinc-800">
                                    <td className="py-2 px-2">{elemento.meta}</td>
                                    <td className="py-2 px-2">{elemento.renglon}</td>
                                    <td className="py-2 px-2">{elemento.actividad}</td>
                                    <td className="py-2 px-2">{elemento.unidad}</td>
                                    <td className="py-2 px-2">{elemento.cantidad}</td>
                                    <td className="py-2 px-2">{formatQuetzales(elemento.costoDirecto)}</td>
                                    <td className="py-2 px-2">{elemento.porcentajeInp}%</td>
                                    <td className="py-2 px-2">{formatQuetzales(elemento.montoInp)}</td>
                                    <td className="py-2 px-2">{elemento.porcentajeFactInt}%</td>
                                    <td className="py-2 px-2">{formatQuetzales(elemento.montoIndirUtilidad)}</td>
                                    <td className="py-2 px-2 font-medium">{formatQuetzales(elemento.total)}</td>
                                    <td className="py-2 px-2">{formatQuetzales(elemento.precioUnitario)}</td>
                                    <td className="py-2 px-2">{elemento.porcentaje}%</td>
                                    <td className="py-2 px-2">
                                      <div className="flex space-x-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => abrirDialogoAsignar(elemento.cedulaId)}
                                          className="h-6 w-6 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700"
                                          title="Asignar a familia"
                                        >
                                          <FolderPlus className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => verDetalleCedula(elemento.cedulaId)}
                                          className="h-6 w-6 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700"
                                          title="Ver detalle"
                                        >
                                          <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => desasociarCedula(elemento.cedulaId)}
                                          className="h-6 w-6 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700"
                                          title="Desasociar"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ),
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">No hay cédulas asociadas a este resumen financiero.</p>
                <p className="text-gray-500 mt-2 text-sm">
                  Utiliza el botón "Asociar Cédulas" para agregar cédulas existentes o crea nuevas cédulas.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Selección de Cédulas */}
        {mostrarSeleccionCedulas && (
          <Card className="mb-4 bg-zinc-900 border-zinc-700">
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
                  className="pl-8 bg-zinc-800 border-zinc-700"
                />
              </div>

              {cedulasDisponibles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-zinc-800">
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-700">
                      {cedulasFiltradas.map((cedula) => (
                        <tr key={cedula.id} className="hover:bg-zinc-800">
                          <td className="px-2 py-1 whitespace-nowrap text-xs">{cedula.nombre}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            {new Date(cedula.fecha).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs font-medium">
                            {formatQuetzales(cedula.total || 0)}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            <Button
                              size="xs"
                              onClick={() => asociarCedula(cedula)}
                              className="bg-white text-black hover:bg-gray-200"
                            >
                              Asociar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-4">No hay cédulas disponibles para asociar.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Diálogo de Base de Datos */}
      <Dialog open={dialogoDBAbiert} onOpenChange={setDialogoDBAbiert}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-700 max-w-6xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Base de Datos del Resumen Financiero</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {/* Barra de búsqueda */}
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar elementos..."
                value={busquedaDB}
                onChange={(e) => setBusquedaDB(e.target.value)}
                className="pl-8 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            {/* Tabs para diferentes categorías */}
            <Tabs defaultValue="materiales" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
                <TabsTrigger value="materiales" className="text-white data-[state=active]:bg-zinc-700">
                  Materiales ({elementosDB.materiales.length})
                </TabsTrigger>
                <TabsTrigger value="equipamiento" className="text-white data-[state=active]:bg-zinc-700">
                  Equipamiento ({elementosDB.equipamiento.length})
                </TabsTrigger>
                <TabsTrigger value="manoDeObra" className="text-white data-[state=active]:bg-zinc-700">
                  Mano de Obra ({elementosDB.manoDeObra.length})
                </TabsTrigger>
              </TabsList>

              {/* Contenido de Materiales */}
              <TabsContent value="materiales" className="mt-4">
                <div className="overflow-auto max-h-96">
                  {filtrarElementosDB(elementosDB.materiales).length > 0 ? (
                    <table className="w-full">
                      <thead className="sticky top-0 bg-zinc-800">
                        <tr className="text-xs text-gray-400 border-b border-zinc-700">
                          <th className="text-left py-2 px-2">NOMBRE</th>
                          <th className="text-left py-2 px-2">UNIDAD</th>
                          <th className="text-left py-2 px-2">PRECIO UNIT.</th>
                          <th className="text-left py-2 px-2">CANTIDAD TOTAL</th>
                          <th className="text-left py-2 px-2">COSTO TOTAL</th>
                          <th className="text-left py-2 px-2">CÉDULAS USADAS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtrarElementosDB(elementosDB.materiales).map((elemento) => (
                          <tr key={elemento.id} className="text-xs border-b border-zinc-800 hover:bg-zinc-800">
                            <td className="py-2 px-2 font-medium">{elemento.nombre}</td>
                            <td className="py-2 px-2">{elemento.unidad}</td>
                            <td className="py-2 px-2">{formatQuetzales(elemento.precio)}</td>
                            <td className="py-2 px-2">{elemento.cantidadTotal}</td>
                            <td className="py-2 px-2 font-medium">{formatQuetzales(elemento.costoTotal)}</td>
                            <td className="py-2 px-2">
                              <div className="flex flex-wrap gap-1">
                                {elemento.cedulasUsadas.map((cedulaId) => {
                                  const cedula = cedulasAsociadas.find((c) => c.id === cedulaId)
                                  return (
                                    <span
                                      key={cedulaId}
                                      className="bg-blue-900 text-xs px-2 py-1 rounded"
                                      title={cedula?.nombre || "Cédula no encontrada"}
                                    >
                                      {cedula?.nombre?.substring(0, 10) || "N/A"}...
                                    </span>
                                  )
                                })}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-gray-400">No se encontraron materiales</div>
                  )}
                </div>
              </TabsContent>

              {/* Contenido de Equipamiento */}
              <TabsContent value="equipamiento" className="mt-4">
                <div className="overflow-auto max-h-96">
                  {filtrarElementosDB(elementosDB.equipamiento).length > 0 ? (
                    <table className="w-full">
                      <thead className="sticky top-0 bg-zinc-800">
                        <tr className="text-xs text-gray-400 border-b border-zinc-700">
                          <th className="text-left py-2 px-2">NOMBRE</th>
                          <th className="text-left py-2 px-2">UNIDAD</th>
                          <th className="text-left py-2 px-2">PRECIO UNIT.</th>
                          <th className="text-left py-2 px-2">CANTIDAD TOTAL</th>
                          <th className="text-left py-2 px-2">COSTO TOTAL</th>
                          <th className="text-left py-2 px-2">CÉDULAS USADAS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtrarElementosDB(elementosDB.equipamiento).map((elemento) => (
                          <tr key={elemento.id} className="text-xs border-b border-zinc-800 hover:bg-zinc-800">
                            <td className="py-2 px-2 font-medium">{elemento.nombre}</td>
                            <td className="py-2 px-2">{elemento.unidad}</td>
                            <td className="py-2 px-2">{formatQuetzales(elemento.precio)}</td>
                            <td className="py-2 px-2">{elemento.cantidadTotal}</td>
                            <td className="py-2 px-2 font-medium">{formatQuetzales(elemento.costoTotal)}</td>
                            <td className="py-2 px-2">
                              <div className="flex flex-wrap gap-1">
                                {elemento.cedulasUsadas.map((cedulaId) => {
                                  const cedula = cedulasAsociadas.find((c) => c.id === cedulaId)
                                  return (
                                    <span
                                      key={cedulaId}
                                      className="bg-green-900 text-xs px-2 py-1 rounded"
                                      title={cedula?.nombre || "Cédula no encontrada"}
                                    >
                                      {cedula?.nombre?.substring(0, 10) || "N/A"}...
                                    </span>
                                  )
                                })}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-gray-400">No se encontró equipamiento</div>
                  )}
                </div>
              </TabsContent>

              {/* Contenido de Mano de Obra */}
              <TabsContent value="manoDeObra" className="mt-4">
                <div className="overflow-auto max-h-96">
                  {filtrarElementosDB(elementosDB.manoDeObra).length > 0 ? (
                    <table className="w-full">
                      <thead className="sticky top-0 bg-zinc-800">
                        <tr className="text-xs text-gray-400 border-b border-zinc-700">
                          <th className="text-left py-2 px-2">NOMBRE</th>
                          <th className="text-left py-2 px-2">UNIDAD</th>
                          <th className="text-left py-2 px-2">PRECIO UNIT.</th>
                          <th className="text-left py-2 px-2">CANTIDAD TOTAL</th>
                          <th className="text-left py-2 px-2">COSTO TOTAL</th>
                          <th className="text-left py-2 px-2">CÉDULAS USADAS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtrarElementosDB(elementosDB.manoDeObra).map((elemento) => (
                          <tr key={elemento.id} className="text-xs border-b border-zinc-800 hover:bg-zinc-800">
                            <td className="py-2 px-2 font-medium">{elemento.nombre}</td>
                            <td className="py-2 px-2">{elemento.unidad}</td>
                            <td className="py-2 px-2">{formatQuetzales(elemento.precio)}</td>
                            <td className="py-2 px-2">{elemento.cantidadTotal}</td>
                            <td className="py-2 px-2 font-medium">{formatQuetzales(elemento.costoTotal)}</td>
                            <td className="py-2 px-2">
                              <div className="flex flex-wrap gap-1">
                                {elemento.cedulasUsadas.map((cedulaId) => {
                                  const cedula = cedulasAsociadas.find((c) => c.id === cedulaId)
                                  return (
                                    <span
                                      key={cedulaId}
                                      className="bg-orange-900 text-xs px-2 py-1 rounded"
                                      title={cedula?.nombre || "Cédula no encontrada"}
                                    >
                                      {cedula?.nombre?.substring(0, 10) || "N/A"}...
                                    </span>
                                  )
                                })}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-gray-400">No se encontró mano de obra</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoDBAbiert(false)} className="border-zinc-700 text-white">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear familia */}
      <Dialog open={dialogoFamiliaAbierto} onOpenChange={setDialogoFamiliaAbierto}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Crear Nueva Familia</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="nombreFamilia" className="text-white">
              Nombre de la Familia
            </Label>
            <Input
              id="nombreFamilia"
              value={nuevaFamilia}
              onChange={(e) => setNuevaFamilia(e.target.value)}
              placeholder="Ej: OBRA GRIS"
              className="mt-2 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogoFamiliaAbierto(false)}
              className="border-zinc-700 text-white"
            >
              Cancelar
            </Button>
            <Button onClick={crearFamilia} className="bg-white text-black hover:bg-gray-200">
              Crear Familia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear subfamilia */}
      <Dialog open={dialogoSubfamiliaAbierto} onOpenChange={setDialogoSubfamiliaAbierto}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Crear Nueva Subfamilia</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="familiaSelect" className="text-white">
                Seleccionar Familia
              </Label>
              <select
                id="familiaSelect"
                value={familiaSeleccionada || ""}
                onChange={(e) => setFamiliaSeleccionada(e.target.value)}
                className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
              >
                <option value="">Seleccionar una familia</option>
                {familias.map((familia) => (
                  <option key={familia.id} value={familia.id}>
                    {familia.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="nombreSubfamilia" className="text-white">
                Nombre de la Subfamilia
              </Label>
              <Input
                id="nombreSubfamilia"
                value={nuevaSubfamilia}
                onChange={(e) => setNuevaSubfamilia(e.target.value)}
                placeholder="Ej: ZAPATAS PEDESTALES Y VIGAS CONECTORAS"
                className="mt-2 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogoSubfamiliaAbierto(false)}
              className="border-zinc-700 text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={crearSubfamilia}
              className="bg-white text-black hover:bg-gray-200"
              disabled={!familiaSeleccionada || !nuevaSubfamilia.trim()}
            >
              Crear Subfamilia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para asignar cédula a familia/subfamilia */}
      <Dialog open={dialogoAsignarAbierto} onOpenChange={setDialogoAsignarAbierto}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Asignar a Familia/Subfamilia</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="asignarFamiliaSelect" className="text-white">
                Seleccionar Familia
              </Label>
              <select
                id="asignarFamiliaSelect"
                value={familiaParaAsignar || ""}
                onChange={(e) => {
                  setFamiliaParaAsignar(e.target.value)
                  setSubfamiliaParaAsignar(null) // Resetear subfamilia al cambiar familia
                }}
                className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
              >
                <option value="">Sin familia</option>
                {familias.map((familia) => (
                  <option key={familia.id} value={familia.id}>
                    {familia.nombre}
                  </option>
                ))}
              </select>
            </div>
            {familiaParaAsignar && (
              <div>
                <Label htmlFor="asignarSubfamiliaSelect" className="text-white">
                  Seleccionar Subfamilia
                </Label>
                <select
                  id="asignarSubfamiliaSelect"
                  value={subfamiliaParaAsignar || ""}
                  onChange={(e) => setSubfamiliaParaAsignar(e.target.value)}
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
                >
                  <option value="">Sin subfamilia</option>
                  {familias
                    .find((f) => f.id === familiaParaAsignar)
                    ?.subfamilias.map((subfamilia) => (
                      <option key={subfamilia.id} value={subfamilia.id}>
                        {subfamilia.nombre}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogoAsignarAbierto(false)}
              className="border-zinc-700 text-white"
            >
              Cancelar
            </Button>
            <Button onClick={asignarCedulaAFamilia} className="bg-white text-black hover:bg-gray-200">
              Asignar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

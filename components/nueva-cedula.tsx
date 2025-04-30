"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Package,
  HardHat,
  Truck,
  Search,
  X,
  Plus,
  DollarSign,
  Save,
  CheckCircle,
  Calculator,
  Download,
  Printer,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

// Tipos para los diferentes elementos
type Material = {
  id: string
  codigo: string
  familia: string
  nombre: string
  unidad: string
  precio: number
}

type ManoObra = {
  id: string
  codigo: string
  familia: string
  trabajo: string
  unidad: string
  precio: number
}

type Equipo = {
  id: string
  codigo: string
  familia: string
  nombre: string
  unidad: string
  precio: number
  consumoCombustible?: number
}

// Modificar el tipo ElementoCedula para incluir los nuevos campos para equipamiento
type ElementoCedula = {
  id: string
  codigo: string
  familia: string
  descripcion: string
  unidad: string
  precio: number
  cantidad: number
  total: number
  rendimiento?: number
  costoGlobal?: number
  costoUnidad?: number
  porcentaje?: number
  rendHora?: number
  mxHora?: number
}

// Modificar el tipo Cedula para incluir la información de la fila de tarea
type Cedula = {
  id: string
  nombre: string
  fecha: string
  elementos: ElementoCedula[]
  total: number
  proyecto?: string
  cliente?: string
  ubicacion?: string
  responsable?: string
  notas?: string
  filaTarea?: string
  filaDescripcion?: string
  filaUnidad?: string
  filaCantidad?: number
  filaRendUnidad?: number
}

// Datos de ejemplo
const materialesEjemplo: Material[] = [
  { id: "1", codigo: "MAT-001", familia: "MT", nombre: "Cemento Portland", unidad: "saco", precio: 85.5 },
  { id: "2", codigo: "MAT-002", familia: "MT", nombre: "Arena de río", unidad: "m³", precio: 150.0 },
  { id: "3", codigo: "MAT-003", familia: "MT", nombre: 'Varilla de acero 3/8"', unidad: "unidad", precio: 45.75 },
  { id: "4", codigo: "MAT-004", familia: "MT", nombre: "Bloque de concreto", unidad: "unidad", precio: 8.25 },
  { id: "5", codigo: "MAT-005", familia: "MT", nombre: "Madera para encofrado", unidad: "pie²", precio: 12.5 },
  { id: "6", codigo: "MAT-006", familia: "MT", nombre: "Pintura látex", unidad: "galón", precio: 120.0 },
  { id: "7", codigo: "MAT-007", familia: "MT", nombre: 'Tubo PVC 4"', unidad: "unidad", precio: 35.0 },
  { id: "8", codigo: "MAT-008", familia: "MT", nombre: "Cable eléctrico #12", unidad: "m", precio: 5.75 },
  { id: "9", codigo: "MAT-009", familia: "MT", nombre: "Lámina de zinc", unidad: "unidad", precio: 95.0 },
  { id: "10", codigo: "MAT-010", familia: "MT", nombre: 'Clavos 2"', unidad: "lb", precio: 8.5 },
]

const manoObraEjemplo: ManoObra[] = [
  { id: "1", codigo: "MO-001", familia: "MO", trabajo: "Albañilería", unidad: "día", precio: 150.0 },
  { id: "2", codigo: "MO-002", familia: "MO", trabajo: "Electricista", unidad: "hora", precio: 75.5 },
  { id: "3", codigo: "MO-003", familia: "MO", trabajo: "Pintura", unidad: "m²", precio: 25.0 },
  { id: "4", codigo: "MO-004", familia: "MO", trabajo: "Plomería", unidad: "hora", precio: 80.0 },
  { id: "5", codigo: "MO-005", familia: "MO", trabajo: "Carpintería", unidad: "día", precio: 200.0 },
  { id: "6", codigo: "MO-006", familia: "MO", trabajo: "Soldadura", unidad: "hora", precio: 90.0 },
  { id: "7", codigo: "MO-007", familia: "MO", trabajo: "Instalación de pisos", unidad: "m²", precio: 35.0 },
  { id: "8", codigo: "MO-008", familia: "MO", trabajo: "Instalación de techos", unidad: "m²", precio: 45.0 },
  { id: "9", codigo: "MO-009", familia: "MO", trabajo: "Acabados", unidad: "día", precio: 175.0 },
  { id: "10", codigo: "MO-010", familia: "MO", trabajo: "Supervisión", unidad: "día", precio: 300.0 },
]

const equiposEjemplo: Equipo[] = [
  {
    id: "1",
    codigo: "EQ-001",
    familia: "EQ",
    nombre: "Excavadora",
    unidad: "hora",
    precio: 350.0,
    consumoCombustible: 15,
  },
  {
    id: "2",
    codigo: "EQ-002",
    familia: "EQ",
    nombre: "Mezcladora de concreto",
    unidad: "día",
    precio: 200.0,
    consumoCombustible: 5,
  },
  { id: "3", codigo: "EQ-003", familia: "EQ", nombre: "Andamio", unidad: "día", precio: 50.0, consumoCombustible: 0 },
  {
    id: "4",
    codigo: "EQ-004",
    familia: "EQ",
    nombre: "Compactadora",
    unidad: "día",
    precio: 180.0,
    consumoCombustible: 8,
  },
  {
    id: "5",
    codigo: "EQ-005",
    familia: "EQ",
    nombre: "Generador eléctrico",
    unidad: "día",
    precio: 120.0,
    consumoCombustible: 12,
  },
  {
    id: "6",
    codigo: "EQ-006",
    familia: "EQ",
    nombre: "Grúa torre",
    unidad: "día",
    precio: 1200.0,
    consumoCombustible: 0,
  },
  {
    id: "7",
    codigo: "EQ-007",
    familia: "EQ",
    nombre: "Retroexcavadora",
    unidad: "hora",
    precio: 280.0,
    consumoCombustible: 12,
  },
  {
    id: "8",
    codigo: "EQ-008",
    familia: "EQ",
    nombre: "Vibrador de concreto",
    unidad: "día",
    precio: 85.0,
    consumoCombustible: 2,
  },
  {
    id: "9",
    codigo: "EQ-009",
    familia: "EQ",
    nombre: "Bomba de agua",
    unidad: "día",
    precio: 95.0,
    consumoCombustible: 3,
  },
  {
    id: "10",
    codigo: "EQ-010",
    familia: "EQ",
    nombre: "Camión volquete",
    unidad: "día",
    precio: 450.0,
    consumoCombustible: 25,
  },
]

// Proyectos de ejemplo
const proyectosEjemplo = [
  { id: "1", nombre: "Edificio Residencial Torres del Valle" },
  { id: "2", nombre: "Centro Comercial Plaza Central" },
  { id: "3", nombre: "Puente Río Grande" },
  { id: "4", nombre: "Escuela Municipal San Pedro" },
  { id: "5", nombre: "Hospital Regional" },
]

interface NuevaCedulaProps {
  proyectoId?: string | null
  rfId?: string | null
  tipo?: string | null
  cedulaId?: string | null
}

export function NuevaCedula({ proyectoId, rfId, tipo, cedulaId }: NuevaCedulaProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [nombreCedula, setNombreCedula] = useState("")
  const [busquedaMT, setBusquedaMT] = useState("")
  const [busquedaMO, setBusquedaMO] = useState("")
  const [busquedaEQ, setBusquedaEQ] = useState("")
  const [elementosSeleccionados, setElementosSeleccionados] = useState<ElementoCedula[]>([])
  const [cedulaGuardada, setCedulaGuardada] = useState(false)

  // Información adicional de la cédula
  const [proyecto, setProyecto] = useState(proyectoId || "")
  const [cliente, setCliente] = useState("")
  const [ubicacion, setUbicacion] = useState("")
  const [responsable, setResponsable] = useState("")
  const [notas, setNotas] = useState("")

  // Factores para cálculos
  const [factorImpuestos, setFactorImpuestos] = useState(0.12) // 12% por defecto
  const [factorIndirectos, setFactorIndirectos] = useState(0.15) // 15% por defecto
  const [factorUtilidad, setFactorUtilidad] = useState(0.1) // 10% por defecto

  // Estados para la fila de entrada
  const [filaTarea, setFilaTarea] = useState<string>("")
  const [filaDescripcion, setFilaDescripcion] = useState<string>("")
  const [filaUnidad, setFilaUnidad] = useState<string>("")
  const [filaCantidad, setFilaCantidad] = useState<number>(0)
  const [filaPrecioUnitario, setFilaPrecioUnitario] = useState<number>(0)
  const [filaPorcentajeImp, setFilaPorcentajeImp] = useState<number>(0)
  const [filaQImp, setFilaQImp] = useState<number>(0)
  const [filaPorcentajeFactInd, setFilaPorcentajeFactInd] = useState<number>(0)
  const [filaQIndUtild, setFilaQIndUtild] = useState<number>(0)
  const [filaTotal, setFilaTotal] = useState<number>(0)
  const [filaPU, setFilaPU] = useState<number>(0)
  const [filaPorcentajeIncidencia, setFilaPorcentajeIncidencia] = useState<number>(0)
  const [filaRendUnidad, setFilaRendUnidad] = useState<number>(0)

  // Cargar datos existentes si estamos editando una cédula
  // Modificar la función useEffect que carga los datos de la cédula existente
  useEffect(() => {
    if (typeof window !== "undefined" && cedulaId) {
      try {
        const cedulasGuardadas = JSON.parse(localStorage.getItem("cedulas") || "[]")
        const cedulaEncontrada = cedulasGuardadas.find((c: any) => c.id === cedulaId)

        if (cedulaEncontrada) {
          console.log("Cédula encontrada para edición:", cedulaEncontrada)
          // Cargar datos de la cédula existente
          setNombreCedula(cedulaEncontrada.nombre || "")
          setProyecto(cedulaEncontrada.proyecto || "")
          setCliente(cedulaEncontrada.cliente || "")
          setUbicacion(cedulaEncontrada.ubicacion || "")
          setResponsable(cedulaEncontrada.responsable || "")
          setNotas(cedulaEncontrada.notas || "")
          setElementosSeleccionados(cedulaEncontrada.elementos || [])

          // Cargar datos de la fila de tarea si existen
          if (cedulaEncontrada.filaTarea) setFilaTarea(cedulaEncontrada.filaTarea)
          if (cedulaEncontrada.filaDescripcion) setFilaDescripcion(cedulaEncontrada.filaDescripcion)
          if (cedulaEncontrada.filaUnidad) setFilaUnidad(cedulaEncontrada.filaUnidad)
          if (cedulaEncontrada.filaCantidad !== undefined) setFilaCantidad(cedulaEncontrada.filaCantidad)
          if (cedulaEncontrada.filaRendUnidad !== undefined) setFilaRendUnidad(cedulaEncontrada.filaRendUnidad)
        } else {
          console.error("No se encontró la cédula con ID:", cedulaId)
        }
      } catch (error) {
        console.error("Error al cargar la cédula para edición:", error)
      }
    }
  }, [cedulaId])

  // Calcular el total de insumos como cantidad * rendimiento/unidad
  const filaTotalInsumos = filaCantidad * filaRendUnidad

  // Calcular subtotales por familia
  const totalMateriales = elementosSeleccionados
    .filter((elemento) => elemento.familia === "MT")
    .reduce((sum, elemento) => sum + (elemento.costoGlobal || elemento.precio * elemento.total), 0)
  const totalManoObra = elementosSeleccionados
    .filter((elemento) => elemento.familia === "MO")
    .reduce((sum, elemento) => sum + (elemento.costoGlobal || elemento.precio * elemento.total), 0)
  const totalEquipos = elementosSeleccionados
    .filter((elemento) => elemento.familia === "EQ")
    .reduce((sum, elemento) => sum + (elemento.costoGlobal || elemento.precio * elemento.total), 0)

  // Calcular el total general de la cédula como la suma de los subtotales de costo global
  const totalCedula = totalMateriales + totalManoObra + totalEquipos

  // Modificar el cálculo del totalPU para que sea la suma de los subtotales de costo unidad de cada familia
  // Calcular subtotales de costo unidad por familia
  const totalCostoUnidadMateriales = elementosSeleccionados
    .filter((elemento) => elemento.familia === "MT")
    .reduce((sum, elemento) => sum + (elemento.costoUnidad || elemento.precio * (elemento.rendimiento || 1)), 0)
  const totalCostoUnidadManoObra = elementosSeleccionados
    .filter((elemento) => elemento.familia === "MO")
    .reduce((sum, elemento) => sum + (elemento.costoUnidad || elemento.precio * (elemento.rendimiento || 1)), 0)
  const totalCostoUnidadEquipos = elementosSeleccionados
    .filter((elemento) => elemento.familia === "EQ")
    .reduce((sum, elemento) => sum + (elemento.costoUnidad || elemento.precio * (elemento.rendimiento || 1)), 0)

  // El total P/U es la suma de los subtotales de costo unidad de cada familia
  const totalPU = totalCostoUnidadMateriales + totalCostoUnidadManoObra + totalCostoUnidadEquipos

  // Calcular valores derivados después de tener el totalCedula
  const subtotalCedula = totalCedula
  const impuestos = subtotalCedula * factorImpuestos
  const indirectos = subtotalCedula * factorIndirectos
  const utilidad = subtotalCedula * factorUtilidad

  // Actualizar totales de materiales cuando cambie filaCantidad
  useEffect(() => {
    if (elementosSeleccionados.length > 0) {
      const updatedElementos = elementosSeleccionados.map((elemento) => {
        if (elemento.familia === "MT") {
          // Multiplicar solo por rendimiento/unidad * cantidad
          const nuevoTotal = filaRendUnidad * filaCantidad
          return {
            ...elemento,
            total: nuevoTotal,
          }
        }
        return elemento
      })

      // Compare if there are actual changes before updating state
      const hasChanges = updatedElementos.some((newEl, index) => newEl.total !== elementosSeleccionados[index].total)

      if (hasChanges) {
        setElementosSeleccionados(updatedElementos)
      }
    }
  }, [filaCantidad, filaRendUnidad])

  // Función para calcular los porcentajes de incidencia
  useEffect(() => {
    if (elementosSeleccionados.length > 0 && totalCedula > 0) {
      const updatedElementos = elementosSeleccionados.map((elemento) => {
        const newPorcentaje = elemento.costoGlobal
          ? (elemento.costoGlobal / totalCedula) * 100
          : ((elemento.precio * elemento.total) / totalCedula) * 100
        if (Math.abs((elemento.porcentaje || 0) - newPorcentaje) > 0.01) {
          return {
            ...elemento,
            porcentaje: newPorcentaje,
          }
        }
        return elemento
      })

      // Check if there are actual changes before updating state
      const hasChanges = updatedElementos.some(
        (newEl, index) => newEl.porcentaje !== elementosSeleccionados[index].porcentaje,
      )

      if (hasChanges) {
        setElementosSeleccionados(updatedElementos)
      }
    }
  }, [totalCedula])

  // Añadir un useEffect para sincronizar filaTotal con totalCedula
  useEffect(() => {
    // Actualizar filaTotal para que sea igual al totalCedula
    setFilaTotal(totalCedula)
    // Actualizar filaPU para que sea igual al totalPU
    setFilaPU(totalPU)
  }, [totalCedula, totalPU])

  // Modificar la función guardarCedula para manejar tanto creación como edición
  const guardarCedula = () => {
    try {
      // Validar que haya un nombre
      if (!nombreCedula.trim()) {
        toast({
          title: "Error",
          description: "El nombre de la cédula es obligatorio.",
          variant: "destructive",
        })
        return
      }

      // Crear objeto de cédula
      const id = cedulaId || Date.now().toString() // Usar ID existente o generar uno nuevo
      const cedula: Cedula = {
        id: id,
        nombre: nombreCedula,
        fecha: new Date().toISOString(),
        elementos: elementosSeleccionados,
        total: totalCedula,
        proyecto: proyectoId || undefined,
        cliente,
        ubicacion,
        responsable,
        notas,
        // Guardar la información de la fila de tarea
        filaTarea,
        filaDescripcion,
        filaUnidad,
        filaCantidad,
        filaRendUnidad,
      }

      // En una aplicación real, aquí enviaríamos la cédula al backend
      console.log("Cédula guardada:", cedula)

      // Simular guardado exitoso
      setCedulaGuardada(true)

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        const cedulasGuardadas = JSON.parse(localStorage.getItem("cedulas") || "[]")

        if (cedulaId) {
          // Actualizar cédula existente
          const cedulasActualizadas = cedulasGuardadas.map((c: any) => (c.id === cedulaId ? cedula : c))
          localStorage.setItem("cedulas", JSON.stringify(cedulasActualizadas))

          toast({
            title: "Cédula actualizada",
            description: `La cédula "${nombreCedula}" ha sido actualizada con éxito.`,
          })
        } else {
          // Crear nueva cédula
          cedulasGuardadas.push(cedula)
          localStorage.setItem("cedulas", JSON.stringify(cedulasGuardadas))

          toast({
            title: "Cédula guardada",
            description: `La cédula "${nombreCedula}" ha sido guardada con éxito.`,
          })

          // Si hay un rfId, asociar la cédula al RF
          if (rfId) {
            const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
            const resumenEncontrado = resumenesGuardados.find((r: any) => r.id === rfId)

            if (resumenEncontrado) {
              // Asociar la cédula al RF
              resumenEncontrado.cedulasAsociadas = [...(resumenEncontrado.cedulasAsociadas || []), id]

              // Actualizar el RF en localStorage
              const resumenesActualizados = resumenesGuardados.map((r: any) => (r.id === rfId ? resumenEncontrado : r))
              localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))

              // Redirigir al detalle del RF después de un breve retraso
              setTimeout(() => {
                router.push(`/proyectos/${proyectoId}/resumenes-financieros/${rfId}?nuevaCedula=${id}`)
              }, 500)
              return
            }
          }
        }

        // Redirigir según el contexto
        setTimeout(() => {
          if (cedulaId) {
            router.push(`/cedulas/${cedulaId}`)
          } else if (proyectoId) {
            router.push(`/proyectos/${proyectoId}`)
          } else {
            router.push(`/cedulas/${id}`)
          }
        }, 500)
      }
    } catch (error) {
      console.error("Error al guardar la cédula:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al guardar la cédula. Inténtalo de nuevo.",
      })
    }
  }

  // Resto del código del componente...
  // (Mantener el resto del componente igual)

  // Función para filtrar elementos según la búsqueda
  const filtrarMateriales = (busqueda: string) => {
    return materialesEjemplo.filter(
      (material) =>
        material.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        material.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    )
  }

  const filtrarManoObra = (busqueda: string) => {
    return manoObraEjemplo.filter(
      (manoObra) =>
        manoObra.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        manoObra.trabajo.toLowerCase().includes(busqueda.toLowerCase()),
    )
  }

  const filtrarEquipos = (busqueda: string) => {
    return equiposEjemplo.filter(
      (equipo) =>
        equipo.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        equipo.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    )
  }

  const materialesFiltrados = filtrarMateriales(busquedaMT)
  const manoObraFiltrada = filtrarManoObra(busquedaMO)
  const equiposFiltrados = filtrarEquipos(busquedaEQ)

  // Modificar la función agregarElemento para incluir los nuevos campos para equipamiento
  const agregarElemento = (tipo: "MT" | "MO" | "EQ", id: string) => {
    let elemento
    if (tipo === "MT") {
      elemento = materialesEjemplo.find((m) => m.id === id)
      if (elemento) {
        const rendimiento = filaRendUnidad
        // Usar solo rendimiento/unidad * cantidad para el cálculo
        const totalInsumos = rendimiento * filaCantidad
        const costoGlobal = elemento.precio * totalInsumos
        const costoUnidad = elemento.precio * rendimiento
        const nuevoElemento: ElementoCedula = {
          id: elemento.id,
          codigo: elemento.codigo,
          familia: elemento.familia,
          descripcion: elemento.nombre,
          unidad: elemento.unidad,
          precio: elemento.precio,
          cantidad: 1, // Mantenemos cantidad en 1 pero usamos filaCantidad para el cálculo
          total: totalInsumos,
          rendimiento: rendimiento,
          costoGlobal: costoGlobal,
          costoUnidad: costoUnidad,
          porcentaje: 0, // Se calculará después
        }
        setElementosSeleccionados([...elementosSeleccionados, nuevoElemento])
      }
      // Limpiar búsqueda después de agregar
      setBusquedaMT("")
    } else if (tipo === "MO") {
      elemento = manoObraEjemplo.find((m) => m.id === id)
      if (elemento) {
        const rendimiento = 1
        const totalInsumos = rendimiento * 1 // Cantidad 1 por defecto
        const costoGlobal = elemento.precio * totalInsumos
        const costoUnidad = elemento.precio * rendimiento
        const nuevoElemento: ElementoCedula = {
          id: elemento.id,
          codigo: elemento.codigo,
          familia: elemento.familia,
          descripcion: elemento.trabajo,
          unidad: elemento.unidad,
          precio: elemento.precio,
          cantidad: 1,
          total: totalInsumos,
          rendimiento: rendimiento,
          costoGlobal: costoGlobal,
          costoUnidad: costoUnidad,
          porcentaje: 0, // Se calculará después
        }
        setElementosSeleccionados([...elementosSeleccionados, nuevoElemento])
      }
      // Limpiar búsqueda después de agregar
      setBusquedaMO("")
    } else if (tipo === "EQ") {
      elemento = equiposEjemplo.find((e) => e.id === id)
      if (elemento) {
        const rendimiento = 1
        const totalInsumos = rendimiento * 1 // Cantidad 1 por defecto
        const costoGlobal = elemento.precio * totalInsumos
        const costoUnidad = elemento.precio * rendimiento
        const nuevoElemento: ElementoCedula = {
          id: elemento.id,
          codigo: elemento.codigo,
          familia: elemento.familia,
          descripcion:
            elemento.nombre + (elemento.consumoCombustible ? ` (Consumo: ${elemento.consumoCombustible} L/h)` : ""),
          unidad: elemento.unidad,
          precio: elemento.precio,
          cantidad: 1,
          total: totalInsumos,
          rendimiento: rendimiento,
          costoGlobal: costoGlobal,
          costoUnidad: costoUnidad,
          porcentaje: 0, // Se calculará después
          rendHora: 1, // Valor por defecto para equipamiento
          mxHora: elemento.consumoCombustible || 0, // Usar consumo de combustible como mx/hora
        }
        setElementosSeleccionados([...elementosSeleccionados, nuevoElemento])
      }
      // Limpiar búsqueda después de agregar
      setBusquedaEQ("")
    }
  }

  // Función para actualizar la cantidad de un elemento
  const actualizarCantidad = (id: string, cantidad: number) => {
    setElementosSeleccionados(
      elementosSeleccionados.map((elemento) => {
        if (elemento.id === id) {
          const nuevaCantidad = Math.max(0, cantidad)
          const rendimiento = elemento.rendimiento || 1
          const totalInsumos = rendimiento * nuevaCantidad
          const costoGlobal = elemento.precio * totalInsumos
          const costoUnidad = elemento.precio * rendimiento
          return {
            ...elemento,
            cantidad: nuevaCantidad,
            total: totalInsumos,
            costoGlobal: costoGlobal,
            costoUnidad: costoUnidad,
          }
        }
        return elemento
      }),
    )
  }

  // Función para actualizar el precio de un elemento
  const actualizarPrecio = (id: string, precio: number) => {
    setElementosSeleccionados(
      elementosSeleccionados.map((elemento) => {
        if (elemento.id === id) {
          const nuevoPrecio = Math.max(0, precio)
          const rendimiento = elemento.rendimiento || 1
          // Si es un material, usar filaCantidad para el cálculo
          const cantidad = elemento.familia === "MT" ? filaCantidad : elemento.cantidad
          const totalInsumos = rendimiento * cantidad
          const costoGlobal = nuevoPrecio * totalInsumos
          const costoUnidad = nuevoPrecio * rendimiento
          return {
            ...elemento,
            precio: nuevoPrecio,
            total: totalInsumos,
            costoGlobal: costoGlobal,
            costoUnidad: costoUnidad,
          }
        }
        return elemento
      }),
    )
  }

  // Función para actualizar la unidad de un elemento
  const actualizarUnidad = (id: string, unidad: string) => {
    setElementosSeleccionados(
      elementosSeleccionados.map((elemento) => {
        if (elemento.id === id) {
          return {
            ...elemento,
            unidad: unidad,
          }
        }
        return elemento
      }),
    )
  }

  // Función para actualizar la descripción de un elemento
  const actualizarDescripcion = (id: string, descripcion: string) => {
    setElementosSeleccionados(
      elementosSeleccionados.map((elemento) => {
        if (elemento.id === id) {
          return {
            ...elemento,
            descripcion: descripcion,
          }
        }
        return elemento
      }),
    )
  }

  // Función para actualizar el rendimiento de un elemento
  const actualizarRendimiento = (id: string, rendimiento: number) => {
    setElementosSeleccionados(
      elementosSeleccionados.map((elemento) => {
        if (elemento.id === id) {
          const nuevoRendimiento = Math.max(0.01, rendimiento)
          // Si es un material, usar filaCantidad para el cálculo
          const cantidad = elemento.familia === "MT" ? filaCantidad : elemento.cantidad
          const totalInsumos = nuevoRendimiento * cantidad
          const costoGlobal = elemento.precio * totalInsumos
          const costoUnidad = elemento.precio * nuevoRendimiento
          return {
            ...elemento,
            rendimiento: nuevoRendimiento,
            total: totalInsumos,
            costoGlobal: costoGlobal,
            costoUnidad: costoUnidad,
          }
        }
        return elemento
      }),
    )
  }

  // Agregar funciones para actualizar los nuevos campos
  const actualizarRendHora = (id: string, rendHora: number) => {
    setElementosSeleccionados(
      elementosSeleccionados.map((elemento) => {
        if (elemento.id === id) {
          return {
            ...elemento,
            rendHora: Math.max(0.01, rendHora),
          }
        }
        return elemento
      }),
    )
  }

  const actualizarMxHora = (id: string, mxHora: number) => {
    setElementosSeleccionados(
      elementosSeleccionados.map((elemento) => {
        if (elemento.id === id) {
          return {
            ...elemento,
            mxHora: Math.max(0, mxHora),
          }
        }
        return elemento
      }),
    )
  }

  // Función para eliminar un elemento de la cédula
  const eliminarElemento = (id: string) => {
    setElementosSeleccionados(elementosSeleccionados.filter((elemento) => elemento.id !== id))
  }

  // Función para exportar la cédula a PDF (simulada)
  const exportarPDF = () => {
    toast({
      title: "Exportando a PDF",
      description: "La cédula se está exportando a PDF...",
    })
    // Aquí iría la lógica real para exportar a PDF
    setTimeout(() => {
      toast({
        title: "PDF generado",
        description: "La cédula ha sido exportada a PDF con éxito.",
      })
    }, 1500)
  }

  // Función para imprimir la cédula (simulada)
  const imprimirCedula = () => {
    toast({
      title: "Preparando impresión",
      description: "Preparando la cédula para imprimir...",
    })
    // Aquí iría la lógica real para imprimir
    setTimeout(() => {
      window.print()
    }, 1000)
  }

  // Filtrar elementos por familia
  const materialesSeleccionados = elementosSeleccionados.filter((elemento) => elemento.familia === "MT")
  const manoObraSeleccionada = elementosSeleccionados.filter((elemento) => elemento.familia === "MO")
  const equiposSeleccionados = elementosSeleccionados.filter((elemento) => elemento.familia === "EQ")

  // Modificar la función renderTablaElementos para mostrar una tabla diferente para equipamiento
  const renderTablaElementos = (elementos: ElementoCedula[], titulo: string, icono: React.ReactNode) => {
    if (elementos.length === 0) return null

    // Si es equipamiento, mostrar tabla con estructura diferente
    if (titulo.includes("Equipamiento")) {
      return (
        <div className="mb-4">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 dark:border-zinc-700 text-[10px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Código
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Familia
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Descripción
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Rend/hora
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Mx/hora
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Unidad
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Rend/Unidad
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Total insumos
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Costo
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Costo global
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Costo unidad
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    %
                  </th>
                  <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-800 divide-y-0 divide-gray-200 dark:divide-zinc-700">
                {elementos.map((elemento) => (
                  <tr
                    key={elemento.id}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-700 border-b border-gray-200 dark:border-zinc-700 h-5 leading-none"
                  >
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                      {elemento.codigo}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      {elemento.familia}
                    </td>
                    <td className="px-0.5 py-0 text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      <Textarea
                        value={elemento.descripcion}
                        onChange={(e) => actualizarDescripcion(elemento.id, e.target.value)}
                        className="min-h-[18px] h-4 w-full text-[10px] p-0.5 resize-none leading-tight"
                      />
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={elemento.rendHora || 1}
                        onChange={(e) => actualizarRendHora(elemento.id, Number.parseFloat(e.target.value) || 1)}
                        className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                      />
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={elemento.mxHora || 0}
                        onChange={(e) => actualizarMxHora(elemento.id, Number.parseFloat(e.target.value) || 0)}
                        className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                      />
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      <Input
                        type="text"
                        value={elemento.unidad}
                        onChange={(e) => actualizarUnidad(elemento.id, e.target.value)}
                        className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                      />
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={elemento.rendimiento || 1}
                        onChange={(e) => actualizarRendimiento(elemento.id, Number.parseFloat(e.target.value) || 1)}
                        className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                      />
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      {elemento.total.toFixed(2)}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={elemento.precio}
                        onChange={(e) => actualizarPrecio(elemento.id, Number.parseFloat(e.target.value) || 0)}
                        className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                      />
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      Q{elemento.costoGlobal?.toFixed(2) || (elemento.precio * elemento.total).toFixed(2)}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      Q{elemento.costoUnidad?.toFixed(2) || (elemento.precio * (elemento.rendimiento || 1)).toFixed(2)}
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      {elemento.porcentaje?.toFixed(2) || "0.00"}%
                    </td>
                    <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                      <button onClick={() => eliminarElemento(elemento.id)} className="text-red-500 hover:text-red-700">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                  <td
                    colSpan={8}
                    className="px-0.5 py-0 text-right text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700"
                  >
                    Subtotal:
                  </td>
                  <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                    -
                  </td>
                  <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                    Q
                    {elementos
                      .reduce((sum, elemento) => sum + (elemento.costoGlobal || elemento.precio * elemento.total), 0)
                      .toFixed(2)}
                  </td>
                  <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                    Q
                    {elementos
                      .reduce(
                        (sum, elemento) =>
                          sum + (elemento.costoUnidad || elemento.precio * (elemento.rendimiento || 1)),
                        0,
                      )
                      .toFixed(2)}
                  </td>
                  <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    // Para materiales y mano de obra, mantener la tabla original
    return (
      <div className="mb-4">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 dark:border-zinc-700 text-[10px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                  Código
                </th>
                <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                  Familia
                </th>
                <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                  Descripción
                </th>
                <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                  Unidad
                </th>
                <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                  Rend/Unidad
                </th>
                <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                  Total insumos
                </th>
                <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                  Costo
                </th>
                <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                  Costo global
                </th>
                <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                  Costo unidad
                </th>
                <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                  %
                </th>
                <th className="px-0.5 py-0 text-left text-[9px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-zinc-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y-0 divide-gray-200 dark:divide-zinc-700">
              {elementos.map((elemento) => (
                <tr
                  key={elemento.id}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-700 border-b border-gray-200 dark:border-zinc-700 h-5 leading-none"
                >
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                    {elemento.codigo}
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    {elemento.familia}
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    <Textarea
                      value={elemento.descripcion}
                      onChange={(e) => actualizarDescripcion(elemento.id, e.target.value)}
                      className="min-h-[18px] h-4 w-full text-[10px] p-0.5 resize-none leading-tight"
                    />
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    <Input
                      type="text"
                      value={elemento.unidad}
                      onChange={(e) => actualizarUnidad(elemento.id, e.target.value)}
                      className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                    />
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={elemento.rendimiento || 1}
                      onChange={(e) => actualizarRendimiento(elemento.id, Number.parseFloat(e.target.value) || 1)}
                      className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                    />
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    {elemento.total.toFixed(2)}
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={elemento.precio}
                      onChange={(e) => actualizarPrecio(elemento.id, Number.parseFloat(e.target.value) || 0)}
                      className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                    />
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    Q{elemento.costoGlobal?.toFixed(2) || (elemento.precio * elemento.total).toFixed(2)}
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    Q{elemento.costoUnidad?.toFixed(2) || (elemento.precio * (elemento.rendimiento || 1)).toFixed(2)}
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    {elemento.porcentaje?.toFixed(2) || "0.00"}%
                  </td>
                  <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                    <button onClick={() => eliminarElemento(elemento.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-zinc-700 h-4">
                <td
                  colSpan={6}
                  className="px-0.5 py-0 text-right text-[10px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700"
                >
                  Subtotal:
                </td>
                <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                  -
                </td>
                <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                  Q
                  {elementos
                    .reduce((sum, elemento) => sum + (elemento.costoGlobal || elemento.precio * elemento.total), 0)
                    .toFixed(2)}
                </td>
                <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                  Q
                  {elementos
                    .reduce(
                      (sum, elemento) => sum + (elemento.costoUnidad || elemento.precio * (elemento.rendimiento || 1)),
                      0,
                    )
                    .toFixed(2)}
                </td>
                <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Renderizar resultados de búsqueda para cada familia
  const renderResultadosBusqueda = (tipo: "MT" | "MO" | "EQ", resultados: any[], busqueda: string) => {
    if (!busqueda) return null

    return (
      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md max-h-40 overflow-y-auto mb-2">
        {resultados.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
            {resultados.map((elemento: any) => (
              <li
                key={elemento.id}
                className="p-1.5 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer flex justify-between items-center text-[10px]"
                onClick={() => agregarElemento(tipo, elemento.id)}
              >
                <div>
                  <p className="font-medium">
                    {elemento.codigo} - {tipo === "MO" ? elemento.trabajo : elemento.nombre}
                  </p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">
                    {elemento.unidad} - Q{elemento.precio.toFixed(2)}
                  </p>
                </div>
                <Plus className="h-3 w-3 text-gray-500 dark:text-gray-400" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-1.5 text-[10px] text-gray-500 dark:text-gray-400">No se encontraron resultados</p>
        )}
      </div>
    )
  }

  // También actualizar la fila de entrada para que sea más compacta
  return (
    <div className="space-y-4 relative">
      <Card>
        <CardHeader className="pb-0">
          <div className="flex-1 mb-4">
            <Input
              type="text"
              value={nombreCedula}
              onChange={(e) => setNombreCedula(e.target.value)}
              className="text-xl font-bold h-10"
              placeholder="Nombre de la Cédula"
            />
          </div>

          {/* Panel de totales sticky */}
          <div className="sticky top-0 z-50 bg-white dark:bg-[#0F0F12] border-b border-gray-200 dark:border-zinc-700 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-2 rounded-md">
                <Package className="h-4 w-4 text-blue-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Materiales:</span>
                  <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                    Q{totalMateriales.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-2 rounded-md">
                <HardHat className="h-4 w-4 text-green-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Mano de Obra:</span>
                  <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                    Q{totalManoObra.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-2 rounded-md">
                <Truck className="h-4 w-4 text-amber-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Equipamiento:</span>
                  <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                    Q{totalEquipos.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-2 rounded-md">
                <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Total:</span>
                  <span className="font-bold text-[11px] text-gray-900 dark:text-white">Q{totalCedula.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-2 rounded-md">
                <Calculator className="h-4 w-4 text-purple-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">P/U:</span>
                  <span className="font-bold text-[11px] text-gray-900 dark:text-white">Q{totalPU.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Fila completa con todos los campos como en la imagen - más compacta */}
            <div className="mt-2 border border-gray-200 dark:border-zinc-700 rounded-md overflow-hidden">
              <div className="grid grid-cols-12 gap-0 bg-gray-50 dark:bg-zinc-800 text-[9px] font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-zinc-700 h-4">
                <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">Tarea</div>
                <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center"></div>
                <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">
                  Unidad
                </div>
                <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">Cant</div>
                <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center"></div>
                <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">%IMP</div>
                <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">Q.IMP</div>
                <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">
                  %FACT IND
                </div>
                <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">
                  Q.IND.UTILD
                </div>
                <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">TOTAL</div>
                <div className="px-0.5 py-0 border-r border-gray-200 dark:border-zinc-700 flex items-center">P/U</div>
                <div className="px-0.5 py-0 flex items-center">%INCIDENCIA</div>
              </div>
              <div className="grid grid-cols-12 gap-0 bg-white dark:bg-zinc-900 h-5">
                <div className="p-0 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    placeholder="Ingrese tarea"
                    value={filaTarea}
                    onChange={(e) => setFilaTarea(e.target.value)}
                    disabled={false}
                  />
                </div>
                <div className="p-0 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    placeholder=""
                    value={filaDescripcion}
                    onChange={(e) => setFilaDescripcion(e.target.value)}
                    disabled={false}
                  />
                </div>
                <div className="p-0 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    placeholder="Unidad"
                    value={filaUnidad}
                    onChange={(e) => setFilaUnidad(e.target.value)}
                    disabled={false}
                  />
                </div>
                <div className="p-0 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    type="number"
                    placeholder="0"
                    value={filaCantidad || ""}
                    onChange={(e) => {
                      const newCant = Number(e.target.value) || 0
                      setFilaCantidad(newCant)
                    }}
                    disabled={false}
                  />
                </div>
                <div className="p-0 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    type="number"
                    placeholder=""
                    value={filaPrecioUnitario || ""}
                    onChange={(e) => setFilaPrecioUnitario(Number(e.target.value) || 0)}
                    disabled={false}
                  />
                </div>
                <div className="p-0 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    type="text"
                    placeholder="0%"
                    value={`${filaPorcentajeImp || 0}%`}
                    onChange={(e) => {
                      const value = e.target.value.replace("%", "")
                      setFilaPorcentajeImp(Number(value) || 0)
                    }}
                    disabled={false}
                  />
                </div>
                <div className="p-0 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    type="number"
                    placeholder="0.00"
                    value={filaQImp || ""}
                    onChange={(e) => setFilaQImp(Number(e.target.value) || 0)}
                    readOnly
                    disabled={false}
                  />
                </div>
                <div className="p-0 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    type="text"
                    placeholder="0%"
                    value={`${filaPorcentajeFactInd || 0}%`}
                    onChange={(e) => {
                      const value = e.target.value.replace("%", "")
                      setFilaPorcentajeFactInd(Number(value) || 0)
                    }}
                    disabled={false}
                  />
                </div>
                <div className="p-0 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    type="number"
                    placeholder="0.00"
                    value={filaQIndUtild || ""}
                    onChange={(e) => setFilaQIndUtild(Number(e.target.value) || 0)}
                    readOnly
                    disabled={false}
                  />
                </div>
                <div className="p-0 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    type="number"
                    placeholder="0.00"
                    value={filaTotal || ""}
                    onChange={(e) => setFilaTotal(Number(e.target.value) || 0)}
                    readOnly
                    disabled={false}
                  />
                </div>
                <div className="p-0 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    type="number"
                    placeholder="0.00"
                    value={filaPU || ""}
                    onChange={(e) => setFilaPU(Number(e.target.value) || 0)}
                    readOnly
                    disabled={false}
                  />
                </div>
                <div className="p-0">
                  <Input
                    className="h-5 text-[10px] px-0.5 py-0 leading-none"
                    type="text"
                    placeholder="0%"
                    value={`${filaPorcentajeIncidencia || 0}%`}
                    onChange={(e) => {
                      const value = e.target.value.replace("%", "")
                      setFilaPorcentajeIncidencia(Number(value) || 0)
                    }}
                    readOnly
                    disabled={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Tabs defaultValue="elementos" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="elementos">Elementos</TabsTrigger>
                <TabsTrigger value="informacion">Información</TabsTrigger>
                <TabsTrigger value="factores">Factores</TabsTrigger>
              </TabsList>

              <TabsContent value="elementos" className="space-y-4">
                {/* Sección de Materiales */}
                <div className="border border-gray-200 dark:border-zinc-700 rounded-md p-2">
                  <div className="flex items-center mb-2">
                    <Package className="h-4 w-4 text-blue-500 mr-2" />
                    <h3 className="text-sm font-medium">Materiales (MT)</h3>
                  </div>

                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-1.5 h-3 w-3 text-gray-500 dark:text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar materiales..."
                      className="pl-7 h-6 text-[10px]"
                      value={busquedaMT}
                      onChange={(e) => setBusquedaMT(e.target.value)}
                    />
                  </div>

                  {renderResultadosBusqueda("MT", materialesFiltrados, busquedaMT)}

                  {materialesSeleccionados.length > 0 ? (
                    renderTablaElementos(
                      materialesSeleccionados,
                      "Materiales (MT)",
                      <Package className="h-4 w-4 text-blue-500" />,
                    )
                  ) : (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">
                      No hay materiales en la cédula. Busca y agrega materiales.
                    </p>
                  )}
                </div>

                {/* Sección de Mano de Obra */}
                <div className="border border-gray-200 dark:border-zinc-700 rounded-md p-2">
                  <div className="flex items-center mb-2">
                    <HardHat className="h-4 w-4 text-green-500 mr-2" />
                    <h3 className="text-sm font-medium">Mano de Obra (MO)</h3>
                  </div>

                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-1.5 h-3 w-3 text-gray-500 dark:text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar mano de obra..."
                      className="pl-7 h-6 text-[10px]"
                      value={busquedaMO}
                      onChange={(e) => setBusquedaMO(e.target.value)}
                    />
                  </div>

                  {renderResultadosBusqueda("MO", manoObraFiltrada, busquedaMO)}

                  {manoObraSeleccionada.length > 0 ? (
                    renderTablaElementos(
                      manoObraSeleccionada,
                      "Mano de Obra (MO)",
                      <HardHat className="h-4 w-4 text-green-500" />,
                    )
                  ) : (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">
                      No hay mano de obra en la cédula. Busca y agrega mano de obra.
                    </p>
                  )}
                </div>

                {/* Sección de Equipamiento */}
                <div className="border border-gray-200 dark:border-zinc-700 rounded-md p-2">
                  <div className="flex items-center mb-2">
                    <Truck className="h-4 w-4 text-amber-500 mr-2" />
                    <h3 className="text-sm font-medium">Equipamiento (EQ)</h3>
                  </div>

                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-1.5 h-3 w-3 text-gray-500 dark:text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar equipamiento..."
                      className="pl-7 h-6 text-[10px]"
                      value={busquedaEQ}
                      onChange={(e) => setBusquedaEQ(e.target.value)}
                    />
                  </div>

                  {renderResultadosBusqueda("EQ", equiposFiltrados, busquedaEQ)}

                  {equiposSeleccionados.length > 0 ? (
                    renderTablaElementos(
                      equiposSeleccionados,
                      "Equipamiento (EQ)",
                      <Truck className="h-4 w-4 text-amber-500" />,
                    )
                  ) : (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">
                      No hay equipamiento en la cédula. Busca y agrega equipamiento.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="informacion" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Proyecto</label>
                    <Select value={proyecto} onValueChange={setProyecto}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {proyectosEjemplo.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cliente</label>
                    <Input
                      value={cliente}
                      onChange={(e) => setCliente(e.target.value)}
                      placeholder="Nombre del cliente"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ubicación</label>
                    <Input
                      value={ubicacion}
                      onChange={(e) => setUbicacion(e.target.value)}
                      placeholder="Ubicación del proyecto"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Responsable</label>
                    <Input
                      value={responsable}
                      onChange={(e) => setResponsable(e.target.value)}
                      placeholder="Nombre del responsable"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Notas</label>
                    <Textarea
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      placeholder="Notas adicionales"
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="factores" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Factor de Impuestos (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={factorImpuestos * 100}
                      onChange={(e) => setFactorImpuestos(Number(e.target.value) / 100)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Factor de Indirectos (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={factorIndirectos * 100}
                      onChange={(e) => setFactorIndirectos(Number(e.target.value) / 100)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Factor de Utilidad (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={factorUtilidad * 100}
                      onChange={(e) => setFactorUtilidad(Number(e.target.value) / 100)}
                    />
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <h4 className="text-md font-medium mb-3 flex items-center">
                    <Calculator className="h-4 w-4 mr-2 text-gray-500" />
                    Resumen de Cálculos
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="text-sm font-medium">Q{subtotalCedula.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Impuestos ({(factorImpuestos * 100).toFixed(1)}%):
                      </span>
                      <span className="text-sm font-medium">Q{impuestos.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Indirectos ({(factorIndirectos * 100).toFixed(1)}%):
                      </span>
                      <span className="text-sm font-medium">Q{indirectos.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Utilidad ({(factorUtilidad * 100).toFixed(1)}%):
                      </span>
                      <span className="text-sm font-medium">Q{utilidad.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between">
                        <span className="text-sm font-bold">TOTAL:</span>
                        <span className="text-sm font-bold">Q{totalCedula.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm font-bold">P/U:</span>
                        <span className="text-sm font-bold">Q{totalPU.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Botones de acción */}
            <div className="flex justify-between mt-4">
              <div className="space-x-2">
                <Button variant="outline" onClick={exportarPDF} className="flex items-center h-8 text-[11px]">
                  <Download className="mr-1 h-3 w-3" />
                  Exportar PDF
                </Button>
                <Button variant="outline" onClick={imprimirCedula} className="flex items-center h-8 text-[11px]">
                  <Printer className="mr-1 h-3 w-3" />
                  Imprimir
                </Button>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  className="h-8 text-[11px]"
                  onClick={() => {
                    // Reiniciar el estado de guardado para permitir editar y guardar nuevamente
                    setCedulaGuardada(false)
                  }}
                >
                  {cedulaGuardada ? "Editar" : "Cancelar"}
                </Button>
                <Button
                  onClick={guardarCedula}
                  disabled={elementosSeleccionados.length === 0}
                  className="flex items-center h-8 text-[11px]"
                >
                  {cedulaGuardada ? (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Guardada
                    </>
                  ) : (
                    <>
                      <Save className="mr-1 h-3 w-3" />
                      Guardar Cédula
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

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

// Tipo para la cédula completa
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

export function NuevaCedula() {
  const { toast } = useToast()
  const [nombreCedula, setNombreCedula] = useState("Nueva Cédula")
  const [familiaActiva, setFamiliaActiva] = useState<"MT" | "MO" | "EQ" | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [elementosSeleccionados, setElementosSeleccionados] = useState<ElementoCedula[]>([])
  const [cedulaGuardada, setCedulaGuardada] = useState(false)

  // Información adicional de la cédula
  const [proyecto, setProyecto] = useState("")
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
  const [filaUnidad, setFilaUnidad] = useState<string>("Unidad")
  const [filaCantidad, setFilaCantidad] = useState<number>(0)
  const [filaPrecioUnitario, setFilaPrecioUnitario] = useState<number>(0)
  const [filaPorcentajeImp, setFilaPorcentajeImp] = useState<number>(0)
  const [filaQImp, setFilaQImp] = useState<number>(0)
  const [filaPorcentajeFactInd, setFilaPorcentajeFactInd] = useState<number>(0)
  const [filaQIndUtild, setFilaQIndUtild] = useState<number>(0)
  const [filaTotal, setFilaTotal] = useState<number>(0)
  const [filaPU, setFilaPU] = useState<number>(0)
  const [filaPorcentajeIncidencia, setFilaPorcentajeIncidencia] = useState<number>(0)
  const [filaRendUnidad, setFilaRendUnidad] = useState<number>(1)

  // Calcular el total de insumos como cantidad * rendimiento/unidad
  const filaTotalInsumos = filaCantidad * filaRendUnidad

  // Calcular subtotales por familia
  const totalMateriales = elementosSeleccionados
    .filter((elemento) => elemento.familia === "MT")
    .reduce((sum, elemento) => sum + elemento.total, 0)
  const totalManoObra = elementosSeleccionados
    .filter((elemento) => elemento.familia === "MO")
    .reduce((sum, elemento) => sum + elemento.total, 0)
  const totalEquipos = elementosSeleccionados
    .filter((elemento) => elemento.familia === "EQ")
    .reduce((sum, elemento) => sum + elemento.total, 0)

  // Calcular el total general de la cédula
  const subtotalCedula = totalMateriales + totalManoObra + totalEquipos
  const impuestos = subtotalCedula * factorImpuestos
  const indirectos = subtotalCedula * factorIndirectos
  const utilidad = subtotalCedula * factorUtilidad
  const totalCedula = subtotalCedula + impuestos + indirectos + utilidad

  // Actualizar totales de materiales cuando cambie filaCantidad
  useEffect(() => {
    if (elementosSeleccionados.length > 0) {
      setElementosSeleccionados(
        elementosSeleccionados.map((elemento) => {
          if (elemento.familia === "MT") {
            // Multiplicar solo por rendimiento/unidad * cantidad
            const nuevoTotal = filaRendUnidad * filaCantidad
            return {
              ...elemento,
              total: nuevoTotal,
            }
          }
          return elemento
        }),
      )
    }
  }, [filaCantidad, filaRendUnidad])

  // Función para calcular los porcentajes de incidencia
  useEffect(() => {
    if (elementosSeleccionados.length > 0 && totalCedula > 0) {
      setElementosSeleccionados(
        elementosSeleccionados.map((elemento) => {
          return {
            ...elemento,
            porcentaje: (elemento.total / totalCedula) * 100,
          }
        }),
      )
    }
  }, [elementosSeleccionados.length, totalCedula])

  // Función para guardar la cédula
  const guardarCedula = () => {
    try {
      // Crear objeto de cédula
      const cedula: Cedula = {
        id: Date.now().toString(), // Generar un ID único basado en la fecha actual
        nombre: nombreCedula,
        fecha: new Date().toISOString(),
        elementos: elementosSeleccionados,
        total: totalCedula,
        proyecto,
        cliente,
        ubicacion,
        responsable,
        notas,
      }

      // En una aplicación real, aquí enviaríamos la cédula al backend
      console.log("Cédula guardada:", cedula)

      // Simular guardado exitoso
      setCedulaGuardada(true)
      toast({
        title: "Cédula guardada",
        description: `La cédula "${nombreCedula}" ha sido guardada con éxito.`,
      })

      // Almacenar en localStorage para persistencia (solo para demostración)
      if (typeof window !== "undefined") {
        const cedulasGuardadas = JSON.parse(localStorage.getItem("cedulas") || "[]")
        cedulasGuardadas.push(cedula)
        localStorage.setItem("cedulas", JSON.stringify(cedulasGuardadas))
      }
    } catch (error) {
      console.error("Error al guardar la cédula:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al guardar la cédula. Inténtalo de nuevo.",
      })
    }
  }

  // Función para filtrar elementos según la búsqueda
  const filtrarElementos = (busqueda: string) => {
    if (familiaActiva === "MT") {
      return materialesEjemplo.filter(
        (material) =>
          material.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
          material.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      )
    } else if (familiaActiva === "MO") {
      return manoObraEjemplo.filter(
        (manoObra) =>
          manoObra.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
          manoObra.trabajo.toLowerCase().includes(busqueda.toLowerCase()),
      )
    } else if (familiaActiva === "EQ") {
      return equiposEjemplo.filter(
        (equipo) =>
          equipo.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
          equipo.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      )
    }
    return []
  }

  const elementosFiltrados = filtrarElementos(busqueda)

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
    }
    // Limpiar búsqueda después de agregar
    setBusqueda("")
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
        <div className="mb-6">
          <div className="flex items-center mb-2">
            {icono}
            <h3 className="text-lg font-medium ml-2">{titulo}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-700">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Familia
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rend/hora
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mx/hora
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Unidad
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rend/Unidad
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total insumos
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Costo global
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Costo unidad
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    %
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                {elementos.map((elemento) => (
                  <tr key={elemento.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {elemento.codigo}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {elemento.familia}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300">
                      <Textarea
                        value={elemento.descripcion}
                        onChange={(e) => actualizarDescripcion(elemento.id, e.target.value)}
                        className="min-h-[60px] w-full text-sm"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={elemento.rendHora || 1}
                        onChange={(e) => actualizarRendHora(elemento.id, Number.parseFloat(e.target.value) || 1)}
                        className="w-20 h-8 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={elemento.mxHora || 0}
                        onChange={(e) => actualizarMxHora(elemento.id, Number.parseFloat(e.target.value) || 0)}
                        className="w-20 h-8 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <Input
                        type="text"
                        value={elemento.unidad}
                        onChange={(e) => actualizarUnidad(elemento.id, e.target.value)}
                        className="w-20 h-8 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={elemento.rendimiento || 1}
                        onChange={(e) => actualizarRendimiento(elemento.id, Number.parseFloat(e.target.value) || 1)}
                        className="w-20 h-8 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {elemento.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={elemento.precio}
                        onChange={(e) => actualizarPrecio(elemento.id, Number.parseFloat(e.target.value) || 0)}
                        className="w-24 h-8 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      Q{elemento.precio * elemento.total}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      Q{elemento.costoUnidad?.toFixed(2) || (elemento.precio * (elemento.rendimiento || 1)).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {elemento.porcentaje?.toFixed(2) || "0.00"}%
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <button onClick={() => eliminarElemento(elemento.id)} className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-zinc-700">
                  <td colSpan={12} className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Subtotal:
                  </td>
                  <td className="px-4 py-2 text-sm font-bold text-gray-900 dark:text-white">
                    Q{elementos.reduce((sum, elemento) => sum + elemento.total, 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    // Para materiales y mano de obra, mantener la tabla original
    return (
      <div className="mb-6">
        <div className="flex items-center mb-2">
          {icono}
          <h3 className="text-lg font-medium ml-2">{titulo}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-700">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Familia
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rend/Unidad
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total insumos
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Costo global
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Costo unidad
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  %
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
              {elementos.map((elemento) => (
                <tr key={elemento.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {elemento.codigo}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {elemento.familia}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300">
                    <Textarea
                      value={elemento.descripcion}
                      onChange={(e) => actualizarDescripcion(elemento.id, e.target.value)}
                      className="min-h-[60px] w-full text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <Input
                      type="text"
                      value={elemento.unidad}
                      onChange={(e) => actualizarUnidad(elemento.id, e.target.value)}
                      className="w-20 h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={elemento.rendimiento || 1}
                      onChange={(e) => actualizarRendimiento(elemento.id, Number.parseFloat(e.target.value) || 1)}
                      className="w-20 h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {elemento.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={elemento.precio}
                      onChange={(e) => actualizarPrecio(elemento.id, Number.parseFloat(e.target.value) || 0)}
                      className="w-24 h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Q{elemento.precio * elemento.total}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Q{elemento.costoUnidad?.toFixed(2) || (elemento.precio * (elemento.rendimiento || 1)).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {elemento.porcentaje?.toFixed(2) || "0.00"}%
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <button onClick={() => eliminarElemento(elemento.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-zinc-700">
                <td colSpan={10} className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                  Subtotal:
                </td>
                <td className="px-4 py-2 text-sm font-bold text-gray-900 dark:text-white">
                  Q{elementos.reduce((sum, elemento) => sum + elemento.total, 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
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
          <div className="sticky top-0 z-50 bg-white dark:bg-[#0F0F12] border-b border-gray-200 dark:border-zinc-700 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-3 rounded-md">
                <Package className="h-5 w-5 text-blue-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Materiales:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Q{totalMateriales.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-3 rounded-md">
                <HardHat className="h-5 w-5 text-green-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Mano de Obra:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Q{totalManoObra.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-3 rounded-md">
                <Truck className="h-5 w-5 text-amber-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Equipamiento:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Q{totalEquipos.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-3 rounded-md">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Total de la Cédula:</span>
                  <span className="font-bold text-gray-900 dark:text-white">Q{totalCedula.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Fila completa con todos los campos como en la imagen */}

            <div className="mt-4 border border-gray-200 dark:border-zinc-700 rounded-md overflow-hidden">
              <div className="grid grid-cols-12 gap-0 bg-gray-50 dark:bg-zinc-800 text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-zinc-700">
                <div className="p-2 border-r border-gray-200 dark:border-zinc-700">Tarea</div>
                <div className="p-2 border-r border-gray-200 dark:border-zinc-700"></div>
                <div className="p-2 border-r border-gray-200 dark:border-zinc-700">Unidad</div>
                <div className="p-2 border-r border-gray-200 dark:border-zinc-700">Cant</div>
                <div className="p-2 border-r border-gray-200 dark:border-zinc-700"></div>
                <div className="p-2 border-r border-gray-200 dark:border-zinc-700">%IMP</div>
                <div className="p-2 border-r border-gray-200 dark:border-zinc-700">Q.IMP</div>
                <div className="p-2 border-r border-gray-200 dark:border-zinc-700">%FACT IND</div>
                <div className="p-2 border-r border-gray-200 dark:border-zinc-700">Q.IND.UTILD</div>
                <div className="p-2 border-r border-gray-200 dark:border-zinc-700">TOTAL</div>
                <div className="p-2 border-r border-gray-200 dark:border-zinc-700">P/U</div>
                <div className="p-2">%INCIDENCIA</div>
              </div>
              <div className="grid grid-cols-12 gap-0 bg-white dark:bg-zinc-900">
                <div className="p-1 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-8 text-xs"
                    placeholder="Ingrese tarea"
                    value={filaTarea}
                    onChange={(e) => setFilaTarea(e.target.value)}
                  />
                </div>
                <div className="p-1 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-8 text-xs"
                    placeholder=""
                    value={filaDescripcion}
                    onChange={(e) => setFilaDescripcion(e.target.value)}
                  />
                </div>
                <div className="p-1 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-8 text-xs"
                    placeholder="Unidad"
                    value={filaUnidad}
                    onChange={(e) => setFilaUnidad(e.target.value)}
                  />
                </div>
                <div className="p-1 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-8 text-xs"
                    type="number"
                    placeholder="0"
                    value={filaCantidad || ""}
                    onChange={(e) => {
                      const newCant = Number(e.target.value) || 0
                      setFilaCantidad(newCant)
                    }}
                  />
                </div>
                <div className="p-1 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-8 text-xs"
                    type="number"
                    placeholder=""
                    value={filaPrecioUnitario || ""}
                    onChange={(e) => setFilaPrecioUnitario(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="p-1 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-8 text-xs"
                    type="text"
                    placeholder="0%"
                    value={`${filaPorcentajeImp || 0}%`}
                    onChange={(e) => {
                      const value = e.target.value.replace("%", "")
                      setFilaPorcentajeImp(Number(value) || 0)
                    }}
                  />
                </div>
                <div className="p-1 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-8 text-xs"
                    type="number"
                    placeholder="0.00"
                    value={filaQImp || ""}
                    onChange={(e) => setFilaQImp(Number(e.target.value) || 0)}
                    readOnly
                  />
                </div>
                <div className="p-1 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-8 text-xs"
                    type="text"
                    placeholder="0%"
                    value={`${filaPorcentajeFactInd || 0}%`}
                    onChange={(e) => {
                      const value = e.target.value.replace("%", "")
                      setFilaPorcentajeFactInd(Number(value) || 0)
                    }}
                  />
                </div>
                <div className="p-1 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-8 text-xs"
                    type="number"
                    placeholder="0.00"
                    value={filaQIndUtild || ""}
                    onChange={(e) => setFilaQIndUtild(Number(e.target.value) || 0)}
                    readOnly
                  />
                </div>
                <div className="p-1 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-8 text-xs"
                    type="number"
                    placeholder="0.00"
                    value={filaTotal || ""}
                    onChange={(e) => setFilaTotal(Number(e.target.value) || 0)}
                    readOnly
                  />
                </div>
                <div className="p-1 border-r border-gray-200 dark:border-zinc-700">
                  <Input
                    className="h-8 text-xs"
                    type="number"
                    placeholder="0.00"
                    value={filaPU || ""}
                    onChange={(e) => setFilaPU(Number(e.target.value) || 0)}
                    readOnly
                  />
                </div>
                <div className="p-1">
                  <Input
                    className="h-8 text-xs"
                    type="text"
                    placeholder="0%"
                    value={`${filaPorcentajeIncidencia || 0}%`}
                    onChange={(e) => {
                      const value = e.target.value.replace("%", "")
                      setFilaPorcentajeIncidencia(Number(value) || 0)
                    }}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs defaultValue="elementos" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="elementos">Elementos</TabsTrigger>
                <TabsTrigger value="informacion">Información</TabsTrigger>
                <TabsTrigger value="factores">Factores</TabsTrigger>
              </TabsList>

              <TabsContent value="elementos" className="space-y-4">
                {/* Botones de familia */}
                <div className="flex space-x-2">
                  <Button
                    variant={familiaActiva === "MT" ? "default" : "outline"}
                    onClick={() => setFamiliaActiva("MT")}
                    className="flex items-center"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Materiales (MT)
                  </Button>
                  <Button
                    variant={familiaActiva === "MO" ? "default" : "outline"}
                    onClick={() => setFamiliaActiva("MO")}
                    className="flex items-center"
                  >
                    <HardHat className="mr-2 h-4 w-4" />
                    Mano de Obra (MO)
                  </Button>
                  <Button
                    variant={familiaActiva === "EQ" ? "default" : "outline"}
                    onClick={() => setFamiliaActiva("EQ")}
                    className="flex items-center"
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Equipamiento (EQ)
                  </Button>
                </div>

                {/* Búsqueda */}
                {familiaActiva && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Buscar por código o nombre..."
                          className="pl-9"
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Resultados de búsqueda */}
                    {busqueda && (
                      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md max-h-60 overflow-y-auto">
                        {elementosFiltrados.length > 0 ? (
                          <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
                            {elementosFiltrados.map((elemento: any) => (
                              <li
                                key={elemento.id}
                                className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer flex justify-between items-center"
                                onClick={() => agregarElemento(familiaActiva, elemento.id)}
                              >
                                <div>
                                  <p className="font-medium text-sm">
                                    {elemento.codigo} - {familiaActiva === "MO" ? elemento.trabajo : elemento.nombre}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {elemento.unidad} - Q{elemento.precio.toFixed(2)}
                                  </p>
                                </div>
                                <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="p-3 text-sm text-gray-500 dark:text-gray-400">No se encontraron resultados</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Elementos seleccionados por familia */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Elementos de la Cédula</h3>

                  {elementosSeleccionados.length > 0 ? (
                    <div>
                      {/* Materiales */}
                      {renderTablaElementos(
                        materialesSeleccionados,
                        "Materiales (MT)",
                        <Package className="h-5 w-5 text-blue-500" />,
                      )}

                      {/* Mano de Obra */}
                      {renderTablaElementos(
                        manoObraSeleccionada,
                        "Mano de Obra (MO)",
                        <HardHat className="h-5 w-5 text-green-500" />,
                      )}

                      {/* Equipamiento */}
                      {renderTablaElementos(
                        equiposSeleccionados,
                        "Equipamiento (EQ)",
                        <Truck className="h-5 w-5 text-amber-500" />,
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No hay elementos en la cédula. Selecciona una familia y busca elementos para agregarlos.
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
                    <Calculator className="h-5 w-5 mr-2 text-gray-500" />
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
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Botones de acción */}
            <div className="flex justify-between mt-6">
              <div className="space-x-2">
                <Button variant="outline" onClick={exportarPDF} className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button variant="outline" onClick={imprimirCedula} className="flex items-center">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
              </div>
              <div className="space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button
                  onClick={guardarCedula}
                  disabled={elementosSeleccionados.length === 0 || cedulaGuardada}
                  className="flex items-center"
                >
                  {cedulaGuardada ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Guardada
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
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

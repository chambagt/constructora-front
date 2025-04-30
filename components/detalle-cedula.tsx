"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Package, HardHat, Truck, ArrowLeft, Calculator, Pencil, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

// Tipo para los elementos de la cédula
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

// Actualizar el tipo Cedula para incluir la información de la fila de tarea
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

// Proyectos de ejemplo
const proyectosEjemplo = [
  { id: "1", nombre: "Edificio Residencial Torres del Valle" },
  { id: "2", nombre: "Centro Comercial Plaza Central" },
  { id: "3", nombre: "Puente Río Grande" },
  { id: "4", nombre: "Escuela Municipal San Pedro" },
  { id: "5", nombre: "Hospital Regional" },
]

interface DetalleCedulaProps {
  cedulaId: string
  onBack: () => void
}

export function DetalleCedula({ cedulaId, onBack }: DetalleCedulaProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [cedula, setCedula] = useState<Cedula | null>(null)
  const [loading, setLoading] = useState(true)
  const [modoEdicion, setModoEdicion] = useState(false)

  // Estados para edición
  const [nombreCedula, setNombreCedula] = useState("")
  const [proyecto, setProyecto] = useState("")
  const [cliente, setCliente] = useState("")
  const [ubicacion, setUbicacion] = useState("")
  const [responsable, setResponsable] = useState("")
  const [notas, setNotas] = useState("")
  const [elementosEditados, setElementosEditados] = useState<ElementoCedula[]>([])

  // Estados para la fila de tarea
  const [filaTarea, setFilaTarea] = useState<string>("")
  const [filaDescripcion, setFilaDescripcion] = useState<string>("")
  const [filaUnidad, setFilaUnidad] = useState<string>("")
  const [filaCantidad, setFilaCantidad] = useState<number>(0)
  const [filaRendUnidad, setFilaRendUnidad] = useState<number>(0)

  // Estados calculados para la fila de tarea
  const [filaPrecioUnitario, setFilaPrecioUnitario] = useState<number>(0)
  const [filaPorcentajeImp, setFilaPorcentajeImp] = useState<number>(0)
  const [filaQImp, setFilaQImp] = useState<number>(0)
  const [filaPorcentajeFactInd, setFilaPorcentajeFactInd] = useState<number>(0)
  const [filaQIndUtild, setFilaQIndUtild] = useState<number>(0)
  const [filaTotal, setFilaTotal] = useState<number>(0)
  const [filaPU, setFilaPU] = useState<number>(0)
  const [filaPorcentajeIncidencia, setFilaPorcentajeIncidencia] = useState<number>(0)

  // Calcular el total de insumos como cantidad * rendimiento/unidad
  const calcularTotalInsumos = (cantidad: number, rendUnidad: number) => {
    return cantidad * rendUnidad;
  }

  useEffect(() => {
    // Cargar la cédula desde localStorage
    if (typeof window !== "undefined") {
      const cedulasGuardadas = JSON.parse(localStorage.getItem("cedulas") || "[]")
      const cedulaEncontrada = cedulasGuardadas.find((c: Cedula) => c.id === cedulaId)

      if (cedulaEncontrada) {
        setCedula(cedulaEncontrada)
        // Inicializar estados de edición
        setNombreCedula(cedulaEncontrada.nombre)
        setProyecto(cedulaEncontrada.proyecto || "")
        setCliente(cedulaEncontrada.cliente || "")
        setUbicacion(cedulaEncontrada.ubicacion || "")
        setResponsable(cedulaEncontrada.responsable || "")
        setNotas(cedulaEncontrada.notas || "")
        setElementosEditados([...cedulaEncontrada.elementos])

        // Inicializar estados de la fila de tarea
        setFilaTarea(cedulaEncontrada.filaTarea || "")
        setFilaDescripcion(cedulaEncontrada.filaDescripcion || "")
        setFilaUnidad(cedulaEncontrada.filaUnidad || "")
        setFilaCantidad(cedulaEncontrada.filaCantidad || 0)
        setFilaRendUnidad(cedulaEncontrada.filaRendUnidad || 0)

        // Calcular valores derivados
        const totalInsumos = calcularTotalInsumos(cedulaEncontrada.filaCantidad || 0, cedulaEncontrada.filaRendUnidad || 0)
        setFilaTotal(totalInsumos)

        // Valores simulados para los campos calculados
        if (totalInsumos > 0) {
          setFilaPrecioUnitario(cedulaEncontrada.total / totalInsumos || 0)
          setFilaPU(cedulaEncontrada.total / (cedulaEncontrada.filaCantidad || 1) || 0)
        }

        // Impuestos y factores (simulados)
        setFilaQImp(cedulaEncontrada.total * 0.12 || 0) // 12% de impuestos
        setFilaQIndUtild(cedulaEncontrada.total * 0.15 || 0) // 15% de indirectos
        setFilaPorcentajeImp(12)
        setFilaPorcentajeFactInd(15)
        setFilaPorcentajeIncidencia(100) // 100% si es la única tarea
      }

      setLoading(false)
    }
  }, [cedulaId])

  // Calcular subtotales por familia
  const totalMateriales = modoEdicion
    ? elementosEditados
        .filter((elemento) => elemento.familia === "MT")
        .reduce((sum, elemento) => sum + (elemento.total || 0), 0)
    : cedula?.elementos
        .filter((elemento) => elemento.familia === "MT")
        .reduce((sum, elemento) => sum + (elemento.total || 0), 0) || 0

  const totalManoObra = modoEdicion
    ? elementosEditados
        .filter((elemento) => elemento.familia === "MO")
        .reduce((sum, elemento) => sum + (elemento.total || 0), 0)
    : cedula?.elementos
        .filter((elemento) => elemento.familia === "MO")
        .reduce((sum, elemento) => sum + (elemento.total || 0), 0) || 0

  const totalEquipos = modoEdicion
    ? elementosEditados
        .filter((elemento) => elemento.familia === "EQ")
        .reduce((sum, elemento) => sum + (elemento.total || 0), 0)
    : cedula?.elementos
        .filter((elemento) => elemento.familia === "EQ")
        .reduce((sum, elemento) => sum + (elemento.total || 0), 0) || 0

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

  // Función para editar cédula completa
  const editarCedulaCompleta = () => {
    router.push(`/cedulas/editar/${cedulaId}`)
  }

  // Función para guardar cambios
  const guardarCambios = () => {
    if (!cedula) return

    if (!nombreCedula) {
      toast({
        title: "Error",
        description: "El nombre de la cédula es obligatorio.",
        variant: "destructive",
      })
      return
    }

    // Calcular el nuevo total de la cédula
    const nuevoTotal = elementosEditados.reduce((sum, elemento) => sum + (elemento.total || 0), 0)

    const cedulaActualizada: Cedula = {
      ...cedula,
      nombre: nombreCedula,
      proyecto,
      cliente,
      ubicacion,
      responsable,
      notas,
      elementos: elementosEditados,
      total: nuevoTotal,
      fecha: new Date().toISOString(),
      // Guardar la información de la fila de tarea
      filaTarea,
      filaDescripcion,
      filaUnidad,
      filaCantidad,
      filaRendUnidad,
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      const cedulasGuardadas = JSON.parse(localStorage.getItem("cedulas") || "[]")
      const cedulasActualizadas = cedulasGuardadas.map((c: Cedula) => (c.id === cedulaId ? cedulaActualizada : c))
      localStorage.setItem("cedulas", JSON.stringify(cedulasActualizadas))
    }

    // Actualizar estado
    setCedula(cedulaActualizada)
    setModoEdicion(false)

    toast({
      title: "Cambios guardados",
      description: "Los cambios en la cédula han sido guardados con éxito.",
    })
  }

  // Función para actualizar la descripción de un elemento
  const actualizarDescripcion = (id: string, descripcion: string) => {
    setElementosEditados(
      elementosEditados.map((elemento) => {
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

  // Función para actualizar el precio de un elemento
  const actualizarPrecio = (id: string, precio: number) => {
    setElementosEditados(
      elementosEditados.map((elemento) => {
        if (elemento.id === id) {
          const nuevoPrecio = Math.max(0, precio)
          const rendimiento = elemento.rendimiento || 1
          const cantidad = elemento.cantidad || 0
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

  // Función para actualizar el rendimiento de un elemento
  const actualizarRendimiento = (id: string, rendimiento: number) => {
    setElementosEditados(
      elementosEditados.map((elemento) => {
        if (elemento.id === id) {
          const nuevoRendimiento = Math.max(0.01, rendimiento)
          const cantidad = elemento.cantidad || 0
          const totalInsumos = nuevoRendimiento * cantidad
          const costoGlobal = (elemento.precio || 0) * totalInsumos
          const costoUnidad = (elemento.precio || 0) * nuevoRendimiento
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

  // Función para actualizar la cantidad de un elemento
  const actualizarCantidad = (id: string, cantidad: number) => {
    setElementosEditados(
      elementosEditados.map((elemento) => {
        if (elemento.id === id) {
          const nuevaCantidad = Math.max(0, cantidad)
          const rendimiento = elemento.rendimiento || 1
          const totalInsumos = rendimiento * nuevaCantidad
          const costoGlobal = (elemento.precio || 0) * totalInsumos
          const costoUnidad = (elemento.precio || 0) * rendimiento
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

  // Función para actualizar la unidad de un elemento
  const actualizarUnidad = (id: string, unidad: string) => {
    setElementosEditados(
      elementosEditados.map((elemento) => {
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

  // Agregar funciones para actualizar los nuevos campos
  const actualizarRendHora = (id: string, rendHora: number) => {
    setElementosEditados(
      elementosEditados.map((elemento) => {
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
    setElementosEditados(
      elementosEditados.map((elemento) => {
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

  // Actualizar cálculos cuando cambian los valores de la fila de tarea
  useEffect(() => {
    if (filaCantidad && filaRendUnidad) {
      const totalInsumos = calcularTotalInsumos(filaCantidad, filaRendUnidad)
      setFilaTotal(totalInsumos)

      // Actualizar precio unitario si hay un total de cédula
      if (cedula?.total && totalInsumos > 0) {
        setFilaPrecioUnitario(cedula.total / totalInsumos)
        setFilaPU(cedula.total / filaCantidad)
      }

      // Actualizar impuestos y factores
      if (cedula?.total) {
        setFilaQImp(cedula.total * (filaPorcentajeImp / 100))
        setFilaQIndUtild(cedula.total * (filaPorcentajeFactInd / 100))
      }
    }
  }, [filaCantidad, filaRendUnidad, cedula?.total, filaPorcentajeImp, filaPorcentajeFactInd])

  if (loading) {
    return <div className="text-center py-10">Cargando detalles de la cédula...</div>
  }

  if (!cedula) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">No se encontró la cédula solicitada.</p>
        <Button onClick={onBack}>Volver a la lista</Button>
      </div>
    )
  }

  // Filtrar elementos por familia
  const materialesSeleccionados = modoEdicion
    ? elementosEditados.filter((elemento) => elemento.familia === "MT")
    : cedula.elementos.filter((elemento) => elemento.familia === "MT")

  const manoObraSeleccionada = modoEdicion
    ? elementosEditados.filter((elemento) => elemento.familia === "MO")
    : cedula.elementos.filter((elemento) => elemento.familia === "MO")

  const equiposSeleccionados = modoEdicion
    ? elementosEditados.filter((elemento) => elemento.familia === "EQ")
    : cedula.elementos.filter((elemento) => elemento.familia === "EQ")

  // Calcular el total de insumos para la fila de tarea
  const totalInsumosFila = calcularTotalInsumos(cedula.filaCantidad || 0, cedula.filaRendUnidad || 0)

  return (
    <div className="space-y-6 relative pb-20">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h2 className="text-2xl font-bold flex-1">{cedula.nombre}</h2>
        {!modoEdicion ? (
          <div className="flex space-x-2">
            <Button onClick={editarCedulaCompleta} variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Editar Cédula Completa
            </Button>
            <Button onClick={() => setModoEdicion(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setModoEdicion(false)}>
              Cancelar
            </Button>
            <Button onClick={guardarCambios}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>

      {modoEdicion && (
        <div className="mb-4">
          <Input
            type="text"
            value={nombreCedula}
            onChange={(e) => setNombreCedula(e.target.value)}
            className="text-xl font-bold h-10 mb-4"
            placeholder="Nombre de la Cédula"
          />
        </div>
      )}

      <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg mb-4">
        <div className="text-sm mb-2">Fecha: {new Date(cedula.fecha).toLocaleDateString()}</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded-md">
            <Package className="h-4 w-4 text-blue-500 mr-2" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Materiales:</span>
              <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                Q{(totalMateriales || 0).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded-md">
            <HardHat className="h-4 w-4 text-green-500 mr-2" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Mano de Obra:</span>
              <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                Q{(totalManoObra || 0).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded-md">
            <Truck className="h-4 w-4 text-amber-500 mr-2" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Equipamiento:</span>
              <span className="font-medium text-[11px] text-gray-900 dark:text-white">
                Q{(totalEquipos || 0).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded-md">
            <Calculator className="h-4 w-4 text-green-500 mr-2" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Total de la Cédula:</span>
              <span className="font-bold text-[11px] text-gray-900 dark:text-white">
                Q{(cedula.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fila de tareas - estilo exacto como en la imagen */}
      <table className="w-full border border-gray-200 dark:border-zinc-700 text-[10px] mb-4">
        <thead>
          <tr className="bg-gray-50 dark:bg-zinc-800 h-6">
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              Tarea
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              Unidad
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              Cant
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              %IMP
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              Q.IMP
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              %FACT IND
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              Q.IND.UTILD
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              TOTAL
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
              P/U
            </th>
            <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-700 dark:text-gray-300">
              %INCIDENCIA
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white dark:bg-zinc-900 h-6">
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{cedula?.filaTarea || "-"}</td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{cedula?.filaUnidad || "-"}</td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{cedula?.filaCantidad || "0"}</td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{filaPorcentajeImp || "0"}%</td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">
              {filaQImp ? filaQImp.toFixed(2) : "0.00"}
            </td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{filaPorcentajeFactInd || "0"}%</td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">
              {filaQIndUtild ? filaQIndUtild.toFixed(2) : "0.00"}
            </td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 font-medium">
              {totalInsumosFila.toFixed(2)}
            </td>
            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">
              {filaPU ? filaPU.toFixed(2) : "0.00"}
            </td>
            <td className="px-2 py-1">{filaPorcentajeIncidencia ? filaPorcentajeIncidencia.toFixed(2) : "0.00"}%</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-4">Detalles de la Cédula</h2>
        <Tabs defaultValue="elementos" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="elementos">Elementos</TabsTrigger>
            <TabsTrigger value="detalles">Detalles</TabsTrigger>
            <TabsTrigger value="analisis">Análisis</TabsTrigger>
          </TabsList>
          <TabsContent value="elementos" className="mt-0">
            {/* Sección de Materiales */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Package className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-md font-medium">Materiales (MT)</h3>
              </div>

              {materialesSeleccionados.length > 0 ? (
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
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y-0 divide-gray-200 dark:divide-zinc-700">
                      {materialesSeleccionados.map((elemento) => (
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
                            {modoEdicion ? (
                              <Textarea
                                value={elemento.descripcion}
                                onChange={(e) => actualizarDescripcion(elemento.id, e.target.value)}
                                className="min-h-[18px] h-4 w-full text-[10px] p-0.5 resize-none leading-tight"
                              />
                            ) : (
                              elemento.descripcion
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {modoEdicion ? (
                              <Input
                                type="text"
                                value={elemento.unidad}
                                onChange={(e) => actualizarUnidad(elemento.id, e.target.value)}
                                className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                              />
                            ) : (
                              elemento.unidad
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {modoEdicion ? (
                              <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={elemento.rendimiento || 1}
                                onChange={(e) =>
                                  actualizarRendimiento(elemento.id, Number.parseFloat(e.target.value) || 1)
                                }
                                className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                              />
                            ) : (
                              elemento.rendimiento || 1
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.total || 0).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {modoEdicion ? (
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={elemento.precio}
                                onChange={(e) => actualizarPrecio(elemento.id, Number.parseFloat(e.target.value) || 0)}
                                className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                              />
                            ) : (
                              `Q${(elemento.precio || 0).toFixed(2)}`
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoUnidad || (elemento.precio || 0) * (elemento.rendimiento || 1)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.porcentaje || 0).toFixed(2)}%
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
                          Q{materialesSeleccionados.reduce((sum, elemento) => sum + ((elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0))), 0).toFixed(2)}
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          -
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white">
                          Q
                          {materialesSeleccionados.reduce((sum, elemento) => sum + (elemento.total || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay materiales en esta cédula.</p>
              )}
            </div>

            {/* Sección de Mano de Obra */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <HardHat className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-md font-medium">Mano de Obra (MO)</h3>
              </div>

              {manoObraSeleccionada.length > 0 ? (
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
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y-0 divide-gray-200 dark:divide-zinc-700">
                      {manoObraSeleccionada.map((elemento) => (
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
                            {modoEdicion ? (
                              <Textarea
                                value={elemento.descripcion}
                                onChange={(e) => actualizarDescripcion(elemento.id, e.target.value)}
                                className="min-h-[18px] h-4 w-full text-[10px] p-0.5 resize-none leading-tight"
                              />
                            ) : (
                              elemento.descripcion
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {modoEdicion ? (
                              <Input
                                type="text"
                                value={elemento.unidad}
                                onChange={(e) => actualizarUnidad(elemento.id, e.target.value)}
                                className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                              />
                            ) : (
                              elemento.unidad
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {modoEdicion ? (
                              <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={elemento.rendimiento || 1}
                                onChange={(e) =>
                                  actualizarRendimiento(elemento.id, Number.parseFloat(e.target.value) || 1)
                                }
                                className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                              />
                            ) : (
                              elemento.rendimiento || 1
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.total || 0).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {modoEdicion ? (
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={elemento.precio}
                                onChange={(e) => actualizarPrecio(elemento.id, Number.parseFloat(e.target.value) || 0)}
                                className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                              />
                            ) : (
                              `Q${(elemento.precio || 0).toFixed(2)}`
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoUnidad || (elemento.precio || 0) * (elemento.rendimiento || 1)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.porcentaje || 0).toFixed(2)}%
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
                          Q{manoObraSeleccionada.reduce((sum, elemento) => sum + ((elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0))), 0).toFixed(2)}
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          -
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white">
                          Q{manoObraSeleccionada.reduce((sum, elemento) => sum + (elemento.total || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay mano de obra en esta cédula.</p>
              )}
            </div>

            {/* Sección de Equipamiento */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Truck className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="text-md font-medium">Equipamiento (EQ)</h3>
              </div>

              {equiposSeleccionados.length > 0 ? (
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
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y-0 divide-gray-200 dark:divide-zinc-700">
                      {equiposSeleccionados.map((elemento) => (
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
                            {modoEdicion ? (
                              <Textarea
                                value={elemento.descripcion}
                                onChange={(e) => actualizarDescripcion(elemento.id, e.target.value)}
                                className="min-h-[18px] h-4 w-full text-[10px] p-0.5 resize-none leading-tight"
                              />
                            ) : (
                              elemento.descripcion
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {modoEdicion ? (
                              <Input
                                type="text"
                                value={elemento.unidad}
                                onChange={(e) => actualizarUnidad(elemento.id, e.target.value)}
                                className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                              />
                            ) : (
                              elemento.unidad
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {modoEdicion ? (
                              <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={elemento.rendimiento || 1}
                                onChange={(e) =>
                                  actualizarRendimiento(elemento.id, Number.parseFloat(e.target.value) || 1)
                                }
                                className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                              />
                            ) : (
                              elemento.rendimiento || 1
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.total || 0).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {modoEdicion ? (
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={elemento.precio}
                                onChange={(e) => actualizarPrecio(elemento.id, Number.parseFloat(e.target.value) || 0)}
                                className="w-12 h-4 text-[10px] px-0.5 py-0 leading-none"
                              />
                            ) : (
                              `Q${(elemento.precio || 0).toFixed(2)}`
                            )}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            Q{(elemento.costoUnidad || (elemento.precio || 0) * (elemento.rendimiento || 1)).toFixed(2)}
                          </td>
                          <td className="px-0.5 py-0 whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-300 border-r border-gray-200 dark:border-zinc-700">
                            {(elemento.porcentaje || 0).toFixed(2)}%
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
                          Q{equiposSeleccionados.reduce((sum, elemento) => sum + ((elemento.costoGlobal || (elemento.precio || 0) * (elemento.total || 0))), 0).toFixed(2)}
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-zinc-700">
                          -
                        </td>
                        <td className="px-0.5 py-0 text-[10px] font-bold text-gray-900 dark:text-white">
                          Q{equiposSeleccionados.reduce((sum, elemento) => sum + (elemento.total || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay equipamiento en esta cédula.</p>
              )}
            </div>\
\

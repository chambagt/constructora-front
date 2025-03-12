"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Package, HardHat, Truck, Search, X, Plus, DollarSign, Save, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

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
}

// Tipo para los elementos seleccionados en la cédula
type ElementoCedula = {
  id: string
  codigo: string
  familia: string
  descripcion: string
  unidad: string
  precio: number
  cantidad: number
  total: number
}

// Tipo para la cédula completa
type Cedula = {
  id: string
  nombre: string
  fecha: string
  elementos: ElementoCedula[]
  total: number
}

// Datos de ejemplo
const materialesEjemplo: Material[] = [
  { id: "1", codigo: "MAT-001", familia: "MT", nombre: "Cemento Portland", unidad: "saco", precio: 85.5 },
  { id: "2", codigo: "MAT-002", familia: "MT", nombre: "Arena de río", unidad: "m³", precio: 150.0 },
  { id: "3", codigo: "MAT-003", familia: "MT", nombre: 'Varilla de acero 3/8"', unidad: "unidad", precio: 45.75 },
  { id: "4", codigo: "MAT-004", familia: "MT", nombre: "Bloque de concreto", unidad: "unidad", precio: 8.25 },
  { id: "5", codigo: "MAT-005", familia: "MT", nombre: "Madera para encofrado", unidad: "pie²", precio: 12.5 },
]

const manoObraEjemplo: ManoObra[] = [
  { id: "1", codigo: "MO-001", familia: "MO", trabajo: "Albañilería", unidad: "día", precio: 150.0 },
  { id: "2", codigo: "MO-002", familia: "MO", trabajo: "Electricista", unidad: "hora", precio: 75.5 },
  { id: "3", codigo: "MO-003", familia: "MO", trabajo: "Pintura", unidad: "m²", precio: 25.0 },
  { id: "4", codigo: "MO-004", familia: "MO", trabajo: "Plomería", unidad: "hora", precio: 80.0 },
  { id: "5", codigo: "MO-005", familia: "MO", trabajo: "Carpintería", unidad: "día", precio: 200.0 },
]

const equiposEjemplo: Equipo[] = [
  { id: "1", codigo: "EQ-001", familia: "EQ", nombre: "Excavadora", unidad: "hora", precio: 350.0 },
  { id: "2", codigo: "EQ-002", familia: "EQ", nombre: "Mezcladora de concreto", unidad: "día", precio: 200.0 },
  { id: "3", codigo: "EQ-003", familia: "EQ", nombre: "Andamio", unidad: "día", precio: 50.0 },
  { id: "4", codigo: "EQ-004", familia: "EQ", nombre: "Compactadora", unidad: "día", precio: 180.0 },
  { id: "5", codigo: "EQ-005", familia: "EQ", nombre: "Generador eléctrico", unidad: "día", precio: 120.0 },
]

export function NuevaCedula() {
  const { toast } = useToast()
  const [nombreCedula, setNombreCedula] = useState("Nueva Cédula")
  const [familiaActiva, setFamiliaActiva] = useState<"MT" | "MO" | "EQ" | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [elementosSeleccionados, setElementosSeleccionados] = useState<ElementoCedula[]>([])
  const [cedulaGuardada, setCedulaGuardada] = useState(false)

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

  // Función para agregar un elemento a la cédula
  const agregarElemento = (tipo: "MT" | "MO" | "EQ", id: string) => {
    let elemento
    if (tipo === "MT") {
      elemento = materialesEjemplo.find((m) => m.id === id)
      if (elemento) {
        const nuevoElemento: ElementoCedula = {
          id: elemento.id,
          codigo: elemento.codigo,
          familia: elemento.familia,
          descripcion: elemento.nombre,
          unidad: elemento.unidad,
          precio: elemento.precio,
          cantidad: 1,
          total: elemento.precio,
        }
        setElementosSeleccionados([...elementosSeleccionados, nuevoElemento])
      }
    } else if (tipo === "MO") {
      elemento = manoObraEjemplo.find((m) => m.id === id)
      if (elemento) {
        const nuevoElemento: ElementoCedula = {
          id: elemento.id,
          codigo: elemento.codigo,
          familia: elemento.familia,
          descripcion: elemento.trabajo,
          unidad: elemento.unidad,
          precio: elemento.precio,
          cantidad: 1,
          total: elemento.precio,
        }
        setElementosSeleccionados([...elementosSeleccionados, nuevoElemento])
      }
    } else if (tipo === "EQ") {
      elemento = equiposEjemplo.find((e) => e.id === id)
      if (elemento) {
        const nuevoElemento: ElementoCedula = {
          id: elemento.id,
          codigo: elemento.codigo,
          familia: elemento.familia,
          descripcion: elemento.nombre,
          unidad: elemento.unidad,
          precio: elemento.precio,
          cantidad: 1,
          total: elemento.precio,
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
          return {
            ...elemento,
            cantidad: nuevaCantidad,
            total: elemento.precio * nuevaCantidad,
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
          return {
            ...elemento,
            precio: nuevoPrecio,
            total: nuevoPrecio * elemento.cantidad,
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

  // Función para eliminar un elemento de la cédula
  const eliminarElemento = (id: string) => {
    setElementosSeleccionados(elementosSeleccionados.filter((elemento) => elemento.id !== id))
  }

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

  // Filtrar elementos por familia
  const materialesSeleccionados = elementosSeleccionados.filter((elemento) => elemento.familia === "MT")
  const manoObraSeleccionada = elementosSeleccionados.filter((elemento) => elemento.familia === "MO")
  const equiposSeleccionados = elementosSeleccionados.filter((elemento) => elemento.familia === "EQ")

  // Calcular subtotales por familia
  const totalMateriales = materialesSeleccionados.reduce((sum, elemento) => sum + elemento.total, 0)
  const totalManoObra = manoObraSeleccionada.reduce((sum, elemento) => sum + elemento.total, 0)
  const totalEquipos = equiposSeleccionados.reduce((sum, elemento) => sum + elemento.total, 0)

  // Calcular el total general de la cédula
  const totalCedula = totalMateriales + totalManoObra + totalEquipos

  // Renderizar tabla de elementos por familia
  const renderTablaElementos = (elementos: ElementoCedula[], titulo: string, icono: React.ReactNode) => {
    if (elementos.length === 0) return null

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
                  Precio
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
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
                      min="0"
                      step="0.01"
                      value={elemento.precio}
                      onChange={(e) => actualizarPrecio(elemento.id, Number.parseFloat(e.target.value) || 0)}
                      className="w-24 h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={elemento.cantidad}
                      onChange={(e) => actualizarCantidad(elemento.id, Number.parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Q{elemento.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <button onClick={() => eliminarElemento(elemento.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-zinc-700">
                <td colSpan={6} className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                  Subtotal:
                </td>
                <td className="px-4 py-2 text-sm font-bold text-gray-900 dark:text-white">
                  Q{elementos.reduce((sum, elemento) => sum + elemento.total, 0).toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            <div className="flex-1">
              <Input
                type="text"
                value={nombreCedula}
                onChange={(e) => setNombreCedula(e.target.value)}
                className="text-xl font-bold h-10"
                placeholder="Nombre de la Cédula"
              />
            </div>
            <div className="flex items-center bg-gray-100 dark:bg-zinc-700 p-3 rounded-md">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total de la Cédula:</span>
                <span className="font-bold text-xl text-gray-900 dark:text-white">Q{totalCedula.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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

            {/* Botones de acción */}
            <div className="flex justify-end space-x-2 mt-4">
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
        </CardContent>
      </Card>
    </div>
  )
}


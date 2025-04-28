"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PlusCircle, Calculator, DollarSign, Eye, Trash2 } from "lucide-react"
import type { Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
  const [resumenesPresupuesto, setResumenesPresupuesto] = useState<ResumenFinanciero[]>([])
  const [resumenesVenta, setResumenesVenta] = useState<ResumenFinanciero[]>([])

  // Estados para el formulario de nuevo RF
  const [dialogOpen, setDialogOpen] = useState(false)
  const [nuevoRFTipo, setNuevoRFTipo] = useState<"presupuesto" | "venta">("presupuesto")
  const [nuevoRFNombre, setNuevoRFNombre] = useState("")
  const [nuevoRFDescripcion, setNuevoRFDescripcion] = useState("")
  const [nuevoRFCostoDirecto, setNuevoRFCostoDirecto] = useState("0")
  const [nuevoRFCostoIndirecto, setNuevoRFCostoIndirecto] = useState("0")
  const [nuevoRFUtilidad, setNuevoRFUtilidad] = useState("0")
  const [nuevoRFImpuestos, setNuevoRFImpuestos] = useState("0")
  const [nuevoRFNotas, setNuevoRFNotas] = useState("")

  // Cargar proyecto y resúmenes financieros
  useEffect(() => {
    if (typeof window !== "undefined" && proyectoId) {
      // Cargar proyecto
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      const proyectoEncontrado = proyectosGuardados.find((p: Proyecto) => p.id === proyectoId)
      setProyecto(proyectoEncontrado || null)

      // Cargar resúmenes financieros
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")

      // Filtrar por proyecto y tipo
      const rfPresupuesto = resumenesGuardados.filter(
        (rf: ResumenFinanciero) => rf.proyectoId === proyectoId && rf.tipo === "presupuesto",
      )
      setResumenesPresupuesto(rfPresupuesto)

      const rfVenta = resumenesGuardados.filter(
        (rf: ResumenFinanciero) => rf.proyectoId === proyectoId && rf.tipo === "venta",
      )
      setResumenesVenta(rfVenta)
    }
  }, [proyectoId])

  // Calcular total para el nuevo RF
  const calcularTotal = () => {
    const cd = Number.parseFloat(nuevoRFCostoDirecto) || 0
    const ci = Number.parseFloat(nuevoRFCostoIndirecto) || 0
    const ut = Number.parseFloat(nuevoRFUtilidad) || 0
    const imp = Number.parseFloat(nuevoRFImpuestos) || 0
    return cd + ci + ut + imp
  }

  // Crear nuevo resumen financiero
  const crearNuevoRF = () => {
    if (!nuevoRFNombre) {
      toast({
        title: "Error",
        description: "El nombre del resumen financiero es obligatorio.",
        variant: "destructive",
      })
      return
    }

    const nuevoRF: ResumenFinanciero = {
      id: `rf-${Date.now()}`,
      proyectoId,
      tipo: nuevoRFTipo,
      nombre: nuevoRFNombre,
      descripcion: nuevoRFDescripcion,
      costoDirecto: Number.parseFloat(nuevoRFCostoDirecto) || 0,
      costoIndirecto: Number.parseFloat(nuevoRFCostoIndirecto) || 0,
      utilidad: Number.parseFloat(nuevoRFUtilidad) || 0,
      impuestos: Number.parseFloat(nuevoRFImpuestos) || 0,
      total: calcularTotal(),
      notas: nuevoRFNotas,
      fecha: new Date().toISOString(),
      cedulasAsociadas: [],
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
      localStorage.setItem("resumenesFinancieros", JSON.stringify([...resumenesGuardados, nuevoRF]))
    }

    // Actualizar estado
    if (nuevoRFTipo === "presupuesto") {
      setResumenesPresupuesto([...resumenesPresupuesto, nuevoRF])
    } else {
      setResumenesVenta([...resumenesVenta, nuevoRF])
    }

    // Cerrar diálogo y limpiar formulario
    setDialogOpen(false)
    limpiarFormulario()

    toast({
      title: "Resumen financiero creado",
      description: `El resumen financiero "${nuevoRFNombre}" ha sido creado con éxito.`,
    })

    // Redirigir al detalle del nuevo RF
    router.push(`/proyectos/${proyectoId}/resumenes-financieros/${nuevoRF.id}`)
  }

  // Limpiar formulario
  const limpiarFormulario = () => {
    setNuevoRFNombre("")
    setNuevoRFDescripcion("")
    setNuevoRFCostoDirecto("0")
    setNuevoRFCostoIndirecto("0")
    setNuevoRFUtilidad("0")
    setNuevoRFImpuestos("0")
    setNuevoRFNotas("")
  }

  // Eliminar resumen financiero
  const eliminarRF = (rf: ResumenFinanciero) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el resumen financiero "${rf.nombre}"?`)) {
      // Eliminar del localStorage
      if (typeof window !== "undefined") {
        const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
        const resumenesActualizados = resumenesGuardados.filter((r: ResumenFinanciero) => r.id !== rf.id)
        localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesActualizados))
      }

      // Actualizar estado
      if (rf.tipo === "presupuesto") {
        setResumenesPresupuesto(resumenesPresupuesto.filter((r) => r.id !== rf.id))
      } else {
        setResumenesVenta(resumenesVenta.filter((r) => r.id !== rf.id))
      }

      toast({
        title: "Resumen financiero eliminado",
        description: `El resumen financiero "${rf.nombre}" ha sido eliminado con éxito.`,
      })
    }
  }

  // Ver detalle de un RF
  const verDetalleRF = (rfId: string) => {
    router.push(`/proyectos/${proyectoId}/resumenes-financieros/${rfId}`)
  }

  // Abrir diálogo para crear nuevo RF
  const abrirDialogoNuevoRF = (tipo: "presupuesto" | "venta") => {
    setNuevoRFTipo(tipo)
    setDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/proyectos/${proyectoId}`)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Proyecto
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Resúmenes Financieros</h1>
          <p className="text-gray-500 dark:text-gray-400">{proyecto?.nombre || "Cargando..."}</p>
        </div>
      </div>

      <Tabs defaultValue="presupuesto" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="presupuesto">Presupuesto</TabsTrigger>
          <TabsTrigger value="venta">Venta</TabsTrigger>
        </TabsList>

        <TabsContent value="presupuesto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Resúmenes de Presupuesto</h2>
            <Dialog
              open={dialogOpen && nuevoRFTipo === "presupuesto"}
              onOpenChange={(open) => {
                setDialogOpen(open)
                if (open) setNuevoRFTipo("presupuesto")
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nuevo RF Presupuesto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Nuevo Resumen Financiero - Presupuesto</DialogTitle>
                  <DialogDescription>
                    Crea un nuevo resumen financiero de presupuesto para este proyecto.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nombre" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      id="nombre"
                      value={nuevoRFNombre}
                      onChange={(e) => setNuevoRFNombre(e.target.value)}
                      className="col-span-3"
                      placeholder="Ej: Presupuesto Fase 1"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="descripcion" className="text-right">
                      Descripción
                    </Label>
                    <Input
                      id="descripcion"
                      value={nuevoRFDescripcion}
                      onChange={(e) => setNuevoRFDescripcion(e.target.value)}
                      className="col-span-3"
                      placeholder="Breve descripción del resumen financiero"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="costoDirecto" className="text-right">
                      Costo Directo
                    </Label>
                    <Input
                      id="costoDirecto"
                      type="number"
                      value={nuevoRFCostoDirecto}
                      onChange={(e) => setNuevoRFCostoDirecto(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="costoIndirecto" className="text-right">
                      Costo Indirecto
                    </Label>
                    <Input
                      id="costoIndirecto"
                      type="number"
                      value={nuevoRFCostoIndirecto}
                      onChange={(e) => setNuevoRFCostoIndirecto(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="utilidad" className="text-right">
                      Utilidad
                    </Label>
                    <Input
                      id="utilidad"
                      type="number"
                      value={nuevoRFUtilidad}
                      onChange={(e) => setNuevoRFUtilidad(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="impuestos" className="text-right">
                      Impuestos
                    </Label>
                    <Input
                      id="impuestos"
                      type="number"
                      value={nuevoRFImpuestos}
                      onChange={(e) => setNuevoRFImpuestos(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notas" className="text-right">
                      Notas
                    </Label>
                    <Textarea
                      id="notas"
                      value={nuevoRFNotas}
                      onChange={(e) => setNuevoRFNotas(e.target.value)}
                      className="col-span-3"
                      placeholder="Notas adicionales"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Total</Label>
                    <div className="col-span-3 font-bold">Q{calcularTotal().toFixed(2)}</div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={crearNuevoRF}>Crear</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumenesPresupuesto.length > 0 ? (
              resumenesPresupuesto.map((rf) => (
                <Card key={rf.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{rf.nombre}</CardTitle>
                        <CardDescription className="text-sm">{new Date(rf.fecha).toLocaleDateString()}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => eliminarRF(rf)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <Calculator className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-2xl font-bold">Q{rf.total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {rf.descripcion || "Sin descripción"}
                    </p>
                    <Button onClick={() => verDetalleRF(rf.id)} className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalle
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full bg-white dark:bg-zinc-800 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No hay resúmenes financieros de presupuesto. Crea uno nuevo con el botón "Nuevo RF Presupuesto".
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="venta">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Resúmenes de Venta</h2>
            <Dialog
              open={dialogOpen && nuevoRFTipo === "venta"}
              onOpenChange={(open) => {
                setDialogOpen(open)
                if (open) setNuevoRFTipo("venta")
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nuevo RF Venta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Nuevo Resumen Financiero - Venta</DialogTitle>
                  <DialogDescription>Crea un nuevo resumen financiero de venta para este proyecto.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nombre" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      id="nombre"
                      value={nuevoRFNombre}
                      onChange={(e) => setNuevoRFNombre(e.target.value)}
                      className="col-span-3"
                      placeholder="Ej: Venta Fase 1"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="descripcion" className="text-right">
                      Descripción
                    </Label>
                    <Input
                      id="descripcion"
                      value={nuevoRFDescripcion}
                      onChange={(e) => setNuevoRFDescripcion(e.target.value)}
                      className="col-span-3"
                      placeholder="Breve descripción del resumen financiero"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="costoDirecto" className="text-right">
                      Costo Directo
                    </Label>
                    <Input
                      id="costoDirecto"
                      type="number"
                      value={nuevoRFCostoDirecto}
                      onChange={(e) => setNuevoRFCostoDirecto(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="costoIndirecto" className="text-right">
                      Costo Indirecto
                    </Label>
                    <Input
                      id="costoIndirecto"
                      type="number"
                      value={nuevoRFCostoIndirecto}
                      onChange={(e) => setNuevoRFCostoIndirecto(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="utilidad" className="text-right">
                      Utilidad
                    </Label>
                    <Input
                      id="utilidad"
                      type="number"
                      value={nuevoRFUtilidad}
                      onChange={(e) => setNuevoRFUtilidad(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="impuestos" className="text-right">
                      Impuestos
                    </Label>
                    <Input
                      id="impuestos"
                      type="number"
                      value={nuevoRFImpuestos}
                      onChange={(e) => setNuevoRFImpuestos(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notas" className="text-right">
                      Notas
                    </Label>
                    <Textarea
                      id="notas"
                      value={nuevoRFNotas}
                      onChange={(e) => setNuevoRFNotas(e.target.value)}
                      className="col-span-3"
                      placeholder="Notas adicionales"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Total</Label>
                    <div className="col-span-3 font-bold">Q{calcularTotal().toFixed(2)}</div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={crearNuevoRF}>Crear</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumenesVenta.length > 0 ? (
              resumenesVenta.map((rf) => (
                <Card key={rf.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{rf.nombre}</CardTitle>
                        <CardDescription className="text-sm">{new Date(rf.fecha).toLocaleDateString()}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => eliminarRF(rf)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-2xl font-bold">Q{rf.total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {rf.descripcion || "Sin descripción"}
                    </p>
                    <Button onClick={() => verDetalleRF(rf.id)} className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalle
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full bg-white dark:bg-zinc-800 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No hay resúmenes financieros de venta. Crea uno nuevo con el botón "Nuevo RF Venta".
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

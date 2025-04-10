"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Esquema de validación para el formulario
const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre del proyecto debe tener al menos 2 caracteres.",
  }),
  empresa: z.string().min(2, {
    message: "El nombre de la empresa debe tener al menos 2 caracteres.",
  }),
})

// Actualizar el tipo Proyecto para incluir los nuevos campos
export type Proyecto = {
  id: string
  nombre: string
  empresa: string
  fecha: string
  cedulas: string[] // IDs de cédulas asociadas
  tipo?: "presupuesto" | "venta" // Tipo de proyecto
  esProyectoPrincipal?: boolean // Indica si es un proyecto principal
  proyectoPrincipalId?: string // ID del proyecto principal al que pertenece
}

// Actualizar la función NuevoProyectoForm para aceptar un tipo de proyecto
export function NuevoProyectoForm({ tipo }: { tipo?: "presupuesto" | "venta" }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      empresa: "",
    },
  })

  // Modificar la función onSubmit para asegurarnos de que esProyectoPrincipal sea true
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Crear un ID base para el proyecto principal
      const proyectoBaseId = Date.now().toString()

      // Crear el proyecto principal
      const nuevoProyecto: Proyecto = {
        id: proyectoBaseId,
        nombre: values.nombre,
        empresa: values.empresa,
        fecha: new Date().toISOString(),
        cedulas: [],
        esProyectoPrincipal: true, // Asegurarnos de que esto sea true
      }

      // Crear subproyecto de presupuesto
      const proyectoPresupuesto: Proyecto = {
        id: `${proyectoBaseId}-presupuesto`,
        nombre: `${values.nombre} - Presupuesto`,
        empresa: values.empresa,
        fecha: new Date().toISOString(),
        cedulas: [],
        tipo: "presupuesto",
        proyectoPrincipalId: proyectoBaseId,
      }

      // Crear subproyecto de venta
      const proyectoVenta: Proyecto = {
        id: `${proyectoBaseId}-venta`,
        nombre: `${values.nombre} - Venta`,
        empresa: values.empresa,
        fecha: new Date().toISOString(),
        cedulas: [],
        tipo: "venta",
        proyectoPrincipalId: proyectoBaseId,
      }

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")

        // Añadir los nuevos proyectos
        proyectosGuardados.push(nuevoProyecto, proyectoPresupuesto, proyectoVenta)

        // Guardar en localStorage
        localStorage.setItem("proyectos", JSON.stringify(proyectosGuardados))

        console.log("Proyecto principal creado:", nuevoProyecto)
      }

      // Redirigir a la página del proyecto principal
      router.push(`/proyectos/${nuevoProyecto.id}`)
    } catch (error) {
      console.error("Error al crear el proyecto:", error)
      alert("Hubo un problema al crear el proyecto. Inténtalo de nuevo.")
      setIsSubmitting(false)
    }
  }

  // Determinar el título según el tipo de proyecto
  const getTitulo = () => {
    if (tipo === "presupuesto") return "Nuevo Proyecto de Presupuesto"
    if (tipo === "venta") return "Nuevo Proyecto de Venta"
    return "Nuevo Proyecto"
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{getTitulo()}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Proyecto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Edificio Residencial Torres del Valle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="empresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Constructora XYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Proyecto"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

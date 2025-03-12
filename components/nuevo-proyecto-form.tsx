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

// Tipo para un proyecto
export type Proyecto = {
  id: string
  nombre: string
  empresa: string
  fecha: string
  cedulas: string[] // IDs de cédulas asociadas
}

export function NuevoProyectoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      empresa: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Crear un nuevo proyecto
      const nuevoProyecto: Proyecto = {
        id: Date.now().toString(),
        nombre: values.nombre,
        empresa: values.empresa,
        fecha: new Date().toISOString(),
        cedulas: [],
      }

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
        proyectosGuardados.push(nuevoProyecto)
        localStorage.setItem("proyectos", JSON.stringify(proyectosGuardados))
      }

      // Redirigir a la página del proyecto
      router.push(`/proyectos/${nuevoProyecto.id}`)
    } catch (error) {
      console.error("Error al crear el proyecto:", error)
      alert("Hubo un problema al crear el proyecto. Inténtalo de nuevo.")
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Nuevo Proyecto</CardTitle>
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


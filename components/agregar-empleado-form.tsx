"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  nombreCompleto: z.string().min(2, {
    message: "El nombre completo debe tener al menos 2 caracteres.",
  }),
  dpi: z.string().regex(/^\d{13}$/, {
    message: "El DPI debe tener 13 dígitos.",
  }),
  tipoEmpleado: z.enum(["albañil", "ayudante"]),
  proyecto: z.string().min(1, {
    message: "Debe seleccionar un proyecto.",
  }),
})

// Simulación de proyectos existentes
const proyectosExistentes = [
  { id: "1", nombre: "Edificio Residencial A" },
  { id: "2", nombre: "Centro Comercial B" },
  { id: "3", nombre: "Puente C" },
]

export function AgregarEmpleadoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreCompleto: "",
      dpi: "",
      tipoEmpleado: "albañil",
      proyecto: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Aquí iría la lógica para enviar los datos al backend
    console.log(values)
    setTimeout(() => {
      setIsSubmitting(false)
      form.reset()
      alert("Empleado agregado con éxito!")
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nombreCompleto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dpi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DPI</FormLabel>
              <FormControl>
                <Input placeholder="1234567890123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipoEmpleado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Empleado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de empleado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="albañil">Albañil</SelectItem>
                  <SelectItem value="ayudante">Ayudante</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proyecto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proyecto Asignado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un proyecto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {proyectosExistentes.map((proyecto) => (
                    <SelectItem key={proyecto.id} value={proyecto.id}>
                      {proyecto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Agregando..." : "Agregar Empleado"}
        </Button>
      </form>
    </Form>
  )
}

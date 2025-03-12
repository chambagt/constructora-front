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
  nombre: z.string().min(2, {
    message: "El nombre de la maquinaria debe tener al menos 2 caracteres.",
  }),
  placas: z.string().min(6, {
    message: "Las placas deben tener al menos 6 caracteres.",
  }),
  conductor: z.string().min(2, {
    message: "El nombre del conductor debe tener al menos 2 caracteres.",
  }),
  proyecto: z.string().min(1, {
    message: "Debe seleccionar un proyecto.",
  }),
})

// Proyectos de ejemplo (en una aplicación real, estos vendrían de una base de datos)
const proyectosEjemplo = [
  { id: "1", nombre: "Edificio Residencial A" },
  { id: "2", nombre: "Centro Comercial B" },
  { id: "3", nombre: "Puente C" },
]

export function AgregarMaquinariaForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      placas: "",
      conductor: "",
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
      alert("Maquinaria agregada con éxito!")
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Maquinaria</FormLabel>
              <FormControl>
                <Input placeholder="Excavadora 320" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placas</FormLabel>
              <FormControl>
                <Input placeholder="ABC123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conductor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conductor</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
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
                  {proyectosEjemplo.map((proyecto) => (
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
          {isSubmitting ? "Agregando..." : "Agregar Maquinaria"}
        </Button>
      </form>
    </Form>
  )
}


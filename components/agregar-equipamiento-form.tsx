"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Tipo para representar un equipo
type Equipo = {
  id: string
  codigo: string
  familia: string
  nombre: string
  consumoCombustible: number
  precioAlquiler: number
  unidad: string
}

// Esquema de validación para el formulario
const formSchema = z.object({
  codigo: z.string().min(1, {
    message: "El código es requerido.",
  }),
  familia: z.string().min(1, {
    message: "La familia es requerida.",
  }),
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  consumoCombustible: z.number().min(0, {
    message: "El consumo de combustible debe ser mayor o igual a cero.",
  }),
  precioAlquiler: z.number().min(0, {
    message: "El precio de alquiler debe ser mayor o igual a cero.",
  }),
  unidad: z.string().min(1, {
    message: "La unidad es requerida.",
  }),
})

interface AgregarEquipamientoFormProps {
  onAddEquipo: (equipo: Equipo) => void
}

export function AgregarEquipamientoForm({ onAddEquipo }: AgregarEquipamientoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: "",
      familia: "EQ",
      nombre: "",
      consumoCombustible: 0,
      precioAlquiler: 0,
      unidad: "hora",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Crear un nuevo equipo con los valores del formulario
    const nuevoEquipo: Equipo = {
      id: Date.now().toString(), // Generar un ID único
      ...values,
    }

    // Guardar en localStorage (opcional, para persistencia)
    if (typeof window !== "undefined") {
      const equiposGuardados = JSON.parse(localStorage.getItem("equipos") || "[]")
      equiposGuardados.push(nuevoEquipo)
      localStorage.setItem("equipos", JSON.stringify(equiposGuardados))
    }

    // Llamar a la función de callback para añadir el equipo a la lista
    onAddEquipo(nuevoEquipo)

    // Resetear el formulario y el estado
    setTimeout(() => {
      setIsSubmitting(false)
      form.reset()
    }, 500)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agregar Nuevo Equipamiento</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: EQ-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="familia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Familia</FormLabel>
                  <FormControl>
                    <Input placeholder="EQ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Equipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Excavadora" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consumoCombustible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumo de Combustible (L/h)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="precioAlquiler"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de Alquiler</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: hora, día" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Agregando..." : "Agregar Equipamiento"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

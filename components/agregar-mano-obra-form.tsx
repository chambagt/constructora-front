"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  codigo: z.string().min(1, {
    message: "El código es requerido.",
  }),
  familia: z.string().min(1, {
    message: "La familia es requerida.",
  }),
  trabajo: z.string().min(2, {
    message: "El trabajo debe tener al menos 2 caracteres.",
  }),
  unidad: z.string().min(1, {
    message: "La unidad es requerida.",
  }),
  precio: z.number().min(0, {
    message: "El precio debe ser mayor o igual a cero.",
  }),
})

export function AgregarManoObraForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: "",
      familia: "MO",
      trabajo: "",
      unidad: "",
      precio: 0,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Aquí iría la lógica para enviar los datos al backend
    console.log(values)
    setTimeout(() => {
      setIsSubmitting(false)
      form.reset()
      alert("Mano de obra agregada con éxito!")
    }, 1000)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agregar Mano de Obra</CardTitle>
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
                    <Input placeholder="Ej: MO-001" {...field} />
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
                    <Input placeholder="MO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trabajo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trabajo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Albañilería" {...field} />
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
                    <Input placeholder="Ej: hora, día, m²" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Agregando..." : "Agregar Mano de Obra"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

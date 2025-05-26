"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Save } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Esquema de validación para el formulario
const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  fecha: z.date({
    required_error: "La fecha es requerida.",
  }),
  notas: z.string().optional(),
})

type ResumenFinancieroFormProps = {
  proyectoId: string
  onSuccess?: () => void
}

export function CrearResumenFinancieroForm({ proyectoId, onSuccess }: ResumenFinancieroFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      fecha: new Date(),
      notas: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Crear un nuevo resumen financiero (siempre de tipo presupuesto)
      const nuevoResumen = {
        id: `rf-${Date.now()}`,
        proyectoId,
        nombre: values.nombre,
        tipo: "presupuesto", // Siempre será de tipo presupuesto
        fecha: values.fecha.toISOString(),
        notas: values.notas || "",
        cedulasAsociadas: [],
      }

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        const resumenesGuardados = JSON.parse(localStorage.getItem("resumenesFinancieros") || "[]")
        resumenesGuardados.push(nuevoResumen)
        localStorage.setItem("resumenesFinancieros", JSON.stringify(resumenesGuardados))
      }

      toast({
        title: "Resumen financiero creado",
        description: `El presupuesto "${values.nombre}" ha sido creado exitosamente.`,
      })

      // Resetear el formulario
      form.reset()

      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess()
      }

      // Redirigir a la página del presupuesto
      router.push(`/proyectos/${proyectoId}/presupuesto`)
    } catch (error) {
      console.error("Error al crear el presupuesto:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al crear el presupuesto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Presupuesto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Presupuesto Inicial Fase 1" {...field} />
              </FormControl>
              <FormDescription>Un nombre descriptivo para identificar este presupuesto.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>La fecha en que se crea este presupuesto.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Añade notas o comentarios sobre este presupuesto..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Información adicional relevante para este presupuesto.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            "Creando..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Crear Presupuesto
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

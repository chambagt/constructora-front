"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowRight, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stepOneSchema = z.object({
  unidad_metrica: z.string().min(1, "La unidad métrica es requerida"),
  cantidad: z.number().min(0, "La cantidad debe ser mayor o igual a cero"),
})

const stepTwoSchema = stepOneSchema.extend({
  materiales: z.number().min(0, "El costo de materiales debe ser mayor o igual a cero"),
  mano_obra: z.number().min(0, "El costo de mano de obra debe ser mayor o igual a cero"),
})

type StepOneData = z.infer<typeof stepOneSchema>
type StepTwoData = z.infer<typeof stepTwoSchema>

export function WizardForm() {
  const [step, setStep] = useState(1)
  const [stepOneData, setStepOneData] = useState<StepOneData | null>(null)

  const stepOneForm = useForm<StepOneData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      unidad_metrica: "",
      cantidad: 0,
    },
  })

  const stepTwoForm = useForm<StepTwoData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      unidad_metrica: "",
      cantidad: 0,
      materiales: 0,
      mano_obra: 0,
    },
  })

  const onStepOneSubmit = (data: StepOneData) => {
    setStepOneData(data)
    setStep(2)
    stepTwoForm.reset({ ...data, materiales: 0, mano_obra: 0 })
  }

  const onStepTwoSubmit = (data: StepTwoData) => {
    console.log("Form submitted:", data)
    // Here you would typically send the data to your backend
    alert("Formulario enviado con éxito!")
    setStep(1)
    stepOneForm.reset()
    stepTwoForm.reset()
  }

  const goBack = () => {
    setStep(1)
    if (stepOneData) {
      stepOneForm.reset(stepOneData)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Nuevo Proyecto - Paso {step} de 2</CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <Form {...stepOneForm}>
            <form onSubmit={stepOneForm.handleSubmit(onStepOneSubmit)} className="space-y-4">
              <FormField
                control={stepOneForm.control}
                name="unidad_metrica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad Métrica</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: metros, kilogramos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stepOneForm.control}
                name="cantidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...stepTwoForm}>
            <form onSubmit={stepTwoForm.handleSubmit(onStepTwoSubmit)} className="space-y-4">
              <FormField
                control={stepTwoForm.control}
                name="unidad_metrica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad Métrica</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stepTwoForm.control}
                name="cantidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stepTwoForm.control}
                name="materiales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo de Materiales</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stepTwoForm.control}
                name="mano_obra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo de Mano de Obra</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
                </Button>
                <Button type="submit">Enviar</Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}

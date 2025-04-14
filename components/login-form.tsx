"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  username: z.string().min(1, {
    message: "El nombre de usuario es requerido.",
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida.",
  }),
})

export function LoginForm() {
  const [error, setError] = useState("")
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.username === "Admin" && values.password === "Admin123") {
      // En una aplicación real, aquí se manejaría la autenticación con el backend
      // y se almacenaría el token de sesión
      localStorage.setItem("isLoggedIn", "true")
      router.push("/dashboard")
    } else {
      setError("Credenciales incorrectas")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuario</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese su usuario" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Ingrese su contraseña" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
        </form>
      </Form>
    </div>
  )
}

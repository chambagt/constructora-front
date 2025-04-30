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
      <div className="text-center space-y-4 mb-8">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4">
            <img src="/images/confya-logo.png" alt="Confya Constructora Logo" className="w-32 h-32 object-contain" />
          </div>

          {/* Nombre de la empresa */}
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">
              CONFYA
            </h1>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">CONSTRUCTORA</h2>
          </div>
        </div>

        {/* Eslogan */}
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">Construyendo confianza, edificando futuro</p>
      </div>

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
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Iniciar Sesión
          </Button>
        </form>
      </Form>

      {/* Footer con referencia a CGT */}
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Sistema desarrollado por <span className="font-semibold">CGT</span>
        </p>
      </div>
    </div>
  )
}

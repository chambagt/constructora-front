"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Building, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NuevoProyectoForm, type Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"
import Link from "next/link"

export default function ProyectosPage() {
  const [showForm, setShowForm] = useState(false)
  const [proyectos, setProyectos] = useState<Proyecto[]>([])

  // Cargar proyectos guardados
  useEffect(() => {
    if (typeof window !== "undefined") {
      const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
      setProyectos(proyectosGuardados)
    }
  }, [showForm])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cerrar Formulario" : "Nuevo Proyecto"}
          <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <NuevoProyectoForm />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Proyectos Existentes</h2>
        {proyectos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {proyectos.map((proyecto) => (
              <Card key={proyecto.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{proyecto.nombre}</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Empresa: {proyecto.empresa}</p>
                  <div className="flex items-center text-xs text-muted-foreground mb-4">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{new Date(proyecto.fecha).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Cédulas: {proyecto.cedulas?.length || 0}</p>
                  <Link href={`/proyectos/${proyecto.id}`} passHref>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      Ver Proyecto
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No hay proyectos. Presiona el botón "Nuevo Proyecto" para crear uno.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


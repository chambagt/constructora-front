"use client"

import { useState } from "react"
import { AgregarMaquinariaForm } from "@/components/kokonutui/agregar-maquinaria-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Briefcase } from "lucide-react"

// Tipo para representar una maquinaria
type Maquinaria = {
  id: string
  nombre: string
  placas: string
  conductor: string
  proyecto: string
}

// Maquinaria de ejemplo (en una aplicación real, estos vendrían de una base de datos)
const maquinariaEjemplo: Maquinaria[] = [
  { id: "1", nombre: "Excavadora 320", placas: "ABC123", conductor: "Juan Pérez", proyecto: "Edificio Residencial A" },
  { id: "2", nombre: "Grúa Torre", placas: "XYZ789", conductor: "María García", proyecto: "Centro Comercial B" },
  { id: "3", nombre: "Retroexcavadora", placas: "DEF456", conductor: "Carlos López", proyecto: "Puente C" },
]

export default function EquipamientoPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipamiento</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cerrar Formulario" : "Agregar Maquinaria"}</Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <AgregarMaquinariaForm />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {maquinariaEjemplo.map((maquina) => (
          <Card key={maquina.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{maquina.nombre}</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maquina.placas}</div>
              <p className="text-xs text-muted-foreground">Conductor: {maquina.conductor}</p>
              <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{maquina.proyecto}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { es } from "date-fns/locale"

type Nota = {
  fecha: Date
  contenido: string
}

export function CalendarioConNotas() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [notas, setNotas] = useState<Nota[]>([])
  const [nuevaNota, setNuevaNota] = useState("")

  const agregarNota = () => {
    if (date && nuevaNota) {
      setNotas([...notas, { fecha: date, contenido: nuevaNota }])
      setNuevaNota("")
    }
  }

  const notasDelDia = notas.filter((nota) => nota.fecha.toDateString() === date?.toDateString())

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calendario de Guatemala</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={date} onSelect={setDate} locale={es} className="rounded-md border" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notas del día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={nuevaNota}
                onChange={(e) => setNuevaNota(e.target.value)}
                placeholder="Agregar una nota..."
              />
              <Button onClick={agregarNota}>Agregar</Button>
            </div>
            {notasDelDia.length > 0 ? (
              <ul className="space-y-2">
                {notasDelDia.map((nota, index) => (
                  <li key={index} className="text-sm">
                    {nota.contenido}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No hay notas para este día.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

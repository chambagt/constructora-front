import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Calendar, Users } from "lucide-react"

// Tipo para representar un proyecto
type Proyecto = {
  id: string
  nombre: string
  fechaInicio: string
  empleados: number
}

// Proyectos de ejemplo (en una aplicación real, estos vendrían de una base de datos)
const proyectosEjemplo: Proyecto[] = [
  { id: "1", nombre: "Edificio Residencial A", fechaInicio: "2023-01-15", empleados: 25 },
  { id: "2", nombre: "Centro Comercial B", fechaInicio: "2023-03-01", empleados: 40 },
  { id: "3", nombre: "Puente C", fechaInicio: "2023-05-10", empleados: 15 },
]

export function ListaProyectos() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {proyectosEjemplo.map((proyecto) => (
        <Card key={proyecto.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{proyecto.nombre}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proyecto.id}</div>
            <p className="text-xs text-muted-foreground">ID del Proyecto</p>
            <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {proyecto.fechaInicio}
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                {proyecto.empleados} empleados
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

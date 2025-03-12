import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, X } from "lucide-react"

// Tipo para representar un permiso de administrador
type Permiso = {
  id: string
  nombre: string
  descripcion: string
  activo: boolean
}

// Permisos de ejemplo (en una aplicación real, estos vendrían de una base de datos)
const permisosEjemplo: Permiso[] = [
  { id: "1", nombre: "Gestión de Usuarios", descripcion: "Crear, editar y eliminar usuarios", activo: true },
  { id: "2", nombre: "Gestión de Proyectos", descripcion: "Crear, editar y eliminar proyectos", activo: true },
  { id: "3", nombre: "Gestión Financiera", descripcion: "Acceso a informes financieros y presupuestos", activo: false },
  { id: "4", nombre: "Gestión de Equipamiento", descripcion: "Administrar maquinaria y equipos", activo: true },
]

export default function PermisosPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Permisos de Administrador</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {permisosEjemplo.map((permiso) => (
          <Card key={permiso.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{permiso.nombre}</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{permiso.descripcion}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Estado:</span>
                {permiso.activo ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


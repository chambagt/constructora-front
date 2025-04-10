"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Download,
  Search,
  Calendar,
  BarChart3,
  Activity,
  Clock,
  Filter,
  User,
  Building,
  Package,
  HardHat,
  Truck,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  DollarSign,
} from "lucide-react"

// Tipos para los datos
type ActivityLog = {
  id: string
  user: string
  action: string
  module: string
  details: string
  timestamp: string
  status: "success" | "warning" | "error"
}

type ProjectSummary = {
  id: string
  name: string
  type: string
  progress: number
  cedulas: number
  lastUpdated: string
}

type MaterialSummary = {
  id: string
  name: string
  quantity: number
  unit: string
  value: number
  lastUpdated: string
}

type LaborSummary = {
  id: string
  name: string
  role: string
  hours: number
  cost: number
  lastUpdated: string
}

type EquipmentSummary = {
  id: string
  name: string
  status: "active" | "maintenance" | "inactive"
  usageHours: number
  cost: number
  lastUpdated: string
}

type Report = {
  id: string
  name: string
  type: string
  createdBy: string
  createdAt: string
  status: "generated" | "pending" | "failed"
}

// Datos de ejemplo
const activityLogs: ActivityLog[] = [
  {
    id: "1",
    user: "Carlos Rodríguez",
    action: "Creación",
    module: "Proyectos",
    details: "Creó nuevo proyecto 'Edificio Torres del Valle'",
    timestamp: "2023-10-15 14:32:45",
    status: "success",
  },
  {
    id: "2",
    user: "María González",
    action: "Modificación",
    module: "Cédulas",
    details: "Actualizó cédula #C-2023-045 'Cimentación Fase 1'",
    timestamp: "2023-10-15 13:15:22",
    status: "success",
  },
  {
    id: "3",
    user: "Juan Pérez",
    action: "Eliminación",
    module: "Materiales",
    details: "Eliminó material 'Arena fina' del inventario",
    timestamp: "2023-10-15 11:45:10",
    status: "warning",
  },
  {
    id: "4",
    user: "Ana Martínez",
    action: "Aprobación",
    module: "Finanzas",
    details: "Aprobó presupuesto para 'Proyecto Centro Comercial'",
    timestamp: "2023-10-14 16:22:33",
    status: "success",
  },
  {
    id: "5",
    user: "Roberto Sánchez",
    action: "Error",
    module: "Equipamiento",
    details: "Error al registrar mantenimiento de 'Excavadora CAT-320'",
    timestamp: "2023-10-14 09:18:05",
    status: "error",
  },
  {
    id: "6",
    user: "Carlos Rodríguez",
    action: "Exportación",
    module: "Informes",
    details: "Exportó informe 'Avance de Obra Octubre 2023'",
    timestamp: "2023-10-13 15:40:12",
    status: "success",
  },
  {
    id: "7",
    user: "María González",
    action: "Inicio de sesión",
    module: "Seguridad",
    details: "Inicio de sesión exitoso desde 192.168.1.105",
    timestamp: "2023-10-13 08:30:45",
    status: "success",
  },
  {
    id: "8",
    user: "Sistema",
    action: "Respaldo",
    module: "Sistema",
    details: "Respaldo automático de base de datos completado",
    timestamp: "2023-10-12 23:00:00",
    status: "success",
  },
]

const projectSummaries: ProjectSummary[] = [
  {
    id: "P001",
    name: "Edificio Torres del Valle",
    type: "Residencial",
    progress: 65,
    cedulas: 12,
    lastUpdated: "2023-10-15",
  },
  {
    id: "P002",
    name: "Centro Comercial Plaza Central",
    type: "Comercial",
    progress: 30,
    cedulas: 8,
    lastUpdated: "2023-10-14",
  },
  {
    id: "P003",
    name: "Puente Río Grande",
    type: "Infraestructura",
    progress: 85,
    cedulas: 15,
    lastUpdated: "2023-10-13",
  },
  {
    id: "P004",
    name: "Escuela Municipal San Pedro",
    type: "Educativo",
    progress: 45,
    cedulas: 6,
    lastUpdated: "2023-10-12",
  },
  {
    id: "P005",
    name: "Hospital Regional",
    type: "Salud",
    progress: 15,
    cedulas: 4,
    lastUpdated: "2023-10-10",
  },
]

const materialSummaries: MaterialSummary[] = [
  {
    id: "M001",
    name: "Cemento Portland",
    quantity: 500,
    unit: "sacos",
    value: 42500,
    lastUpdated: "2023-10-15",
  },
  {
    id: "M002",
    name: "Arena de río",
    quantity: 120,
    unit: "m³",
    value: 18000,
    lastUpdated: "2023-10-14",
  },
  {
    id: "M003",
    name: 'Varilla de acero 3/8"',
    quantity: 1500,
    unit: "unidades",
    value: 68625,
    lastUpdated: "2023-10-13",
  },
  {
    id: "M004",
    name: "Bloque de concreto",
    quantity: 8000,
    unit: "unidades",
    value: 66000,
    lastUpdated: "2023-10-12",
  },
  {
    id: "M005",
    name: "Madera para encofrado",
    quantity: 350,
    unit: "pie²",
    value: 4375,
    lastUpdated: "2023-10-10",
  },
]

const laborSummaries: LaborSummary[] = [
  {
    id: "L001",
    name: "Equipo de Albañilería",
    role: "Albañilería",
    hours: 320,
    cost: 48000,
    lastUpdated: "2023-10-15",
  },
  {
    id: "L002",
    name: "Equipo de Electricistas",
    role: "Electricista",
    hours: 160,
    cost: 12080,
    lastUpdated: "2023-10-14",
  },
  {
    id: "L003",
    name: "Equipo de Pintores",
    role: "Pintura",
    hours: 120,
    cost: 3000,
    lastUpdated: "2023-10-13",
  },
  {
    id: "L004",
    name: "Equipo de Plomería",
    role: "Plomería",
    hours: 80,
    cost: 6400,
    lastUpdated: "2023-10-12",
  },
  {
    id: "L005",
    name: "Equipo de Carpintería",
    role: "Carpintería",
    hours: 40,
    cost: 8000,
    lastUpdated: "2023-10-10",
  },
]

const equipmentSummaries: EquipmentSummary[] = [
  {
    id: "E001",
    name: "Excavadora CAT-320",
    status: "active",
    usageHours: 120,
    cost: 42000,
    lastUpdated: "2023-10-15",
  },
  {
    id: "E002",
    name: "Mezcladora de concreto",
    status: "active",
    usageHours: 80,
    cost: 16000,
    lastUpdated: "2023-10-14",
  },
  {
    id: "E003",
    name: "Andamios (10 juegos)",
    status: "active",
    usageHours: 200,
    cost: 10000,
    lastUpdated: "2023-10-13",
  },
  {
    id: "E004",
    name: "Compactadora",
    status: "maintenance",
    usageHours: 40,
    cost: 7200,
    lastUpdated: "2023-10-12",
  },
  {
    id: "E005",
    name: "Generador eléctrico",
    status: "inactive",
    usageHours: 0,
    cost: 0,
    lastUpdated: "2023-10-10",
  },
]

const reports: Report[] = [
  {
    id: "R001",
    name: "Avance de Obra Octubre 2023",
    type: "Avance de Proyecto",
    createdBy: "Carlos Rodríguez",
    createdAt: "2023-10-15 14:30",
    status: "generated",
  },
  {
    id: "R002",
    name: "Inventario de Materiales",
    type: "Inventario",
    createdBy: "María González",
    createdAt: "2023-10-14 11:15",
    status: "generated",
  },
  {
    id: "R003",
    name: "Costos de Mano de Obra",
    type: "Financiero",
    createdBy: "Roberto Sánchez",
    createdAt: "2023-10-13 09:45",
    status: "generated",
  },
  {
    id: "R004",
    name: "Utilización de Equipamiento",
    type: "Equipamiento",
    createdBy: "Juan Pérez",
    createdAt: "2023-10-12 16:20",
    status: "pending",
  },
  {
    id: "R005",
    name: "Presupuesto vs. Gastos Reales",
    type: "Financiero",
    createdBy: "Roberto Sánchez",
    createdAt: "2023-10-10 10:30",
    status: "failed",
  },
]

export default function InformesPage() {
  const [activeTab, setActiveTab] = useState("actividad")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")

  // Filtrar actividades según la búsqueda
  const filteredActivities = activityLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Función para renderizar el estado con un icono
  const renderStatus = (status: "success" | "warning" | "error") => {
    switch (status) {
      case "success":
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400">Exitoso</span>
          </div>
        )
      case "warning":
        return (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-amber-600 dark:text-amber-400">Advertencia</span>
          </div>
        )
      case "error":
        return (
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-600 dark:text-red-400">Error</span>
          </div>
        )
      default:
        return null
    }
  }

  // Función para renderizar el estado del reporte
  const renderReportStatus = (status: "generated" | "pending" | "failed") => {
    switch (status) {
      case "generated":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Generado</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Pendiente</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Fallido</Badge>
      default:
        return null
    }
  }

  // Función para renderizar el estado del equipo
  const renderEquipmentStatus = (status: "active" | "maintenance" | "inactive") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Activo</Badge>
      case "maintenance":
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Mantenimiento</Badge>
        )
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Inactivo</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Informes del Sistema</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generar Nuevo Informe
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="actividad" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Actividad</span>
          </TabsTrigger>
          <TabsTrigger value="proyectos" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Proyectos</span>
          </TabsTrigger>
          <TabsTrigger value="recursos" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Recursos</span>
          </TabsTrigger>
          <TabsTrigger value="estadisticas" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Estadísticas</span>
          </TabsTrigger>
          <TabsTrigger value="informes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Informes</span>
          </TabsTrigger>
        </TabsList>

        {/* Pestaña de Actividad */}
        <TabsContent value="actividad" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Registro de Actividades</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar actividades..."
                      className="pl-9 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select defaultValue={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por fecha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las fechas</SelectItem>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="yesterday">Ayer</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mes</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
              <CardDescription>Registro de todas las actividades realizadas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha y Hora</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Detalles</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            {log.timestamp}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            {log.user}
                          </div>
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.module}</TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell>{renderStatus(log.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Proyectos */}
        <TabsContent value="proyectos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Resumen de Proyectos</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
              <CardDescription>Estado actual y progreso de todos los proyectos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre del Proyecto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Progreso</TableHead>
                      <TableHead>Cédulas</TableHead>
                      <TableHead>Última Actualización</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectSummaries.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                            {project.name}
                          </div>
                        </TableCell>
                        <TableCell>{project.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-[100px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{project.cedulas}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {project.lastUpdated}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">Ver detalles</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Recursos */}
        <TabsContent value="recursos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Materiales */}
            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-primary" />
                    Materiales
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
                <CardDescription>Resumen de materiales utilizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Unidad</TableHead>
                        <TableHead>Valor Total (Q)</TableHead>
                        <TableHead>Última Actualización</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materialSummaries.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell className="font-medium">{material.id}</TableCell>
                          <TableCell>{material.name}</TableCell>
                          <TableCell>{material.quantity.toLocaleString()}</TableCell>
                          <TableCell>{material.unit}</TableCell>
                          <TableCell>Q{material.value.toLocaleString()}</TableCell>
                          <TableCell>{material.lastUpdated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Mano de Obra */}
            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <HardHat className="h-5 w-5 mr-2 text-primary" />
                    Mano de Obra
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
                <CardDescription>Resumen de mano de obra utilizada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Horas Trabajadas</TableHead>
                        <TableHead>Costo Total (Q)</TableHead>
                        <TableHead>Última Actualización</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {laborSummaries.map((labor) => (
                        <TableRow key={labor.id}>
                          <TableCell className="font-medium">{labor.id}</TableCell>
                          <TableCell>{labor.name}</TableCell>
                          <TableCell>{labor.role}</TableCell>
                          <TableCell>{labor.hours.toLocaleString()}</TableCell>
                          <TableCell>Q{labor.cost.toLocaleString()}</TableCell>
                          <TableCell>{labor.lastUpdated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Equipamiento */}
            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-primary" />
                    Equipamiento
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
                <CardDescription>Resumen de equipamiento utilizado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Horas de Uso</TableHead>
                        <TableHead>Costo Total (Q)</TableHead>
                        <TableHead>Última Actualización</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipmentSummaries.map((equipment) => (
                        <TableRow key={equipment.id}>
                          <TableCell className="font-medium">{equipment.id}</TableCell>
                          <TableCell>{equipment.name}</TableCell>
                          <TableCell>{renderEquipmentStatus(equipment.status)}</TableCell>
                          <TableCell>{equipment.usageHours.toLocaleString()}</TableCell>
                          <TableCell>Q{equipment.cost.toLocaleString()}</TableCell>
                          <TableCell>{equipment.lastUpdated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña de Estadísticas */}
        <TabsContent value="estadisticas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Costos</CardTitle>
                <CardDescription>Distribución de costos por categoría</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Aquí se mostraría un gráfico de distribución de costos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progreso de Proyectos</CardTitle>
                <CardDescription>Avance de proyectos activos</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Aquí se mostraría un gráfico de progreso de proyectos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilización de Recursos</CardTitle>
                <CardDescription>Uso de materiales y equipamiento</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Aquí se mostraría un gráfico de utilización de recursos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Costos vs. Presupuesto</CardTitle>
                <CardDescription>Comparación de costos reales vs. presupuestados</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                {/* Import DollarSign from lucide-react */}
                <div className="text-center">
                  <DollarSign className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Aquí se mostraría un gráfico de costos vs. presupuesto
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña de Informes */}
        <TabsContent value="informes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Informes Generados</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="text" placeholder="Buscar informes..." className="pl-9 w-[250px]" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="project">Avance de Proyecto</SelectItem>
                      <SelectItem value="inventory">Inventario</SelectItem>
                      <SelectItem value="financial">Financiero</SelectItem>
                      <SelectItem value="equipment">Equipamiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>Informes generados en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre del Informe</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Creado Por</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            {report.name}
                          </div>
                        </TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.createdBy}</TableCell>
                        <TableCell>{report.createdAt}</TableCell>
                        <TableCell>{renderReportStatus(report.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Descargar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

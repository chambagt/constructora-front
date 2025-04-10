"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Users,
  Lock,
  Settings,
  FileText,
  Building,
  Package,
  HardHat,
  Truck,
  ClipboardList,
  Calendar,
  DollarSign,
  Check,
  X,
} from "lucide-react"

// Tipos para los permisos
type PermissionAction = "view" | "create" | "edit" | "delete" | "approve" | "export"

type ModulePermission = {
  module: string
  icon: React.ReactNode
  description: string
  permissions: {
    [key in PermissionAction]?: boolean
  }
}

type Role = {
  id: string
  name: string
  description: string
  isSystem: boolean
  permissions: {
    [key: string]: {
      [key in PermissionAction]?: boolean
    }
  }
}

type User = {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  lastLogin?: string
}

// Tipo para representar un permiso de administrador
type Permiso = {
  id: string
  nombre: string
  descripcion: string
  activo: boolean
}

// Permisos de ejemplo
const permisosEjemplo: Permiso[] = [
  { id: "1", nombre: "Gestión de Usuarios", descripcion: "Crear, editar y eliminar usuarios", activo: true },
  { id: "2", nombre: "Gestión de Proyectos", descripcion: "Crear, editar y eliminar proyectos", activo: true },
  { id: "3", nombre: "Gestión Financiera", descripcion: "Acceso a informes financieros y presupuestos", activo: false },
  { id: "4", nombre: "Gestión de Equipamiento", descripcion: "Administrar maquinaria y equipos", activo: true },
  { id: "5", nombre: "Gestión de Materiales", descripcion: "Administrar inventario de materiales", activo: true },
  { id: "6", nombre: "Gestión de Mano de Obra", descripcion: "Administrar personal y contratistas", activo: true },
  { id: "7", nombre: "Gestión de Cédulas", descripcion: "Crear y editar cédulas de construcción", activo: true },
  { id: "8", nombre: "Acceso a Informes", descripcion: "Ver y generar informes del sistema", activo: true },
]

// Datos de ejemplo
const modulePermissions: ModulePermission[] = [
  {
    module: "Proyectos",
    icon: <Building className="h-5 w-5" />,
    description: "Gestión de proyectos de construcción",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: true,
      export: true,
    },
  },
  {
    module: "Materiales",
    icon: <Package className="h-5 w-5" />,
    description: "Gestión de inventario de materiales",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: false,
      export: true,
    },
  },
  {
    module: "Mano de Obra",
    icon: <HardHat className="h-5 w-5" />,
    description: "Gestión de personal y contratistas",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: true,
      export: true,
    },
  },
  {
    module: "Equipamiento",
    icon: <Truck className="h-5 w-5" />,
    description: "Gestión de maquinaria y equipos",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: false,
      export: true,
    },
  },
  {
    module: "Cédulas",
    icon: <FileText className="h-5 w-5" />,
    description: "Gestión de cédulas de construcción",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: true,
      export: true,
    },
  },
  {
    module: "Informes",
    icon: <ClipboardList className="h-5 w-5" />,
    description: "Generación y visualización de informes",
    permissions: {
      view: true,
      create: true,
      edit: false,
      delete: false,
      approve: false,
      export: true,
    },
  },
  {
    module: "Calendario",
    icon: <Calendar className="h-5 w-5" />,
    description: "Gestión de cronogramas y eventos",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: false,
      export: true,
    },
  },
  {
    module: "Finanzas",
    icon: <DollarSign className="h-5 w-5" />,
    description: "Gestión financiera y presupuestos",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      approve: true,
      export: true,
    },
  },
  {
    module: "Usuarios",
    icon: <Users className="h-5 w-5" />,
    description: "Gestión de usuarios del sistema",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: false,
      export: false,
    },
  },
  {
    module: "Configuración",
    icon: <Settings className="h-5 w-5" />,
    description: "Configuración general del sistema",
    permissions: {
      view: true,
      create: false,
      edit: true,
      delete: false,
      approve: false,
      export: false,
    },
  },
]

const roles: Role[] = [
  {
    id: "1",
    name: "Administrador",
    description: "Acceso completo a todas las funciones del sistema",
    isSystem: true,
    permissions: {
      Proyectos: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Materiales: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      "Mano de Obra": { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Equipamiento: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Cédulas: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Informes: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Calendario: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Finanzas: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Usuarios: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Configuración: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
    },
  },
  {
    id: "2",
    name: "Gerente de Proyecto",
    description: "Gestión de proyectos y acceso a informes",
    isSystem: true,
    permissions: {
      Proyectos: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      Materiales: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      "Mano de Obra": { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      Equipamiento: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      Cédulas: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      Informes: { view: true, create: true, edit: false, delete: false, approve: false, export: true },
      Calendario: { view: true, create: true, edit: true, delete: true, approve: false, export: true },
      Finanzas: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      Usuarios: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Configuración: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
    },
  },
  {
    id: "3",
    name: "Supervisor",
    description: "Supervisión de obras y gestión de personal",
    isSystem: true,
    permissions: {
      Proyectos: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      Materiales: { view: true, create: true, edit: true, delete: false, approve: false, export: true },
      "Mano de Obra": { view: true, create: true, edit: true, delete: false, approve: false, export: true },
      Equipamiento: { view: true, create: true, edit: true, delete: false, approve: false, export: true },
      Cédulas: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      Informes: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      Calendario: { view: true, create: true, edit: true, delete: false, approve: false, export: true },
      Finanzas: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Usuarios: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Configuración: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
    },
  },
  {
    id: "4",
    name: "Operador",
    description: "Registro de actividades diarias",
    isSystem: true,
    permissions: {
      Proyectos: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Materiales: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      "Mano de Obra": { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Equipamiento: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Cédulas: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Informes: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Calendario: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Finanzas: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Usuarios: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Configuración: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
    },
  },
  {
    id: "5",
    name: "Contador",
    description: "Gestión financiera y presupuestos",
    isSystem: true,
    permissions: {
      Proyectos: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      Materiales: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      "Mano de Obra": { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      Equipamiento: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      Cédulas: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      Informes: { view: true, create: true, edit: false, delete: false, approve: false, export: true },
      Calendario: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Finanzas: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      Usuarios: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Configuración: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
    },
  },
]

const users: User[] = [
  {
    id: "1",
    name: "Carlos Rodríguez",
    email: "carlos@ejemplo.com",
    role: "Administrador",
    active: true,
    lastLogin: "2023-10-15 08:30",
  },
  {
    id: "2",
    name: "María González",
    email: "maria@ejemplo.com",
    role: "Gerente de Proyecto",
    active: true,
    lastLogin: "2023-10-14 14:45",
  },
  {
    id: "3",
    name: "Juan Pérez",
    email: "juan@ejemplo.com",
    role: "Supervisor",
    active: true,
    lastLogin: "2023-10-15 07:15",
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana@ejemplo.com",
    role: "Operador",
    active: false,
    lastLogin: "2023-09-28 16:20",
  },
  {
    id: "5",
    name: "Roberto Sánchez",
    email: "roberto@ejemplo.com",
    role: "Contador",
    active: true,
    lastLogin: "2023-10-13 09:10",
  },
]

// Componente principal
export default function PermisosPage() {
  const [activeTab, setActiveTab] = useState("roles")
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: "90",
    minPasswordLength: "8",
    requireSpecialChars: true,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
  })

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Función para actualizar permisos de un rol
  const updateRolePermission = (role: Role, module: string, action: PermissionAction, value: boolean) => {
    // En una aplicación real, aquí se actualizaría la base de datos
    console.log(`Actualizando permiso: ${role.name} - ${module} - ${action} - ${value}`)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Permisos de Administrador</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Permisos del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Permisos del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {permisosEjemplo.map((permiso) => (
                <div key={permiso.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{permiso.nombre}</p>
                    <p className="text-sm text-muted-foreground">{permiso.descripcion}</p>
                  </div>
                  <Switch id={`permiso-${permiso.id}`} defaultChecked={permiso.activo} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Roles de Usuario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Roles de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Administrador</p>
                  <p className="text-sm text-muted-foreground">Acceso completo al sistema</p>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Gerente de Proyecto</p>
                  <p className="text-sm text-muted-foreground">Gestión de proyectos y personal</p>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Supervisor</p>
                  <p className="text-sm text-muted-foreground">Supervisión de obras</p>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Operador</p>
                  <p className="text-sm text-muted-foreground">Registro de actividades diarias</p>
                </div>
                <div className="flex items-center">
                  <X className="h-5 w-5 text-red-500" />
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Contador</p>
                  <p className="text-sm text-muted-foreground">Gestión financiera</p>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-primary" />
              Configuración de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor">Autenticación de dos factores</Label>
                <Switch id="two-factor" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password-expiry">Expiración de contraseñas (90 días)</Label>
                <Switch id="password-expiry" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="session-timeout">Tiempo de sesión (30 minutos)</Label>
                <Switch id="session-timeout" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="login-attempts">Límite de intentos de inicio de sesión</Label>
                <Switch id="login-attempts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="audit-trail">Registro de auditoría</Label>
                <Switch id="audit-trail" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auditoría */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Auditoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-audit">Auditar inicios de sesión</Label>
                <Switch id="login-audit" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="permission-audit">Auditar cambios de permisos</Label>
                <Switch id="permission-audit" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="data-audit">Auditar cambios de datos</Label>
                <Switch id="data-audit" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="export-audit">Auditar exportaciones</Label>
                <Switch id="export-audit" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system-audit">Auditar eventos del sistema</Label>
                <Switch id="system-audit" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

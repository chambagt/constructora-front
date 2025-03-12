"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Settings() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("es")
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Configuración General</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="language">Idioma</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona un idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Tema</Label>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notificaciones</Label>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Preferencias de Cuenta</h2>
        <div className="space-y-4">
          <Button variant="outline">Cambiar contraseña</Button>
          <Button variant="outline">Actualizar información de perfil</Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Privacidad y Seguridad</h2>
        <div className="space-y-4">
          <Button variant="outline">Gestionar permisos</Button>
          <Button variant="outline">Revisar actividad de la cuenta</Button>
        </div>
      </div>
    </div>
  )
}


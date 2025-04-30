"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Pencil } from "lucide-react"

interface ResumenFinancieroHeaderProps {
  nombre: string
  tipo: string
  fecha: string
  onEdit: () => void
}

export function ResumenFinancieroHeader({ nombre, tipo, fecha, onEdit }: ResumenFinancieroHeaderProps) {
  return (
    <Card className="mb-4 bg-zinc-900 text-white">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span className="font-medium">Resumen Financiero</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit} className="h-7 px-2 text-white hover:bg-zinc-800">
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Editar RF
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
          <div>
            <span className="text-gray-400">Nombre:</span>
            <span className="ml-1 font-medium">{nombre}</span>
          </div>
          <div>
            <span className="text-gray-400">Tipo:</span>
            <span className="ml-1 font-medium capitalize">{tipo}</span>
          </div>
          <div>
            <span className="text-gray-400">Fecha:</span>
            <span className="ml-1 font-medium">{fecha}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

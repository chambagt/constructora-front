"use client"
import { Button } from "@/components/ui/button"
import { Eye, X } from "lucide-react"

// Tipo para el elemento detallado
type ElementoDetallado = {
  id: string
  cedulaId: string
  cedulaNombre: string
  meta: string
  renglon: string
  actividad: string
  unidad: string
  cantidad: number
  costoDirecto: number
  porcentajeInp: number
  montoInp: number
  porcentajeFactInt: number
  montoIndirUtilidad: number
  total: number
  precioUnitario: number
  porcentaje: number
}

interface TablaCedulasAsociadasProps {
  elementosDetallados: ElementoDetallado[]
  onVerDetalle: (cedulaId: string) => void
  onDesasociar: (cedulaId: string) => void
}

export function TablaCedulasAsociadas({ elementosDetallados, onVerDetalle, onDesasociar }: TablaCedulasAsociadasProps) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-lg shadow">
      {elementosDetallados.length > 0 ? (
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-zinc-700">
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Meta
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Renglón
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actividad
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Unid
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Cant
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Costo Directo
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                %Inp
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Q. Inp
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                %Fact Int
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Q indir/utili
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                P/U
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                %
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
            {elementosDetallados.map((elemento) => (
              <tr key={elemento.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                <td className="px-2 py-1 whitespace-nowrap text-xs">{elemento.meta}</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">{elemento.renglon}</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">{elemento.actividad}</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">{elemento.unidad}</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">{elemento.cantidad}</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">Q{(elemento.costoDirecto || 0).toFixed(2)}</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">{elemento.porcentajeInp || 0}%</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">Q{(elemento.montoInp || 0).toFixed(2)}</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">{elemento.porcentajeFactInt || 0}%</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">
                  Q{(elemento.montoIndirUtilidad || 0).toFixed(2)}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-xs font-medium">Q{(elemento.total || 0).toFixed(2)}</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">Q{(elemento.precioUnitario || 0).toFixed(2)}</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">{elemento.porcentaje || 0}%</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">
                  <div className="flex space-x-1">
                    <Button size="xs" variant="ghost" onClick={() => onVerDetalle(elemento.cedulaId)}>
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button size="xs" variant="ghost" onClick={() => onDesasociar(elemento.cedulaId)}>
                      <X className="h-3 w-3 mr-1" />
                      Quitar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No hay cédulas asociadas a este resumen financiero.</p>
        </div>
      )}
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone } from "lucide-react"

export default function AyudaPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Ayuda</h1>
      <Card>
        <CardHeader>
          <CardTitle>Contacto de Soporte</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Para cualquier consulta o mejora, por favor comuníquese con CGT:</p>
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-medium">+502 48494750</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


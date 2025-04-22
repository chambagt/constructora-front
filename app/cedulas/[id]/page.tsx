"use client"
import { useParams, useRouter } from "next/navigation"
import { DetalleCedula } from "@/components/kokonutui/detalle-cedula"

export default function CedulaDetallePage() {
  const params = useParams()
  const router = useRouter()
  const cedulaId = params.id as string

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="container mx-auto py-6">
      <DetalleCedula cedulaId={cedulaId} onBack={handleBack} />
    </div>
  )
}

"use client"

import { useParams } from "next/navigation"
import { NuevaCedula } from "@/components/kokonutui/nueva-cedula"

export default function NuevaCedulaDesdePage() {
  const params = useParams()
  const rfId = params.rfId as string
  const proyectoId = params.proyectoId as string
  const tipo = params.tipo as string

  return (
    <div className="container mx-auto py-6 px-4">
      <NuevaCedula proyectoId={proyectoId} rfId={rfId} tipo={tipo} />
    </div>
  )
}

import { AgregarEmpleadoForm } from "@/components/kokonutui/agregar-empleado-form"

export default function EquipoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Gestión de Equipo</h1>
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Empleado</h2>
        <AgregarEmpleadoForm />
      </div>
    </div>
  )
}

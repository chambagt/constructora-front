"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import type { Proyecto } from "@/components/kokonutui/nuevo-proyecto-form"

import {
  BarChart2,
  Building2,
  Folder,
  Users2,
  Shield,
  Settings,
  HelpCircle,
  Menu,
  Home,
  Hammer,
  Truck,
  ClipboardList,
  Calendar,
  HardHat,
  FileText,
  LogOut,
  DollarSign,
  Calculator,
} from "lucide-react"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  // Añadir este estado al inicio de la función Sidebar
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [proyectosPrincipales, setProyectosPrincipales] = useState<Proyecto[]>([])
  const [proyectosExpandidos, setProyectosExpandidos] = useState<string[]>([])

  // Cargar proyectos principales al montar el componente
  useEffect(() => {
    const cargarProyectos = () => {
      if (typeof window !== "undefined") {
        const proyectosGuardados = JSON.parse(localStorage.getItem("proyectos") || "[]")
        const principales = proyectosGuardados.filter((p: Proyecto) => p.esProyectoPrincipal === true)
        console.log("Proyectos principales cargados:", principales)
        setProyectosPrincipales(principales)
      }
    }

    // Cargar proyectos inmediatamente
    cargarProyectos()

    // Configurar un intervalo para verificar periódicamente si hay nuevos proyectos
    const interval = setInterval(cargarProyectos, 2000)

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval)
  }, [])

  // Añadir esta función para manejar la expansión/colapso de secciones
  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section))
    } else {
      setExpandedSections([...expandedSections, section])
    }
  }

  // Función para expandir/colapsar un proyecto específico
  const toggleProyecto = (proyectoId: string) => {
    if (proyectosExpandidos.includes(proyectoId)) {
      setProyectosExpandidos(proyectosExpandidos.filter((id) => id !== proyectoId))
    } else {
      setProyectosExpandidos([...proyectosExpandidos, proyectoId])
    }
  }

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  // Reemplazar la función NavItem existente con esta versión mejorada
  function NavItem({
    href,
    icon: Icon,
    children,
    hasSubItems = false,
    isSubItem = false,
    onClick,
    className = "",
  }: {
    href: string
    icon: any
    children: React.ReactNode
    hasSubItems?: boolean
    isSubItem?: boolean
    onClick?: (e: React.MouseEvent) => void
    className?: string
  }) {
    const handleClick = (e: React.MouseEvent) => {
      if (hasSubItems) {
        e.preventDefault()
        onClick && onClick(e)
      } else {
        handleNavigation()
      }
    }

    // Determinar si este elemento está expandido
    const isExpanded = expandedSections.includes(href) || proyectosExpandidos.includes(href)

    return (
      <Link
        href={href}
        onClick={handleClick}
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23] ${
          isSubItem ? "pl-10" : ""
        } ${className}`}
      >
        {Icon && <Icon className="h-4 w-4 mr-3 flex-shrink-0" />}
        {children}
        {hasSubItems && (
          <svg
            className={`ml-auto h-4 w-4 transition-transform ${isExpanded ? "transform rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        )}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
              fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
              lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]
              ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
      >
        <div className="h-full flex flex-col">
          <Link href="/" className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-md flex items-center justify-center text-white dark:text-zinc-900 font-bold text-lg">
                C
              </div>
              <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                ConfyaConstructor
              </span>
            </div>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  General
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard" icon={Home}>
                    Panel de Control
                  </NavItem>
                  <NavItem href="#" icon={BarChart2}>
                    Análisis
                  </NavItem>
                  <NavItem href="#" icon={Building2}>
                    Organización
                  </NavItem>

                  {/* Sección de Proyectos modificada */}
                  <div>
                    <NavItem
                      href="/proyectos"
                      icon={Folder}
                      hasSubItems={true}
                      onClick={() => toggleSection("/proyectos")}
                    >
                      Proyectos
                    </NavItem>

                    {expandedSections.includes("/proyectos") && (
                      <div className="ml-2 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-[#1F1F23]">
                        {/* Proyectos principales */}
                        {proyectosPrincipales.map((proyecto) => (
                          <div key={proyecto.id}>
                            <NavItem
                              href={`/proyectos/${proyecto.id}`}
                              icon={() => null}
                              isSubItem
                              hasSubItems={true}
                              onClick={(e) => {
                                e.preventDefault()
                                toggleProyecto(proyecto.id)
                              }}
                            >
                              {proyecto.nombre}
                            </NavItem>

                            {/* Subproyectos (presupuesto y venta) */}
                            {proyectosExpandidos.includes(proyecto.id) && (
                              <div className="ml-2 space-y-1 border-l-2 border-gray-200 dark:border-[#1F1F23]">
                                {/* Proyecto Presupuesto (RF) */}
                                <NavItem
                                  href={`/proyectos/${proyecto.id}/presupuesto`}
                                  icon={Calculator}
                                  isSubItem={true}
                                >
                                  Presupuesto (RF)
                                </NavItem>

                                {/* Proyecto Venta (RF) */}
                                <NavItem href={`/proyectos/${proyecto.id}/venta`} icon={DollarSign} isSubItem={true}>
                                  Venta (RF)
                                </NavItem>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Construcción
                </div>
                <div className="space-y-1">
                  <NavItem href="/materiales" icon={Hammer}>
                    Materiales
                  </NavItem>
                  <NavItem href="/equipamiento" icon={Truck}>
                    Equipamiento
                  </NavItem>
                  <NavItem href="/mano-de-obra" icon={HardHat}>
                    Mano de Obra
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Gestión
                </div>
                <div className="space-y-1">
                  <NavItem href="/equipo" icon={Users2}>
                    Equipo
                  </NavItem>
                  <NavItem href="#" icon={Shield}>
                    Permisos
                  </NavItem>
                  <NavItem href="#" icon={ClipboardList}>
                    Informes
                  </NavItem>
                  <NavItem href="#" icon={Calendar}>
                    Calendario
                  </NavItem>
                  <NavItem href="/cedulas" icon={FileText}>
                    Cédulas
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="/configuraciones" icon={Settings}>
                Configuraciones
              </NavItem>
              <NavItem href="#" icon={HelpCircle}>
                Ayuda
              </NavItem>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23] w-full"
              >
                <LogOut className="h-4 w-4 mr-3 flex-shrink-0" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

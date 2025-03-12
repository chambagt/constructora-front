"use client"

import type React from "react"
import { useRouter } from "next/navigation"

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
} from "lucide-react"

import Link from "next/link"
import { useState } from "react"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string
    icon: any
    children: React.ReactNode
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
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
                  <NavItem href="/proyectos" icon={Folder}>
                    Proyectos
                  </NavItem>
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
                  <NavItem href="#" icon={Truck}>
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


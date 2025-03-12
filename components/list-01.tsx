import { cn } from "@/lib/utils"
import { ArrowRight, Building, Hammer, Home, Plus, Truck } from "lucide-react"

interface ProjectItem {
  id: string
  title: string
  description?: string
  progress: string
  type: "residential" | "commercial" | "infrastructure" | "renovation"
}

interface List01Props {
  totalProjects?: string
  projects?: ProjectItem[]
  className?: string
}

const PROJECTS: ProjectItem[] = [
  {
    id: "1",
    title: "Riverside Apartments",
    description: "Multi-family housing",
    progress: "65%",
    type: "residential",
  },
  {
    id: "2",
    title: "Downtown Office Tower",
    description: "Corporate headquarters",
    progress: "30%",
    type: "commercial",
  },
  {
    id: "3",
    title: "Highway Bridge Repair",
    description: "Infrastructure maintenance",
    progress: "85%",
    type: "infrastructure",
  },
  {
    id: "4",
    title: "Historic Building Renovation",
    description: "Heritage preservation",
    progress: "45%",
    type: "renovation",
  },
  {
    id: "5",
    title: "Community Center",
    description: "Public facility",
    progress: "15%",
    type: "commercial",
  },
]

export default function List01({ totalProjects = "5 Active Projects", projects = PROJECTS, className }: List01Props) {
  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto",
        "bg-white dark:bg-zinc-900/70",
        "border border-zinc-100 dark:border-zinc-800",
        "rounded-xl shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      {/* Total Projects Section */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">Project Overview</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{totalProjects}</h1>
      </div>

      {/* Projects List */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Your Projects</h2>
        </div>

        <div className="space-y-1">
          {projects.map((project) => (
            <div
              key={project.id}
              className={cn(
                "group flex items-center justify-between",
                "p-2 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn("p-1.5 rounded-lg", {
                    "bg-emerald-100 dark:bg-emerald-900/30": project.type === "residential",
                    "bg-blue-100 dark:bg-blue-900/30": project.type === "commercial",
                    "bg-purple-100 dark:bg-purple-900/30": project.type === "infrastructure",
                    "bg-amber-100 dark:bg-amber-900/30": project.type === "renovation",
                  })}
                >
                  {project.type === "residential" && (
                    <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {project.type === "commercial" && (
                    <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  )}
                  {project.type === "infrastructure" && (
                    <Truck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  )}
                  {project.type === "renovation" && (
                    <Hammer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{project.title}</h3>
                  {project.description && (
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{project.description}</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{project.progress}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Updated footer with four buttons */}
      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>View All</span>
          </button>
        </div>
      </div>
    </div>
  )
}


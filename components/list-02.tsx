import { cn } from "@/lib/utils"
import { Hammer, Truck, Users, ClipboardCheck, type LucideIcon, ArrowRight } from "lucide-react"

interface Activity {
  id: string
  title: string
  description: string
  type: "material" | "equipment" | "labor" | "inspection"
  category: string
  icon: LucideIcon
  timestamp: string
  status: "completed" | "pending" | "in-progress"
}

interface List02Props {
  activities?: Activity[]
  className?: string
}

const categoryStyles = {
  material: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
  equipment: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
  labor: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
  inspection: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
}

const ACTIVITIES: Activity[] = [
  {
    id: "1",
    title: "Concrete Delivery",
    description: "Foundation materials arrived",
    type: "material",
    category: "material",
    icon: Truck,
    timestamp: "Today, 2:45 PM",
    status: "completed",
  },
  {
    id: "2",
    title: "Crane Installation",
    description: "Heavy equipment setup",
    type: "equipment",
    category: "equipment",
    icon: Truck,
    timestamp: "Today, 9:00 AM",
    status: "completed",
  },
  {
    id: "3",
    title: "Electrical Team Onsite",
    description: "Wiring installation began",
    type: "labor",
    category: "labor",
    icon: Users,
    timestamp: "Yesterday",
    status: "in-progress",
  },
  {
    id: "4",
    title: "Structural Inspection",
    description: "City inspector approval",
    type: "inspection",
    category: "inspection",
    icon: ClipboardCheck,
    timestamp: "Today, 2:45 PM",
    status: "completed",
  },
  {
    id: "5",
    title: "Plumbing Materials",
    description: "Pipes and fixtures delivery",
    type: "material",
    category: "material",
    icon: Hammer,
    timestamp: "Yesterday",
    status: "pending",
  },
  {
    id: "6",
    title: "Roofing Team Scheduled",
    description: "Team arriving tomorrow",
    type: "labor",
    category: "labor",
    icon: Users,
    timestamp: "Yesterday",
    status: "pending",
  },
]

export default function List02({ activities = ACTIVITIES, className }: List02Props) {
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
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Site Activity
            <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-1">(23 activities)</span>
          </h2>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">This Week</span>
        </div>

        <div className="space-y-1">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={cn(
                "group flex items-center gap-3",
                "p-2 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg",
                  "bg-zinc-100 dark:bg-zinc-800",
                  "border border-zinc-200 dark:border-zinc-700",
                )}
              >
                <activity.icon className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
              </div>

              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{activity.title}</h3>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{activity.timestamp}</p>
                </div>

                <div className="flex items-center gap-1.5 pl-3">
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      activity.status === "completed"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : activity.status === "in-progress"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
                    )}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-center gap-2",
            "py-2 px-3 rounded-lg",
            "text-xs font-medium",
            "bg-gradient-to-r from-zinc-900 to-zinc-800",
            "dark:from-zinc-50 dark:to-zinc-200",
            "text-zinc-50 dark:text-zinc-900",
            "hover:from-zinc-800 hover:to-zinc-700",
            "dark:hover:from-zinc-200 dark:hover:to-zinc-300",
            "shadow-sm hover:shadow",
            "transform transition-all duration-200",
            "hover:-translate-y-0.5",
            "active:translate-y-0",
            "focus:outline-none focus:ring-2",
            "focus:ring-zinc-500 dark:focus:ring-zinc-400",
            "focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
          )}
        >
          <span>View All Activities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

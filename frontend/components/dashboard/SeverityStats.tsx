import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import anime from "animejs"
import { AlertTriangle, AlertCircle, Info, Shield, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SeverityStat {
  name: string
  count: number
  color: string
  bg: string
  icon: typeof AlertTriangle
}

interface SeverityStatsProps {
  stats: Record<string, number>
}

const severityConfig: Record<string, { color: string; bg: string; icon: typeof AlertTriangle; label: string; textColor: string; bgColor: string; borderColor: string }> = {
  critical: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: XCircle, label: "Critical", textColor: "#DC2626", bgColor: "rgba(220, 38, 38, 0.12)", borderColor: "rgba(220, 38, 38, 0.3)" },
  high: { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", icon: AlertTriangle, label: "High", textColor: "#D97706", bgColor: "rgba(217, 119, 6, 0.12)", borderColor: "rgba(217, 119, 6, 0.3)" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: AlertCircle, label: "Medium", textColor: "#CA8A04", bgColor: "rgba(202, 138, 4, 0.12)", borderColor: "rgba(202, 138, 4, 0.3)" },
  low: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: Info, label: "Low", textColor: "#0284C7", bgColor: "rgba(2, 132, 199, 0.12)", borderColor: "rgba(2, 132, 199, 0.3)" },
  info: { color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20", icon: Shield, label: "Info", textColor: "#6B7280", bgColor: "rgba(107, 114, 128, 0.12)", borderColor: "rgba(107, 114, 128, 0.3)" },
}

function AnimatedCounter({ value, className, style }: { value: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (ref.current) {
      anime({
        targets: ref.current,
        innerHTML: [0, value],
        easing: "easeOutExpo",
        round: 1,
        duration: 1200,
      })
    }
  }, [value])

  return (
    <span ref={ref} className={cn("text-xl font-bold", className)} style={style}>
      0
    </span>
  )
}

export default function SeverityStats({ stats }: SeverityStatsProps) {
  const severities = ["critical", "high", "medium", "low", "info"]

  return (
    <div className="flex gap-3">
      {severities.map((sev, index) => {
        const config = severityConfig[sev]
        const count = stats[sev] || 0
        const Icon = config.icon

        return (
          <motion.div
            key={sev}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex-1 border p-3 cursor-pointer transition-all duration-150 hover:opacity-90"
            style={{
              borderRadius: "6px",
              backgroundColor: config.bgColor,
              borderColor: config.borderColor,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: config.textColor }}>
                  {config.label}
                </p>
                <AnimatedCounter value={count} className="" style={{ color: config.textColor }} />
              </div>
              <div className="w-8 h-8 flex items-center justify-center" style={{ borderRadius: "4px", backgroundColor: config.bgColor }}>
                <Icon className="w-4 h-4" style={{ color: config.textColor }} />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import anime from "animejs"
import { GitBranch, Users, Layers, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChainStatsProps {
  totalChains: number
  avgConfidence: number
  totalUsers: number
  totalPhases: number
}

function AnimatedValue({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (ref.current) {
      anime({
        targets: ref.current,
        innerHTML: [0, value],
        easing: "easeOutExpo",
        round: suffix === "%" ? 1 : 1,
        duration: 1200,
      })
    }
  }, [value, suffix])

  return (
    <span ref={ref} className="text-2xl font-bold text-white">
      0{suffix}
    </span>
  )
}

const stats = [
  { key: "chains", label: "Total Chains", icon: GitBranch, color: "text-purple-400", bg: "bg-purple-500/10" },
  { key: "confidence", label: "Avg Confidence", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
  { key: "users", label: "Users Affected", icon: Users, color: "text-orange-400", bg: "bg-orange-500/10" },
  { key: "phases", label: "Kill Phases", icon: Layers, color: "text-green-400", bg: "bg-green-500/10" },
]

export default function ChainStats({ totalChains, avgConfidence, totalUsers, totalPhases }: ChainStatsProps) {
  const values: Record<string, number> = {
    chains: totalChains,
    confidence: Math.round(avgConfidence * 100),
    users: totalUsers,
    phases: totalPhases,
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-zinc-900 border border-zinc-800 p-4"
            style={{ borderRadius: "6px" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <AnimatedValue
                  value={values[stat.key]}
                  suffix={stat.key === "confidence" ? "%" : ""}
                />
              </div>
              <div className={cn("w-9 h-9 flex items-center justify-center", stat.bg)} style={{ borderRadius: "6px" }}>
                <Icon className={cn("w-4 h-4", stat.color)} />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

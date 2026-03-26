import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import anime from "animejs"
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThreatLevelProps {
  score: number
  threatLevel: string
}

const threatConfig: Record<string, { color: string; bg: string; icon: typeof Shield; label: string }> = {
  CRITICAL: {
    color: "text-purple-400",
    bg: "bg-white-500/10 border-black-500/20",
    icon: ShieldX,
    label: "Critical Threat Detected",
  },
  HIGH: {
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    icon: ShieldAlert,
    label: "High Risk Activity",
  },
  MEDIUM: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    icon: ShieldAlert,
    label: "Medium Risk",
  },
  LOW: {
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    icon: ShieldCheck,
    label: "Low Risk",
  },
}

export default function ThreatLevel({ score, threatLevel }: ThreatLevelProps) {
  const scoreRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const config = threatConfig[threatLevel] || threatConfig.LOW
  const Icon = config.icon

  useEffect(() => {
    if (scoreRef.current) {
      anime({
        targets: scoreRef.current,
        innerHTML: [0, score],
        easing: "easeOutExpo",
        round: 1,
        duration: 2000,
      })
    }
    if (barRef.current) {
      anime({
        targets: barRef.current,
        width: [`${0}%`, `${score}%`],
        easing: "easeOutExpo",
        duration: 2000,
      })
    }
  }, [score])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn("border p-5", config.bg)}
      style={{ borderRadius: "6px" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-black-500 uppercase tracking-wider mb-1">
            Threat Level
          </p>
          <p className={cn("text-lg font-bold", config.color)}>{config.label}</p>
        </div>
        <div className={cn("w-12 h-12 flex items-center justify-center bg-zinc-800")} style={{ borderRadius: "6px" }}>
          <Icon className={cn("w-6 h-6", config.color)} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span ref={scoreRef} className={cn("text-3xl font-bold", config.color)}>
            0
          </span>
          <span className="text-sm text-black-500">/ 100</span>
        </div>

        <div className="h-2 bg-zinc-800 overflow-hidden" style={{ borderRadius: "4px" }}>
          <div
            ref={barRef}
            className={cn(
              "h-full",
              threatLevel === "CRITICAL"
                ? "bg-purple-500"
                : threatLevel === "HIGH"
                ? "bg-green-500"
                : threatLevel === "MEDIUM"
                ? "bg-yellow-500"
                : "bg-blue-500"
            )}
            style={{ width: "0%", borderRadius: "4px" }}
          />
        </div>
      </div>
    </motion.div>
  )
}

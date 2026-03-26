import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface KillChainTimelineProps {
  phases: string[]
}

const phaseOrder = [
  "initial-access",
  "execution",
  "credential-access",
  "privilege-escalation",
  "defense-evasion",
  "persistence",
  "lateral-movement",
  "discovery",
  "collection",
  "command-and-control",
  "exfiltration",
  "impact",
]

const phaseColors: Record<string, string> = {
  "initial-access": "bg-orange-500",
  "execution": "bg-yellow-500",
  "credential-access": "bg-red-500",
  "privilege-escalation": "bg-purple-500",
  "defense-evasion": "bg-indigo-500",
  "persistence": "bg-pink-500",
  "lateral-movement": "bg-blue-500",
  "discovery": "bg-cyan-500",
  "collection": "bg-teal-500",
  "command-and-control": "bg-green-500",
  "exfiltration": "bg-emerald-500",
  "impact": "bg-rose-500",
}

export default function KillChainTimeline({ phases }: KillChainTimelineProps) {
  const sortedPhases = phaseOrder.filter(p => phases.includes(p))

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        Kill Chain Progression
      </p>

      {/* Visual Bar */}
      <div className="flex gap-1.5">
        {sortedPhases.map((phase, index) => (
          <motion.div
            key={phase}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className={cn(
              "flex-1 h-10 flex items-center justify-center origin-left",
              phaseColors[phase] || "bg-zinc-600"
            )}
            style={{ borderRadius: "4px" }}
          >
            <span className="text-[10px] font-semibold capitalize truncate px-1" style={{ color: "#ffffff" }}>
              {phase.split("-")[0]}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Full phase names */}
      <div className="flex gap-1.5">
        {sortedPhases.map((phase) => (
          <div key={phase} className="flex-1 text-center">
            <span className="text-[10px] text-zinc-500 capitalize leading-tight block">
              {phase.replace(/-/g, " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

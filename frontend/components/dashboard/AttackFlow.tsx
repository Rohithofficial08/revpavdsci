import React from "react"
import { motion } from "framer-motion"
import { Upload, FileSearch, Shield, AlertTriangle, GitBranch, Sparkles, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface FlowStep {
  label: string
  icon: typeof Upload
  color: string
  bg: string
  value?: string
}

interface AttackFlowProps {
  totalEvents: number
  totalFindings: number
  totalChains: number
  threatLevel: string
}

export default function AttackFlow({ totalEvents, totalFindings, totalChains, threatLevel }: AttackFlowProps) {
  const steps: FlowStep[] = [
    { label: "Log Upload", icon: Upload, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", value: `${totalEvents.toLocaleString()} events` },
    { label: "Analysis", icon: FileSearch, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", value: `${totalFindings} findings` },
    { label: "Correlation", icon: GitBranch, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", value: `${totalChains} chains` },
    { label: "Assessment", icon: Shield, color: threatLevel === "CRITICAL" ? "text-red-400" : threatLevel === "HIGH" ? "text-orange-400" : "text-green-400", bg: threatLevel === "CRITICAL" ? "bg-red-500/10 border-red-500/20" : "bg-green-500/10 border-green-500/20", value: threatLevel },
    { label: "AI Report", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", value: "Generated" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-zinc-900 border border-zinc-800 p-4"
      style={{ borderRadius: "6px" }}
    >
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Analysis Pipeline</p>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <React.Fragment key={step.label}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={cn("w-11 h-11 border flex items-center justify-center mb-2", step.bg)} style={{ borderRadius: "6px" }}>
                  <Icon className={cn("w-5 h-5", step.color)} />
                </div>
                <p className="text-[10px] font-semibold text-zinc-300 text-center">{step.label}</p>
                {step.value && <p className="text-[9px] text-zinc-500 mt-0.5">{step.value}</p>}
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  className="flex-1 flex items-center justify-center px-1 origin-left"
                >
                  <div className="flex-1 h-0.5 bg-zinc-700" />
                  <ChevronRight className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                </motion.div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </motion.div>
  )
}

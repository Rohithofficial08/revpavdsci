import React from "react"
import { motion } from "framer-motion"
import { Target, Shield, AlertTriangle, ChevronRight, Lock, Unlock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AttackTreeProps {
  chain: {
    chain: string[]
    confidence: number
    evidence: string[]
    kill_chain_phases: string[]
  }
}

const phaseIcons: Record<string, typeof Shield> = {
  "initial-access": Unlock,
  "credential-access": Lock,
  "execution": AlertTriangle,
  "privilege-escalation": Shield,
  "persistence": Target,
  "lateral-movement": ChevronRight,
}

const phaseDescriptions: Record<string, string> = {
  "initial-access": "Entry point gained",
  "credential-access": "Credentials obtained",
  "execution": "Code/commands run",
  "privilege-escalation": "Admin rights gained",
  "persistence": "Backdoor installed",
  "lateral-movement": "Spread to other hosts",
  "defense-evasion": "Logs tampered",
  "discovery": "Network mapped",
}

export default function AttackTree({ chain }: AttackTreeProps) {
  const phases = chain.kill_chain_phases.length > 0
    ? chain.kill_chain_phases
    : ["initial-access", "credential-access", "execution", "privilege-escalation"]

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        Attack Tree
      </p>

      {/* Root Goal */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center"
      >
        <div className="px-4 py-2 bg-red-500/15 border border-red-500/30 text-center" style={{ borderRadius: "6px" }}>
          <Target className="w-4 h-4 mx-auto mb-1" style={{ color: "#ffffff" }} />
          <span className="text-xs font-semibold block" style={{ color: "#ffffff" }}>SYSTEM COMPROMISED</span>
        </div>
      </motion.div>

      {/* Tree branches */}
      <div className="relative">
        {/* Vertical line from root */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-4 bg-zinc-600 origin-top"
        />
      </div>

      {/* Attack steps as tree nodes */}
      <div className="space-y-2 pl-4">
        {phases.map((phase, i) => {
          const Icon = phaseIcons[phase] || Shield
          const desc = phaseDescriptions[phase] || phase.replace(/-/g, " ")

          return (
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-3"
            >
              {/* Branch line */}
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 bg-zinc-700 border-2 border-zinc-500" style={{ borderRadius: "50%" }} />
                {i < phases.length - 1 && <div className="w-0.5 h-8 bg-zinc-700" />}
              </div>

              {/* Node content */}
              <div
                className="flex-1 flex items-center gap-3 px-3 py-2.5 bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-colors"
                style={{ borderRadius: "6px" }}
              >
                <div className="w-8 h-8 bg-zinc-700/50 flex items-center justify-center flex-shrink-0" style={{ borderRadius: "4px" }}>
                  <Icon className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-200 capitalize">
                    {phase.replace(/-/g, " ")}
                  </p>
                  <p className="text-[10px] text-zinc-500">{desc}</p>
                </div>
                <span className="text-[10px] text-zinc-600 font-mono">T{i + 1}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Final outcome */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="flex justify-center pt-2"
      >
        <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-center" style={{ borderRadius: "4px" }}>
          <span className="text-[10px] font-semibold" style={{ color: "#ffffff" }}>
            GOAL ACHIEVED
          </span>
        </div>
      </motion.div>
    </div>
  )
}

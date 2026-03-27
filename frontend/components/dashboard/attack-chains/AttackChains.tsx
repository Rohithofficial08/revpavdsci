import React from "react"
import { motion } from "framer-motion"
import { GitBranch, ChevronRight, User, Server, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface Chain {
  id: string
  chain_index: number
  title: string
  chain_confidence: number
  kill_chain_phases: string[]
  affected_users: string[]
  affected_hosts: string[]
}

interface AttackChainsProps {
  chains: Chain[]
  onViewAll?: () => void
}

const nodeColors: Record<string, string> = {
  "credential-access": "bg-red-500",
  "initial-access": "bg-orange-500",
  "execution": "bg-yellow-500",
  "privilege-escalation": "bg-purple-500",
  "persistence": "bg-pink-500",
  "defense-evasion": "bg-indigo-500",
  "lateral-movement": "bg-blue-500",
  "discovery": "bg-cyan-500",
  "collection": "bg-teal-500",
  "command-and-control": "bg-green-500",
  "exfiltration": "bg-emerald-500",
  "impact": "bg-rose-500",
}

export default function AttackChains({ chains, onViewAll }: AttackChainsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-zinc-900 border border-zinc-800"
      style={{ borderRadius: "6px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Attack Chains</h3>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5" style={{ borderRadius: "4px" }}>
            {chains.length}
          </span>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            View All
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Chains */}
      <div className="p-4 space-y-4">
        {chains.slice(0, 3).map((chain, index) => (
          <motion.div
            key={chain.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-zinc-800/50 border border-zinc-700/50 p-4 cursor-pointer hover:border-zinc-600/50 transition-colors"
            style={{ borderRadius: "6px" }}
          >
            {/* Chain Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-white">
                  {chain.affected_users[0] || "Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5",
                    chain.chain_confidence >= 0.8
                      ? "text-red-400 bg-red-500/10"
                      : chain.chain_confidence >= 0.5
                      ? "text-orange-400 bg-orange-500/10"
                      : "text-yellow-400 bg-yellow-500/10"
                  )}
                  style={{ borderRadius: "4px" }}
                >
                  {Math.round(chain.chain_confidence * 100)}%
                </span>
              </div>
            </div>

            {/* Kill Chain Phases */}
            <div className="flex items-center gap-1 flex-wrap">
              {chain.kill_chain_phases.map((phase, i) => (
                <React.Fragment key={phase}>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-2 py-1 text-white",
                      nodeColors[phase] || "bg-zinc-600"
                    )}
                    style={{ borderRadius: "4px" }}
                  >
                    {phase.replace("-", " ")}
                  </span>
                  {i < chain.kill_chain_phases.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-zinc-600" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Chain Title */}
            <p className="text-xs text-zinc-400 mt-2 truncate">
              {chain.title}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

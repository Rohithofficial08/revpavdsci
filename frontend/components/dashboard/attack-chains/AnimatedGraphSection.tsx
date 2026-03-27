import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Network, RotateCcw, Wifi, Activity } from "lucide-react"
import AnimatedAttackGraph from "./AnimatedAttackGraph"

interface AnimatedGraphSectionProps {
  analysisId: string
  selectedChain: any | null
}

interface GraphNode {
  id: string
  type: string
  label: string
  x: number
  y: number
  sublabel?: string
}

interface GraphEdge {
  source: string
  target: string
  label?: string
  technique?: string
  severity?: "critical" | "high" | "medium"
}

// Maps kill-chain phase names → MITRE techniques for edge labels
const PHASE_TO_TECHNIQUE: Record<string, string> = {
  "credential-access":     "T1110.001",
  "initial-access":        "T1078",
  "execution":             "T1059.001",
  "privilege-escalation":  "T1548.002",
  "persistence":           "T1053.005",
  "defense-evasion":       "T1070.004",
  "lateral-movement":      "T1021.002",
  "discovery":             "T1082",
  "collection":            "T1005",
  "command-and-control":   "T1071.001",
  "exfiltration":          "T1041",
  "impact":                "T1486",
}

// Maps phase to severity for edge coloring
const PHASE_SEVERITY: Record<string, "critical" | "high" | "medium"> = {
  "impact":               "critical",
  "exfiltration":         "critical",
  "privilege-escalation": "critical",
  "lateral-movement":     "high",
  "credential-access":    "high",
  "persistence":          "high",
  "initial-access":       "medium",
  "execution":            "medium",
  "discovery":            "medium",
  "defense-evasion":      "medium",
  "collection":           "medium",
}

// Maps phase index to a node type
const PHASE_NODE_TYPE: Record<string, string> = {
  "initial-access":        "attacker",
  "credential-access":     "attacker",
  "execution":             "service",
  "privilege-escalation":  "service",
  "persistence":           "service",
  "defense-evasion":       "service",
  "lateral-movement":      "host",
  "discovery":             "user",
  "collection":            "host",
  "command-and-control":   "dc",
  "exfiltration":          "target",
  "impact":                "target",
}

function buildGraph(chain: any): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const phases: string[] = chain.kill_chain_phases || []
  const hosts: string[] = chain.affected_hosts || ["HOST-01"]
  const users: string[] = chain.affected_users || ["CORP\\admin"]

  if (!phases.length) return { nodes: [], edges: [] }

  const count = phases.length
  // Layout: evenly spaced horizontally, with slight vertical offset for zigzag
  const W = 900
  const padding = 80
  const spacing = (W - padding * 2) / Math.max(count - 1, 1)

  const nodes: GraphNode[] = phases.map((phase, i) => {
    const zigzag = count > 3 ? (i % 2 === 0 ? 130 : 200) : 165
    const type = PHASE_NODE_TYPE[phase] || "service"
    const hostLabel = hosts[i % hosts.length] || "HOST"
    const userLabel = users[i % users.length] || "admin"

    let label = phase.replace(/-/g, " ")
    let sublabel = type === "attacker" ? userLabel : hostLabel

    return {
      id: `node-${i}`,
      type,
      label: label.split(" ").map((w: string) => w[0].toUpperCase() + w.slice(1)).join(" "),
      sublabel,
      x: padding + i * spacing,
      y: zigzag,
    }
  })

  const edges: GraphEdge[] = phases.slice(0, -1).map((phase, i) => ({
    source: `node-${i}`,
    target: `node-${i + 1}`,
    technique: PHASE_TO_TECHNIQUE[phases[i + 1]] || PHASE_TO_TECHNIQUE[phase],
    severity: PHASE_SEVERITY[phases[i + 1]] || "high",
  }))

  return { nodes, edges }
}

const LEGEND_ITEMS = [
  { color: "#f87171", label: "Attacker / Source" },
  { color: "#60a5fa", label: "User account" },
  { color: "#34d399", label: "Host / Server" },
  { color: "#a78bfa", label: "Domain Controller" },
  { color: "#f97316", label: "Impact / Target" },
]

const SEVERITY_EDGES = [
  { color: "#f87171", label: "Critical" },
  { color: "#f97316", label: "High" },
  { color: "#fbbf24", label: "Medium" },
]

export default function AnimatedGraphSection({ analysisId, selectedChain }: AnimatedGraphSectionProps) {
  const [graph, setGraph] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] }>({ nodes: [], edges: [] })
  const [isPlaying, setIsPlaying] = useState(true)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (selectedChain) {
      const built = buildGraph(selectedChain)
      setGraph(built)
      setKey(prev => prev + 1)
      setIsPlaying(true)
    }
  }, [selectedChain])

  const handleReplay = () => {
    setKey(prev => prev + 1)
    setIsPlaying(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="overflow-hidden"
      style={{ borderRadius: "8px", backgroundColor: "#0c0c0f", border: "1px solid #27272a" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #27272a", backgroundColor: "#09090b" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center" style={{ borderRadius: "6px", backgroundColor: "rgba(59,130,246,0.1)" }}>
            <Network className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>Live Attack Graph</h3>
            <p className="text-[10px]" style={{ color: "#71717a" }}>Real-time threat propagation visualization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5">
            <motion.span
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#4ade80" }}>Live</span>
          </div>

          {/* Chain name badge */}
          {selectedChain && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 max-w-[200px]" style={{ borderRadius: "4px", backgroundColor: "#27272a", border: "1px solid #3f3f46" }}>
              <Activity className="w-3 h-3 flex-shrink-0" style={{ color: "#c084fc" }} />
              <span className="text-[10px] truncate" style={{ color: "#d4d4d8" }}>Chain #{selectedChain.chain_index}</span>
            </div>
          )}

          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 text-xs transition-all duration-150"
            style={{ borderRadius: "4px", color: "#a1a1aa", padding: "6px 12px", backgroundColor: "transparent", border: "1px solid #3f3f46" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#27272a"; e.currentTarget.style.color = "#ffffff" }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#a1a1aa" }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Replay
          </button>
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="relative" style={{ minHeight: "320px", backgroundColor: "#09090b" }}>
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-blue-500/20" style={{ borderRadius: "8px 0 0 0" }} />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-blue-500/20" style={{ borderRadius: "0 8px 0 0" }} />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-blue-500/20" style={{ borderRadius: "0 0 0 8px" }} />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-blue-500/20" style={{ borderRadius: "0 0 8px 0" }} />

        <AnimatePresence mode="wait">
          {graph.nodes.length > 0 ? (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 pt-6 pb-2"
            >
              <AnimatedAttackGraph
                nodes={graph.nodes}
                edges={graph.edges}
                isPlaying={isPlaying}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 gap-3"
            >
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Network className="w-10 h-10" style={{ color: "#3f3f46" }} />
              </motion.div>
              <p className="text-sm" style={{ color: "#52525b" }}>Select a chain to visualize the attack path</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer: Legend */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3" style={{ borderTop: "1px solid #27272a", backgroundColor: "#09090b" }}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#52525b" }}>Node Types</span>
        {LEGEND_ITEMS.map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }} />
            <span className="text-[10px]" style={{ color: "#71717a" }}>{item.label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#52525b" }}>Edge Severity</span>
          {SEVERITY_EDGES.map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-6 h-0.5" style={{ backgroundColor: item.color }} />
              <span className="text-[10px]" style={{ color: "#71717a" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

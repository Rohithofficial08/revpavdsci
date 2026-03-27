import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Network, Play, Pause, RotateCcw } from "lucide-react"
import AnimatedAttackGraph from "./AnimatedAttackGraph"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"

interface AnimatedGraphSectionProps {
  analysisId: string
  selectedChain: any | null
}

interface GraphData {
  nodes: { id: string; type: string; label: string }[]
  edges: { source: string; target: string; label?: string; technique?: string }[]
}

export default function AnimatedGraphSection({ analysisId, selectedChain }: AnimatedGraphSectionProps) {
  const [graph, setGraph] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (selectedChain) {
      // Form the graph from the chain data
      const steps = selectedChain.title.split(" → ")
      const nodes = steps.map((step: string, i: number) => {
        const timeMatch = step.match(/\[(.*?)\]/)
        const label = step.replace(/\[.*?\]/, "").trim()
        return {
          id: `step-${i}`,
          type: i === 0 ? "initial" : i === steps.length - 1 ? "impact" : "action",
          label: label,
          time: timeMatch ? timeMatch[1] : ""
        }
      })

      const edges = []
      for (let i = 0; i < nodes.length - 1; i++) {
        edges.push({
          source: nodes[i].id,
          target: nodes[i+1].id,
          label: "next-stage"
        })
      }

      setGraph({ nodes, edges })
      setKey(prev => prev + 1)
    }
  }, [selectedChain])

  const loadGraph = async () => {
    // Legacy support or if there's a specialized endpoint
    // For now, we prefer the on-the-fly construction from data
  }

  const handleReplay = () => {
    setKey(prev => prev + 1)
    setIsPlaying(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-zinc-900 border border-zinc-800 overflow-hidden"
      style={{ borderRadius: "6px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Live Attack Graph</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 hover:bg-zinc-800 transition-colors"
            style={{ borderRadius: "4px" }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Replay
          </button>
        </div>
      </div>

      {/* Graph */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm text-zinc-500"
            >
              Loading attack graph...
            </motion.div>
          </div>
        ) : graph && graph.nodes.length > 0 ? (
          <AnimatedAttackGraph key={key} nodes={graph.nodes} edges={graph.edges} />
        ) : (
          <div className="flex items-center justify-center h-48 text-sm text-zinc-500">
            Select a chain to view its attack graph
          </div>
        )}
      </div>
    </motion.div>
  )
}

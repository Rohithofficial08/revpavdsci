import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Server, Globe, Wifi, Shield, AlertTriangle, Zap } from "lucide-react"

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

interface AnimatedAttackGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  isPlaying?: boolean
}

const NODE_CONFIG: Record<string, { icon: any; color: string; border: string; bg: string; glow: string }> = {
  attacker: { icon: Globe,        color: "#f87171", border: "#f87171", bg: "#1c0a0a", glow: "0 0 20px rgba(248,113,113,0.4)" },
  user:     { icon: User,         color: "#60a5fa", border: "#60a5fa", bg: "#0a0f1c", glow: "0 0 20px rgba(96,165,250,0.4)" },
  host:     { icon: Server,       color: "#34d399", border: "#34d399", bg: "#0a1c13", glow: "0 0 20px rgba(52,211,153,0.4)" },
  dc:       { icon: Shield,       color: "#a78bfa", border: "#a78bfa", bg: "#120a1c", glow: "0 0 20px rgba(167,139,250,0.4)" },
  service:  { icon: Zap,          color: "#fbbf24", border: "#fbbf24", bg: "#1c160a", glow: "0 0 20px rgba(251,191,36,0.4)" },
  target:   { icon: AlertTriangle,color: "#f97316", border: "#f97316", bg: "#1c0e0a", glow: "0 0 20px rgba(249,115,22,0.5)" },
  initial:  { icon: Globe,        color: "#f87171", border: "#f87171", bg: "#1c0a0a", glow: "0 0 20px rgba(248,113,113,0.4)" },
  action:   { icon: Zap,          color: "#60a5fa", border: "#60a5fa", bg: "#0a0f1c", glow: "0 0 20px rgba(96,165,250,0.3)" },
  impact:   { icon: AlertTriangle,color: "#f97316", border: "#f97316", bg: "#1c0e0a", glow: "0 0 20px rgba(249,115,22,0.5)" },
}

const EDGE_COLORS: Record<string, string> = {
  critical: "#f87171",
  high:     "#f97316",
  medium:   "#fbbf24",
}

function getNodePos(nodes: GraphNode[], id: string) {
  return nodes.find(n => n.id === id)
}

// Animated "packet" traveling along an edge
function TravelingPacket({ x1, y1, x2, y2, delay, color }: {
  x1: number; y1: number; x2: number; y2: number
  delay: number; color: string
}) {
  return (
    <motion.circle
      r={4}
      fill={color}
      filter="url(#glow)"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        cx: [x1, x2],
        cy: [y1, y2],
      }}
      transition={{
        duration: 1.6,
        delay,
        repeat: Infinity,
        repeatDelay: 2.5,
        ease: "easeInOut",
      }}
    />
  )
}

export default function AnimatedAttackGraph({ nodes, edges, isPlaying = true }: AnimatedAttackGraphProps) {
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(new Set())
  const [visibleEdges, setVisibleEdges] = useState<Set<number>>(new Set())

  // Cascade-reveal nodes and edges for a "live building" effect
  useEffect(() => {
    setVisibleNodes(new Set())
    setVisibleEdges(new Set())
    if (!isPlaying) return

    nodes.forEach((_, i) => {
      setTimeout(() => {
        setVisibleNodes(prev => new Set([...prev, nodes[i].id]))
      }, i * 350)
    })

    edges.forEach((_, i) => {
      setTimeout(() => {
        setVisibleEdges(prev => new Set([...prev, i]))
      }, nodes.length * 350 + i * 300)
    })
  }, [nodes, edges, isPlaying])

  if (!nodes.length) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-600 text-sm">
        No graph data
      </div>
    )
  }

  // Canvas dimensions
  const W = 900
  const H = 340

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minHeight: "280px" }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Gradient for edges */}
          {edges.map((edge, i) => {
            const src = getNodePos(nodes, edge.source)
            const tgt = getNodePos(nodes, edge.target)
            if (!src || !tgt) return null
            const color = EDGE_COLORS[edge.severity || "high"] || "#60a5fa"
            return (
              <linearGradient key={i} id={`edge-grad-${i}`} x1={src.x / W} y1={src.y / H} x2={tgt.x / W} y2={tgt.y / H} gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                <stop offset="50%" stopColor={color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={color} stopOpacity="0.2" />
              </linearGradient>
            )
          })}
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#60a5fa" opacity="0.7" />
          </marker>
        </defs>

        {/* Background grid */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 80} y1={0} x2={i * 80} y2={H} stroke="#ffffff" strokeOpacity="0.025" strokeWidth="1" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 68} x2={W} y2={i * 68} stroke="#ffffff" strokeOpacity="0.025" strokeWidth="1" />
        ))}

        {/* Edges */}
        {edges.map((edge, i) => {
          const src = getNodePos(nodes, edge.source)
          const tgt = getNodePos(nodes, edge.target)
          if (!src || !tgt) return null
          const color = EDGE_COLORS[edge.severity || "high"] || "#60a5fa"
          const isVisible = visibleEdges.has(i)

          // Midpoint for label
          const mx = (src.x + tgt.x) / 2
          const my = (src.y + tgt.y) / 2

          return (
            <g key={i}>
              {/* Base line */}
              <motion.line
                x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                stroke={color}
                strokeOpacity={isVisible ? 0.25 : 0}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                style={{ transition: "stroke-opacity 0.4s" }}
              />
              {/* Glowing line on top */}
              <motion.line
                x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                stroke={`url(#edge-grad-${i})`}
                strokeWidth={isVisible ? 2 : 0}
                markerEnd="url(#arrowhead)"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              {/* Traveling packet */}
              {isVisible && isPlaying && (
                <TravelingPacket
                  x1={src.x} y1={src.y}
                  x2={tgt.x} y2={tgt.y}
                  delay={i * 0.5}
                  color={color}
                />
              )}
              {/* Edge label */}
              {isVisible && edge.technique && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <rect x={mx - 28} y={my - 10} width={56} height={16} rx={4} fill="#18181b" stroke={color} strokeOpacity={0.4} strokeWidth={1} />
                  <text x={mx} y={my + 2} textAnchor="middle" fill={color} fontSize={9} fontFamily="monospace" fontWeight="bold">
                    {edge.technique}
                  </text>
                </motion.g>
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const config = NODE_CONFIG[node.type] || NODE_CONFIG.host
          const Icon = config.icon
          const isVisible = visibleNodes.has(node.id)
          const R = 30

          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
              transition={{ duration: 0.4, ease: "backOut" }}
              style={{ originX: node.x, originY: node.y }}
            >
              {/* Outer glow ring — pulses for threat nodes */}
              {(node.type === "attacker" || node.type === "impact" || node.type === "target") && (
                <motion.circle
                  cx={node.x} cy={node.y} r={R + 8}
                  fill="none"
                  stroke={config.color}
                  strokeWidth={1}
                  strokeOpacity={0.3}
                  animate={{ r: [R + 6, R + 14, R + 6], strokeOpacity: [0.4, 0.1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {/* Node body */}
              <circle cx={node.x} cy={node.y} r={R} fill={config.bg} stroke={config.border} strokeWidth={1.5} filter="url(#strongGlow)" />

              {/* Inner circle ring */}
              <circle cx={node.x} cy={node.y} r={R - 6} fill="none" stroke={config.color} strokeWidth={0.5} strokeOpacity={0.4} />

              {/* Step number badge for sequential nodes */}
              {["action", "initial", "impact"].includes(node.type) && (
                <g>
                  <circle cx={node.x + R - 4} cy={node.y - R + 4} r={9} fill={config.border} />
                  <text x={node.x + R - 4} y={node.y - R + 8} textAnchor="middle" fill="#000" fontSize={9} fontWeight="bold">
                    {i + 1}
                  </text>
                </g>
              )}

              {/* Node label below */}
              <text x={node.x} y={node.y + R + 16} textAnchor="middle" fill="#e4e4e7" fontSize={11} fontWeight="600" fontFamily="system-ui">
                {node.label.length > 14 ? node.label.slice(0, 13) + "…" : node.label}
              </text>
              {node.sublabel && (
                <text x={node.x} y={node.y + R + 30} textAnchor="middle" fill={config.color} fontSize={9} fontFamily="monospace">
                  {node.sublabel}
                </text>
              )}

              {/* Type badge */}
              <text x={node.x} y={node.y + R + 42} textAnchor="middle" fill="#52525b" fontSize={8} fontFamily="monospace">
                {node.type.toUpperCase()}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}

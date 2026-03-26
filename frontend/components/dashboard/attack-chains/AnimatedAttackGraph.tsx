import React from "react"
import { motion } from "framer-motion"
import { User, Server, Globe, Zap, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface GraphNode {
  id: string
  type: string
  label: string
}

interface GraphEdge {
  source: string
  target: string
  label?: string
  technique?: string
}

interface AnimatedAttackGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

const nodeConfig: Record<string, { icon: typeof User; color: string; bg: string; glow: string }> = {
  user: { icon: User, color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/40", glow: "shadow-blue-500/20" },
  host: { icon: Server, color: "text-green-400", bg: "bg-green-500/20 border-green-500/40", glow: "shadow-green-500/20" },
  ip: { icon: Globe, color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/40", glow: "shadow-orange-500/20" },
  service: { icon: Zap, color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/40", glow: "shadow-purple-500/20" },
}

const AnimatedPulse = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
)

const AnimatedLine = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ scaleY: 0 }}
    animate={{ scaleY: 1 }}
    transition={{ duration: 0.3, delay }}
    className="flex flex-col items-center origin-top"
  >
    <div className="w-0.5 h-6 bg-zinc-600" />
    <ChevronDown className="w-3 h-3 text-zinc-600 -mt-1" />
  </motion.div>
)

const AnimatedArrow = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 0.3, delay }}
    className="flex items-center origin-left"
  >
    <div className="w-8 h-0.5 bg-zinc-600" />
    <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-zinc-600" />
  </motion.div>
)

export default function AnimatedAttackGraph({ nodes, edges }: AnimatedAttackGraphProps) {
  if (!nodes.length) {
    return (
      <div className="flex items-center justify-center h-40 text-zinc-500 text-sm">
        No graph data available
      </div>
    )
  }

  const userNodes = nodes.filter(n => n.type === "user")
  const actionNodes = nodes.filter(n => n.type === "service")
  const targetNodes = nodes.filter(n => ["host", "ip"].includes(n.type))

  return (
    <div className="flex flex-col items-center py-2">
      {/* SOURCE: User/Attacker */}
      {userNodes.map((node, i) => {
        const config = nodeConfig[node.type]
        const Icon = config.icon
        return (
          <AnimatedPulse key={node.id} delay={0}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-14 h-14 border-2 flex items-center justify-center shadow-lg",
                  config.bg, config.glow
                )}
                style={{ borderRadius: "8px" }}
              >
                <Icon className={cn("w-7 h-7", config.color)} />
              </div>
              <span className="text-sm font-bold text-white mt-2">{node.label}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Source</span>
            </div>
          </AnimatedPulse>
        )
      })}

      {/* Arrow down */}
      <AnimatedLine delay={0.2} />

      {/* ATTACK STEPS: Horizontal flow */}
      <AnimatedPulse delay={0.3}>
        <div className="flex items-center gap-1 flex-wrap justify-center max-w-full">
          {actionNodes.map((node, i) => (
            <React.Fragment key={node.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.12 }}
                className="relative"
              >
                <div className="px-3 py-2 bg-zinc-800 border border-zinc-700 text-center" style={{ borderRadius: "6px" }}>
                  <span className="text-xs font-semibold text-zinc-200 block">{node.label}</span>
                </div>
                {/* Step number */}
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-purple-600 flex items-center justify-center text-[9px] font-bold text-white" style={{ borderRadius: "50%" }}>
                  {i + 1}
                </div>
              </motion.div>
              {i < actionNodes.length - 1 && (
                <AnimatedArrow delay={0.5 + i * 0.12} />
              )}
            </React.Fragment>
          ))}
        </div>
      </AnimatedPulse>

      {/* Arrow down */}
      {targetNodes.length > 0 && <AnimatedLine delay={0.7 + actionNodes.length * 0.1} />}

      {/* TARGET: Hosts/IPs */}
      {targetNodes.length > 0 && (
        <AnimatedPulse delay={0.8 + actionNodes.length * 0.1}>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {targetNodes.map((node, i) => {
              const config = nodeConfig[node.type] || nodeConfig.host
              const Icon = config.icon
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 + i * 0.1 }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 border-2 shadow-lg",
                    config.bg, config.glow
                  )}
                  style={{ borderRadius: "8px" }}
                >
                  <Icon className={cn("w-5 h-5", config.color)} />
                  <div>
                    <span className="text-sm font-semibold text-white block">{node.label}</span>
                    <span className="text-[9px] text-zinc-500 uppercase">{node.type}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-2 text-center">Compromised</p>
        </AnimatedPulse>
      )}
    </div>
  )
}

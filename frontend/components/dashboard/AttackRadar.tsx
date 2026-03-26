import React from "react"
import { motion } from "framer-motion"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"

interface AttackRadarProps {
  findings: { detection_type: string; severity: string }[]
}

export default function AttackRadar({ findings }: AttackRadarProps) {
  const categories = [
    { name: "Brute Force", key: "rule", color: "#ef4444" },
    { name: "ML Anomaly", key: "ml_anomaly", color: "#8b5cf6" },
    { name: "Travel", key: "impossible_travel", color: "#f97316" },
    { name: "Priv Esc", key: "priv_esc", color: "#eab308" },
    { name: "Persistence", key: "persistence", color: "#3b82f6" },
    { name: "Lateral", key: "lateral", color: "#10b981" },
  ]

  const typeCounts: Record<string, number> = {}
  findings.forEach(f => {
    typeCounts[f.detection_type] = (typeCounts[f.detection_type] || 0) + 1
  })

  const data = categories.map(cat => ({
    subject: cat.name,
    count: typeCounts[cat.key] || 0,
    fullMark: Math.max(...Object.values(typeCounts), 10),
  }))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-zinc-900 border border-zinc-800 p-4"
      style={{ borderRadius: "6px" }}
    >
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Detection Coverage</p>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#a1a1aa" }} />
          <PolarRadiusAxis tick={{ fontSize: 9, fill: "#52525b" }} />
          <Radar name="Detections" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

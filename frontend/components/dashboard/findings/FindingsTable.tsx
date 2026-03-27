import React from "react"
import { motion } from "framer-motion"
import { AlertTriangle, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Finding {
  id: string
  severity: string
  title: string
  detection_type: string
  rule_id?: string
  mitre_techniques?: string[]
  affected_users?: string[]
}

interface FindingsTableProps {
  findings: Finding[]
  onViewAll?: () => void
}

const severityConfig: Record<string, { color: string; bg: string }> = {
  critical: { color: "text-red-1000", bg: "bg-red-500/10 border-red-500/20" },
  high: { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  low: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  info: { color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20" },
}

export default function FindingsTable({ findings, onViewAll }: FindingsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-zinc-900 border border-zinc-800"
      style={{ borderRadius: "6px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-bold text-white">Recent Findings</h3>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5" style={{ borderRadius: "4px" }}>
            {findings.length}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">
                Severity
              </th>
              <th className="text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">
                Finding
              </th>
              <th className="text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">
                Type
              </th>
              <th className="text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">
                MITRE
              </th>
              <th className="text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">
                User
              </th>
            </tr>
          </thead>
          <tbody>
            {findings.slice(0, 10).map((finding, index) => {
              const sev = severityConfig[finding.severity] || severityConfig.info
              return (
                <motion.tr
                  key={finding.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 text-[10px] font-semibold uppercase border",
                        sev.bg,
                        sev.color
                      )}
                      style={{ borderRadius: "4px" }}
                    >
                      {finding.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-zinc-200">{finding.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-400">
                      {finding.detection_type === "rule" ? "Rule" : finding.detection_type === "ml_anomaly" ? "ML" : "Travel"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(finding.mitre_techniques || []).slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5"
                          style={{ borderRadius: "4px" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-400">
                      {(finding.affected_users || []).slice(0, 2).join(", ")}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

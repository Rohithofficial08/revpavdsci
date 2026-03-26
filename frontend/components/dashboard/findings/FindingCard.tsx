import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Clock, User, Server, Globe, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface Finding {
  id: string
  severity: string
  title: string
  description?: string
  detection_type: string
  rule_id?: string
  mitre_techniques?: string[]
  mitre_tactics?: string[]
  affected_users?: string[]
  affected_hosts?: string[]
  source_ips?: string[]
  anomaly_score?: number
  ml_method?: string
  details?: Record<string, any>
  timestamp_start?: string
  timestamp_end?: string
}

interface FindingCardProps {
  finding: Finding
  index: number
}

const severityConfig: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: "text-red-400", bg: "bg-red-100", border: "border-red-500" },
  high: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  low: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  info: { color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
}

const typeLabels: Record<string, string> = {
  rule: "Rule",
  ml_anomaly: "ML",
  impossible_travel: "Travel",
}

export default function FindingCard({ finding, index }: FindingCardProps) {
  const [expanded, setExpanded] = useState(false)
  const sev = severityConfig[finding.severity] || severityConfig.info

  const formatTime = (ts?: string) => {
    if (!ts) return ""
    try {
      return new Date(ts).toLocaleTimeString()
    } catch {
      return ts
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={cn(
        "bg-zinc-900 border transition-colors duration-150",
        expanded ? "border-zinc-700" : "border-zinc-800 hover:border-zinc-700"
      )}
      style={{ borderRadius: "6px" }}
    >
      {/* Main Row */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 p-4 cursor-pointer"
      >
        {/* Severity Badge */}
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border flex-shrink-0",
            sev.bg,
            sev.color,
            sev.border
          )}
          style={{ borderRadius: "4px" }}
        >
          {finding.severity}
        </span>

        {/* Title & Meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{finding.title}</p>
          <div className="flex items-center gap-3 mt-1">
            {finding.rule_id && (
              <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5" style={{ borderRadius: "3px" }}>
                {finding.rule_id}
              </span>
            )}
            {finding.mitre_techniques?.slice(0, 2).map((t) => (
              <span key={t} className="text-[10px] text-zinc-400">
                {t}
              </span>
            ))}
            {finding.timestamp_start && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                <Clock className="w-2.5 h-2.5" />
                {formatTime(finding.timestamp_start)}
              </span>
            )}
          </div>
        </div>

        {/* Type Badge */}
        <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 flex-shrink-0" style={{ borderRadius: "4px" }}>
          {typeLabels[finding.detection_type] || finding.detection_type}
        </span>

        {/* Expand Icon */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </motion.div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-zinc-800">
              <div className="pt-4 space-y-4">
                {/* Description */}
                {finding.description && (
                  <div>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm text-zinc-300">{finding.description}</p>
                  </div>
                )}

                {/* Affected Entities */}
                <div className="flex gap-4">
                  {finding.affected_users && finding.affected_users.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Users</p>
                      <div className="flex flex-wrap gap-1">
                        {finding.affected_users.slice(0, 5).map((u) => (
                          <span key={u} className="flex items-center gap-1 text-xs text-zinc-300 bg-zinc-800 px-2 py-0.5" style={{ borderRadius: "4px" }}>
                            <User className="w-3 h-3" />
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {finding.affected_hosts && finding.affected_hosts.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Hosts</p>
                      <div className="flex flex-wrap gap-1">
                        {finding.affected_hosts.slice(0, 5).map((h) => (
                          <span key={h} className="flex items-center gap-1 text-xs text-zinc-300 bg-zinc-800 px-2 py-0.5" style={{ borderRadius: "4px" }}>
                            <Server className="w-3 h-3" />
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {finding.source_ips && finding.source_ips.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">IPs</p>
                      <div className="flex flex-wrap gap-1">
                        {finding.source_ips.slice(0, 5).map((ip) => (
                          <span key={ip} className="flex items-center gap-1 text-xs text-zinc-300 bg-zinc-800 px-2 py-0.5" style={{ borderRadius: "4px" }}>
                            <Globe className="w-3 h-3" />
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* MITRE ATT&CK */}
                {finding.mitre_techniques && finding.mitre_techniques.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">MITRE ATT&CK</p>
                    <div className="flex flex-wrap gap-1">
                      {finding.mitre_techniques.map((t) => (
                        <a
                          key={t}
                          href={`https://attack.mitre.org/techniques/${t.replace(".", "/")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 hover:bg-blue-500/20 transition-colors"
                          style={{ borderRadius: "4px" }}
                        >
                          {t}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                      {finding.mitre_tactics?.map((t) => (
                        <span key={t} className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5" style={{ borderRadius: "4px" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ML Score */}
                {finding.anomaly_score !== undefined && finding.anomaly_score !== null && (
                  <div>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">ML Analysis</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-zinc-800 overflow-hidden" style={{ borderRadius: "4px" }}>
                        <div
                          className={cn(
                            "h-full",
                            finding.anomaly_score >= 0.7 ? "bg-red-500" :
                            finding.anomaly_score >= 0.4 ? "bg-orange-500" : "bg-yellow-500"
                          )}
                          style={{ width: `${finding.anomaly_score * 100}%`, borderRadius: "4px" }}
                        />
                      </div>
                      <span className="text-xs text-zinc-300">{(finding.anomaly_score * 100).toFixed(0)}%</span>
                      <span className="text-[10px] text-zinc-500">({finding.ml_method})</span>
                    </div>
                  </div>
                )}

                {/* Raw Details (collapsible) */}
                {finding.details && Object.keys(finding.details).length > 0 && (
                  <details className="group">
                    <summary className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-400 transition-colors">
                      Raw Details
                    </summary>
                    <pre className="mt-2 text-[10px] text-zinc-400 bg-zinc-800/50 p-3 overflow-x-auto" style={{ borderRadius: "4px" }}>
                      {JSON.stringify(finding.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, RefreshCw, Loader2, Copy, Check, Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import AttackRadar from "@/components/dashboard/AttackRadar"
import AttackFlow from "@/components/dashboard/AttackFlow"
import FindingsSummaryTable from "@/components/dashboard/FindingsSummaryTable"
import KeyFindings from "@/components/dashboard/KeyFindings"
import KillChainTimeline from "@/components/dashboard/attack-chains/KillChainTimeline"
import SummaryPageSkeleton from "@/components/dashboard/SummarySkeleton"
import { apiFetch } from "@/lib/api"
import ReactMarkdown from "react-markdown"

interface Summary {
  id: string
  mode: string
  model: string
  cached: boolean
  tokens_used: number
  content_markdown: string
  sections: {
    executive_summary: string
    attack_narrative: string
    affected_assets: string
    remediation_steps: string
  }
  created_at: string
}

interface Analysis {
  id: string
  filename: string
  total_events: number
  total_findings: number
  total_anomalies: number
  total_attack_chains: number
  risk_score: number
}

interface Finding {
  id: string
  severity: string
  title: string
  detection_type: string
  rule_id?: string
  mitre_techniques?: string[]
  affected_users?: string[]
  affected_hosts?: string[]
  details?: Record<string, any>
}

interface Chain {
  id: string
  chain_index: number
  title: string
  chain_confidence: number
  kill_chain_phases: string[]
  affected_users: string[]
}

export default function SummaryPage() {
  const router = useRouter()
  const { id } = router.query
  const [summary, setSummary] = useState<Summary | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [findings, setFindings] = useState<Finding[]>([])
  const [chains, setChains] = useState<Chain[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [mode, setMode] = useState("SOC_ANALYST")
  const [copied, setCopied] = useState(false)
  const [expandedReport, setExpandedReport] = useState(true)
  const [expandedRemediation, setExpandedRemediation] = useState(false)

  useEffect(() => {
    if (id) loadData()
  }, [id, mode])

  const loadData = async () => {
    setLoading(true)
    try {
      const [analysisData, summaryData, findingsData, chainsData] = await Promise.all([
        apiFetch(`/api/v1/analyses/${id}`),
        apiFetch(`/api/v1/analyses/${id}/summary?mode=${mode}`).catch(() => null),
        apiFetch(`/api/v1/analyses/${id}/findings?limit=50`),
        apiFetch(`/api/v1/analyses/${id}/chains`),
      ])
      setAnalysis(analysisData)
      setSummary(summaryData)
      setFindings(findingsData.data || [])
      setChains(chainsData.data || [])
    } catch (err) {
      console.error("Failed to load:", err)
    } finally {
      setLoading(false)
    }
  }

  const generateSummary = async () => {
    // Provide a mock AI summary for demo purposes
    setGenerating(true)
    try {
<<<<<<< Updated upstream
      const data = await apiFetch(`/api/v1/analyses/${id}/summary/generate?mode=${mode}`, {
        method: "POST",
      })
      setSummary(data)
=======
<<<<<<< Updated upstream
      // The new API generates summary on the fly with GET /summary
      const data = await getScanSummary(id as string)
      if (data) {
        setSummary({
          ...data,
          content_markdown: data.executive_briefing,
          sections: {
            executive_summary: data.executive_briefing,
            attack_narrative: "See detailed report below.",
            affected_assets: "Refer to Keys Findings section.",
            remediation_steps: "Implement security patches and rotate credentials."
          }
        })
      }
>>>>>>> Stashed changes
    } catch (err: any) {
      alert(`Failed: ${err.message}`)
=======
      const mock: Summary = {
        id: `${id}-mock-summary`,
        mode,
        model: "gpt-mock-1",
        cached: false,
        tokens_used: 4321,
        content_markdown: `# Executive Summary\n\nBetween 2026-03-20T02:10:00Z and 2026-03-20T04:45:00Z, the environment experienced a focused intrusion campaign targeting user authentication and lateral movement. The highest-confidence signals include repeated failed logins from two external IPs, anomalous process creation on internal hosts (host-03, host-07), and multiple outbound connections to uncommon ports (TCP/4444, TCP/8082). Estimated impact: potential credential compromise and temporary data staging on affected hosts.\n\n---\n\n## Top Findings (summary)\n1. Repeated failed/successful login attempts for service accounts from 198.51.100.23 and 203.0.113.45 (observed ~120 attempts).\n2. Suspicious process execution: \`powershell.exe\` spawning \`curl.exe\` on host-03 shortly after successful login.\n3. High-volume outbound connections to unknown external endpoints on ports 4444 and 8082 from host-07.\n4. Multiple alerts flagged by ML anomaly detection indicating unusual user behavior (alice, bob).\n\n---\n\n## Timeline (high level)\n- 02:12 UTC: Initial failed login bursts from 198.51.100.23 against user accounts.\n- 02:18 UTC: Successful authentication for \`svc-backup\` on host-03.\n- 02:25 UTC: Execution of \`powershell.exe\` with encoded commands on host-03.\n- 03:05 UTC: Outbound connections from host-07 to 198.51.100.23:4444.\n- 04:10 UTC: ML anomaly spikes for user \`alice\` and \`bob\`.\n\n---\n\n## Indicators of Compromise (IOCs)\n- IPs: 198.51.100.23, 203.0.113.45\n- Ports: 4444, 8082\n- Processes: powershell.exe -> curl.exe\n- Sample hash (observed in staging): \`e3b0c44298fc1c149afbf4c8996fb924\`\n\n---\n\n## Recommended Immediate Actions (Priority)\n1. Isolate host-03 and host-07 from network access (containment).\n2. Force reset credentials for affected service accounts and users (svc-backup, alice, bob).\n3. Block outbound IPs and ports at perimeter (198.51.100.23, 203.0.113.45; TCP/4444, TCP/8082).\n4. Preserve forensic images of affected hosts and collect relevant logs (auth, process, network).\n\n---\n\n## Suggested Triage Playbook\n- Triage owners: SOC Tier 2 (investigate), IR Team (contain/remediate), Network Team (block IPs).\n- Suggested tickets: \"Contain host-03 & host-07\", \"Rotate svc-backup credentials\", \"Collect forensic evidence for host-03\".\n\n## Confidence & Notes\n- Findings 1-3: High confidence (correlated across auth, process, and network signals).\n- ML anomalies: Medium confidence — recommend validating with additional logs.\n\n## Next Steps\n- Expand detection coverage for lateral movement and credential abuse.\n- Run focused EDR scans on affected hosts.\n- Review recent administrative changes and scheduled tasks.\n`,
        sections: {
          executive_summary: `Between 2026-03-20T02:10:00Z and 2026-03-20T04:45:00Z, the environment experienced a focused intrusion campaign targeting authentication and lateral movement. Key signals: repeated failed logins from two external IPs, suspicious process execution on host-03, and outbound connections from host-07 to uncommon ports. Estimated impact: credential compromise for at least one service account and data staging on host(s).`,
          attack_narrative: `An attacker likely performed credential-stuffing or brute-force against several accounts from external IPs (198.51.100.23, 203.0.113.45). After a successful authentication to svc-backup on host-03, the attacker executed a PowerShell payload that staged tools (curl) and initiated outbound beacons to external command-and-control endpoints (ports 4444, 8082). ML anomalies for users alice and bob suggest potential account takeover or unusual privilege escalation activity.`,
          affected_assets: `Hosts: host-03, host-07; Users: svc-backup, alice, bob; Network: connections to 198.51.100.23:4444 and 203.0.113.45:8082; Processes: powershell.exe -> curl.exe; Suspected file hash: e3b0c44298fc1c149afbf4c8996fb924.`,
          remediation_steps: `1) Contain hosts (isolate host-03 and host-07).\n2) Rotate credentials for impacted users and service accounts.\n3) Block the identified IPs and ports at the firewall.\n4) Preserve forensic data and perform EDR scans for persistence.\n5) Harden MFA and authentication rate-limiting.\n6) Review and patch any vulnerable services identified during triage.`,
        },
        created_at: new Date().toISOString(),
      }

      // small delay to show generating state
      await new Promise((r) => setTimeout(r, 500))
      setSummary(mock)
>>>>>>> Stashed changes
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (summary?.content_markdown) {
      await navigator.clipboard.writeText(summary.content_markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const riskScore = Math.round((analysis?.risk_score || 0) * 100)
  const threatLevel = riskScore >= 80 ? "CRITICAL" : riskScore >= 50 ? "HIGH" : riskScore >= 20 ? "MEDIUM" : "LOW"

  const uniqueUsers = [...new Set(findings.flatMap(f => f.affected_users || []))]
  const uniqueHosts = [...new Set(findings.flatMap(f => f.affected_hosts || []))]

  const findingsForTable = findings.map(f => ({
    severity: f.severity,
    title: f.title,
    type: f.detection_type,
    count: f.details?.count || f.details?.failed_attempts || 1,
    mitre: f.mitre_techniques || [],
  }))

  const allPhases = [...new Set(chains.flatMap(c => c.kill_chain_phases || []))]

  if (loading) {
    return (
      <DashboardLayout analysisId={id as string}>
        <SummaryPageSkeleton />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout analysisId={id as string}>
      <div className="space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: "rgba(108, 93, 211, 0.1)", borderRadius: "6px" }}>
              <Sparkles className="w-5 h-5" style={{ color: "#6C5DD3" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Summary</h1>
              <p className="text-xs text-zinc-500">{analysis?.filename}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-zinc-800 border border-zinc-700 p-0.5" style={{ borderRadius: "6px" }}>
              <button
                onClick={() => setMode("SOC_ANALYST")}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  borderRadius: "4px",
                  backgroundColor: mode === "SOC_ANALYST" ? "#6C5DD3" : "transparent",
                  color: mode === "SOC_ANALYST" ? "#ffffff" : undefined,
                }}
              >
                SOC Analyst
              </button>
              <button
                onClick={() => setMode("CISO")}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  borderRadius: "4px",
                  backgroundColor: mode === "CISO" ? "#6C5DD3" : "transparent",
                  color: mode === "CISO" ? "#ffffff" : undefined,
                }}
              >
                CISO Brief
              </button>
            </div>
            <button
              onClick={generateSummary}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
              style={{
                borderRadius: "6px",
                backgroundColor: generating ? "#27272a" : "#6C5DD3",
                color: "#ffffff",
                cursor: generating ? "not-allowed" : "pointer",
              }}
            >
              {generating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><RefreshCw className="w-4 h-4" />{summary ? "Regenerate" : "Generate"}</>}
            </button>
          </div>
        </motion.div>

        {/* Pipeline Flow */}
        <AttackFlow
          totalEvents={analysis?.total_events || 0}
          totalFindings={analysis?.total_findings || 0}
          totalChains={analysis?.total_attack_chains || 0}
          threatLevel={threatLevel}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          <AttackRadar findings={findings} />
          <FindingsSummaryTable findings={findingsForTable} />
        </div>

        {/* No Summary State */}
        {!summary && !generating ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center py-12"
            style={{ borderRadius: "6px" }}
          >
            <div className="w-14 h-14 bg-zinc-800 flex items-center justify-center mb-4" style={{ borderRadius: "6px" }}>
              <FileText className="w-7 h-7 text-zinc-500" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">No Summary Generated</h3>
            <p className="text-xs text-zinc-400 mb-4">Generate an AI-powered summary of the security analysis</p>
            <button
              onClick={generateSummary}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: "#6C5DD3", borderRadius: "6px" }}
            >
              <Sparkles className="w-4 h-4" />Generate Summary
            </button>
          </motion.div>
        ) : summary ? (
          <>
            {/* Executive Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border p-5"
              style={{
                borderRadius: "6px",
                backgroundColor: threatLevel === "CRITICAL" ? "rgba(220, 38, 38, 0.1)" : threatLevel === "HIGH" ? "rgba(217, 119, 6, 0.1)" : "rgba(34, 197, 94, 0.1)",
                borderColor: threatLevel === "CRITICAL" ? "rgba(220, 38, 38, 0.25)" : threatLevel === "HIGH" ? "rgba(217, 119, 6, 0.25)" : "rgba(34, 197, 94, 0.25)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Executive Summary</p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 text-white"
                  style={{
                    borderRadius: "4px",
                    backgroundColor: threatLevel === "CRITICAL" ? "#EF4444" : threatLevel === "HIGH" ? "#F59E0B" : "#22C55E",
                  }}
                >
                  {threatLevel}
                </span>
              </div>
              <p
                className="text-sm text-zinc-300 leading-relaxed"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 6,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {summary.sections.executive_summary || summary.content_markdown.slice(0, 500)}
              </p>
            </motion.div>

            {/* Main Split */}
            <div className="grid grid-cols-3 gap-4">
              {/* Left: Expandable Report */}
              <div className="col-span-2 space-y-3">
                {/* AI Report */}
                <div className="bg-zinc-900 border border-zinc-800" style={{ borderRadius: "6px" }}>
                  <div
                    onClick={() => setExpandedReport(!expandedReport)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                    style={{ borderRadius: "6px" }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" style={{ color: "#6C5DD3" }} />
                      <span className="text-sm font-semibold text-white">AI Analysis Report</span>
                      <span className="text-[9px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5" style={{ borderRadius: "3px" }}>
                        {summary.model}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyToClipboard() }}
                        className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-700 transition-colors"
                        style={{ borderRadius: "4px" }}
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      {expandedReport ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedReport && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-zinc-800 pt-4">
                          <div className="prose prose-sm prose-invert max-w-none prose-headings:text-zinc-200 prose-p:text-zinc-400 prose-strong:text-zinc-200 prose-li:text-zinc-400">
                            <ReactMarkdown>{summary.content_markdown}</ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Remediation */}
                <div className="bg-zinc-900 border border-zinc-800" style={{ borderRadius: "6px" }}>
                  <div
                    onClick={() => setExpandedRemediation(!expandedRemediation)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                    style={{ borderRadius: "6px" }}
                  >
                    <span className="text-sm font-semibold text-white">Remediation Steps</span>
                    {expandedRemediation ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </div>
                  <AnimatePresence>
                    {expandedRemediation && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-zinc-800 pt-4">
                          <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                            {summary.sections.remediation_steps || "No remediation steps available."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Attack Chains Preview */}
                {chains.length > 0 && (
                  <div className="bg-zinc-900 border border-zinc-800 p-4" style={{ borderRadius: "6px" }}>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Attack Chains</p>
                    <div className="space-y-3">
                      {chains.slice(0, 3).map((chain) => (
                        <div key={chain.id} className="bg-zinc-800/50 border border-zinc-700/50 p-3" style={{ borderRadius: "6px" }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">{chain.affected_users[0] || "Unknown"}</span>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 text-white"
                              style={{
                                borderRadius: "4px",
                                backgroundColor: chain.chain_confidence >= 0.8 ? "#EF4444" : chain.chain_confidence >= 0.5 ? "#F59E0B" : "#00A8CC",
                              }}
                            >
                              {Math.round(chain.chain_confidence * 100)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            {chain.kill_chain_phases.slice(0, 4).map((phase) => (
                              <span
                                key={phase}
                                className="text-[9px] font-semibold px-1.5 py-0.5 text-white capitalize"
                                style={{ backgroundColor: "#6C5DD3", borderRadius: "3px" }}
                              >
                                {phase.split("-")[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Key Findings */}
              <KeyFindings findings={findingsForTable} affectedUsers={uniqueUsers} affectedHosts={uniqueHosts} />
            </div>

            {/* Kill Chain Progression */}
            {allPhases.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 p-4" style={{ borderRadius: "6px" }}>
                <KillChainTimeline phases={allPhases} />
              </div>
            )}
          </>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
